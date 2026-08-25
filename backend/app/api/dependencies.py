from collections.abc import Generator
from typing import Annotated
from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models.user import User
from app.services.auth import get_user_by_id

bearer_scheme = HTTPBearer(auto_error=False)


def get_database_session() -> Generator[Session, None, None]:
    yield from get_db()


def authentication_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail={"error": {"code": "INVALID_AUTHENTICATION", "message": "Invalid authentication.", "details": None}},
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    db: Annotated[Session, Depends(get_database_session)],
) -> User:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise authentication_error()
    try:
        payload = decode_token(credentials.credentials, "access")
        user_id = UUID(str(payload["sub"]))
    except (ValueError, TypeError):
        raise authentication_error() from None

    user = get_user_by_id(db, user_id)
    if user is None:
        raise authentication_error()
    return user


def get_current_active_user(current_user: Annotated[User, Depends(get_current_user)]) -> User:
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"error": {"code": "ACCOUNT_INACTIVE", "message": "Account is inactive.", "details": None}},
        )
    return current_user
