from datetime import UTC, datetime, timedelta
from hashlib import sha256
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_token, decode_token, hash_password, verify_password
from app.models.user import RefreshToken, User


class DuplicateEmailError(Exception):
    pass


class InvalidCredentialsError(Exception):
    pass


class InvalidAuthTokenError(Exception):
    pass


class InactiveUserError(Exception):
    pass


def normalize_email(email: str) -> str:
    return email.strip().lower()


def hash_token_identifier(token_identifier: str) -> str:
    return sha256(token_identifier.encode("utf-8")).hexdigest()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == normalize_email(email)))


def get_user_by_id(db: Session, user_id: UUID) -> User | None:
    return db.get(User, user_id)


def create_user(db: Session, email: str, password: str, full_name: str | None = None) -> User:
    user = User(
        email=normalize_email(email),
        password_hash=hash_password(password),
        full_name=full_name.strip() if full_name else None,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise DuplicateEmailError from exc
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = get_user_by_email(db, email)
    if user is None or not verify_password(password, user.password_hash):
        raise InvalidCredentialsError
    if not user.is_active:
        raise InactiveUserError
    return user


def issue_token_pair(db: Session, user: User) -> tuple[str, str, int, datetime]:
    settings = get_settings()
    access_delta = timedelta(minutes=settings.access_token_expire_minutes)
    refresh_delta = timedelta(days=settings.refresh_token_expire_days)
    access_token, _, _ = create_token(str(user.id), "access", access_delta, settings)
    refresh_token, refresh_jti, refresh_expires_at = create_token(str(user.id), "refresh", refresh_delta, settings)

    db.add(
        RefreshToken(
            user_id=user.id,
            token_identifier_hash=hash_token_identifier(refresh_jti),
            expires_at=refresh_expires_at,
        )
    )
    db.commit()
    return access_token, refresh_token, int(access_delta.total_seconds()), refresh_expires_at


def validate_refresh_token(db: Session, refresh_token: str) -> tuple[User, RefreshToken]:
    try:
        payload = decode_token(refresh_token, "refresh")
        user_id = UUID(str(payload["sub"]))
    except (ValueError, TypeError) as exc:
        raise InvalidAuthTokenError from exc

    token_hash = hash_token_identifier(str(payload["jti"]))
    stored_token = db.scalar(
        select(RefreshToken).where(
            RefreshToken.token_identifier_hash == token_hash,
            RefreshToken.revoked_at.is_(None),
            RefreshToken.expires_at > datetime.now(UTC),
        )
    )
    if stored_token is None:
        raise InvalidAuthTokenError

    user = get_user_by_id(db, user_id)
    if user is None:
        raise InvalidAuthTokenError
    if not user.is_active:
        raise InactiveUserError
    return user, stored_token


def rotate_refresh_token(db: Session, refresh_token: str) -> tuple[str, str, int, datetime]:
    user, stored_token = validate_refresh_token(db, refresh_token)
    stored_token.revoked_at = datetime.now(UTC)
    access_token, new_refresh_token, expires_in, refresh_expires_at = issue_token_pair(db, user)
    return access_token, new_refresh_token, expires_in, refresh_expires_at


def revoke_refresh_token(db: Session, refresh_token: str) -> None:
    _, stored_token = validate_refresh_token(db, refresh_token)
    stored_token.revoked_at = datetime.now(UTC)
    db.commit()
