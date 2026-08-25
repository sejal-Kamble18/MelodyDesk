from datetime import UTC, datetime, timedelta
from typing import Literal
from uuid import uuid4

import bcrypt
import jwt
from jwt import InvalidTokenError

from app.core.config import Settings, get_settings

TokenType = Literal["access", "refresh"]


def hash_password(password: str) -> str:
    password_bytes = password.encode("utf-8")
    if len(password_bytes) > 72:
        raise ValueError("Password must be 72 bytes or fewer.")
    return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))
    except (TypeError, ValueError):
        return False


def create_token(
    subject: str,
    token_type: TokenType,
    expires_delta: timedelta,
    settings: Settings | None = None,
) -> tuple[str, str, datetime]:
    app_settings = settings or get_settings()
    issued_at = datetime.now(UTC)
    expires_at = issued_at + expires_delta
    token_id = str(uuid4())
    payload = {
        "sub": subject,
        "type": token_type,
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
        "jti": token_id,
    }
    token = jwt.encode(
        payload,
        app_settings.jwt_secret_key.get_secret_value(),
        algorithm=app_settings.jwt_algorithm,
    )
    return token, token_id, expires_at


def decode_token(token: str, expected_type: TokenType, settings: Settings | None = None) -> dict[str, str | int]:
    app_settings = settings or get_settings()
    try:
        payload = jwt.decode(
            token,
            app_settings.jwt_secret_key.get_secret_value(),
            algorithms=[app_settings.jwt_algorithm],
        )
    except InvalidTokenError as exc:
        raise ValueError("Invalid token.") from exc

    if payload.get("type") != expected_type:
        raise ValueError("Invalid token type.")
    if not payload.get("sub") or not payload.get("jti"):
        raise ValueError("Invalid token claims.")
    return payload
