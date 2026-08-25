from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_active_user, get_database_session
from app.models.user import User
from app.schemas.auth import (
    MessageResponse,
    RefreshTokenRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.services.auth import (
    DuplicateEmailError,
    InactiveUserError,
    InvalidAuthTokenError,
    InvalidCredentialsError,
    authenticate_user,
    create_user,
    issue_token_pair,
    revoke_refresh_token,
    rotate_refresh_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def auth_error(code: str, message: str, status_code: int) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"error": {"code": code, "message": message, "details": None}},
    )


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserRegisterRequest, db: Annotated[Session, Depends(get_database_session)]) -> User:
    try:
        return create_user(db, payload.email, payload.password, payload.full_name)
    except DuplicateEmailError as exc:
        raise auth_error("EMAIL_ALREADY_REGISTERED", "Email is already registered.", status.HTTP_409_CONFLICT) from exc


@router.post("/login", response_model=TokenResponse)
def login_user(payload: UserLoginRequest, db: Annotated[Session, Depends(get_database_session)]) -> TokenResponse:
    try:
        user = authenticate_user(db, payload.email, payload.password)
    except InvalidCredentialsError as exc:
        raise auth_error("INVALID_CREDENTIALS", "Invalid email or password.", status.HTTP_401_UNAUTHORIZED) from exc
    except InactiveUserError as exc:
        raise auth_error("ACCOUNT_INACTIVE", "Account is inactive.", status.HTTP_403_FORBIDDEN) from exc

    access_token, refresh_token, expires_in, refresh_expires_at = issue_token_pair(db, user)
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        refresh_expires_at=refresh_expires_at,
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh_tokens(payload: RefreshTokenRequest, db: Annotated[Session, Depends(get_database_session)]) -> TokenResponse:
    try:
        access_token, refresh_token, expires_in, refresh_expires_at = rotate_refresh_token(db, payload.refresh_token)
    except InvalidAuthTokenError as exc:
        raise auth_error("INVALID_REFRESH_TOKEN", "Invalid refresh token.", status.HTTP_401_UNAUTHORIZED) from exc
    except InactiveUserError as exc:
        raise auth_error("ACCOUNT_INACTIVE", "Account is inactive.", status.HTTP_403_FORBIDDEN) from exc

    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=expires_in,
        refresh_expires_at=refresh_expires_at,
    )


@router.post("/logout", response_model=MessageResponse)
def logout(payload: RefreshTokenRequest, db: Annotated[Session, Depends(get_database_session)]) -> MessageResponse:
    try:
        revoke_refresh_token(db, payload.refresh_token)
    except InvalidAuthTokenError as exc:
        raise auth_error("INVALID_REFRESH_TOKEN", "Invalid refresh token.", status.HTTP_401_UNAUTHORIZED) from exc
    return MessageResponse(message="Logged out successfully.")


@router.get("/me", response_model=UserResponse)
def read_current_user(current_user: Annotated[User, Depends(get_current_active_user)]) -> User:
    return current_user
