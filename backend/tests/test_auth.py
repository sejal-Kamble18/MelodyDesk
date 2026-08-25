from datetime import UTC, datetime, timedelta

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.core.security import create_token, hash_password
from app.models.user import RefreshToken, User
from app.services.auth import hash_token_identifier


def register_payload(email: str) -> dict[str, str]:
    return {"email": email, "password": "StrongPass1", "full_name": " Test User "}


def test_register_success_normalizes_and_hides_password(client: TestClient, db_session: Session, email_prefix: str) -> None:
    response = client.post("/api/v1/auth/register", json=register_payload(f"{email_prefix}@EXAMPLE.com"))

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == f"{email_prefix}@example.com"
    assert body["full_name"] == "Test User"
    assert "password" not in body
    assert "password_hash" not in body

    user = db_session.query(User).filter(User.email == f"{email_prefix}@example.com").one()
    assert user.password_hash != "StrongPass1"
    assert user.password_hash.startswith("$2")


def test_register_duplicate_email_returns_409(client: TestClient, email_prefix: str) -> None:
    payload = register_payload(f"{email_prefix}@example.com")
    assert client.post("/api/v1/auth/register", json=payload).status_code == 201

    response = client.post("/api/v1/auth/register", json=payload)

    assert response.status_code == 409
    assert response.json()["error"]["code"] == "EMAIL_ALREADY_REGISTERED"


def test_register_rejects_invalid_email_and_weak_password(client: TestClient, email_prefix: str) -> None:
    invalid_email = client.post("/api/v1/auth/register", json=register_payload("not-an-email"))
    weak_password = client.post(
        "/api/v1/auth/register",
        json={"email": f"{email_prefix}@example.com", "password": "weakpass", "full_name": "User"},
    )

    assert invalid_email.status_code == 422
    assert weak_password.status_code == 422


def test_login_success_and_invalid_credentials(client: TestClient, email_prefix: str) -> None:
    email = f"{email_prefix}@example.com"
    client.post("/api/v1/auth/register", json=register_payload(email))

    success = client.post("/api/v1/auth/login", json={"email": email, "password": "StrongPass1"})
    wrong_password = client.post("/api/v1/auth/login", json={"email": email, "password": "WrongPass1"})
    unknown_email = client.post("/api/v1/auth/login", json={"email": f"{email_prefix}-unknown@example.com", "password": "StrongPass1"})

    assert success.status_code == 200
    body = success.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]
    assert body["expires_in"] > 0
    assert wrong_password.status_code == 401
    assert unknown_email.status_code == 401


def test_inactive_user_login_and_me_are_rejected(client: TestClient, db_session: Session, email_prefix: str) -> None:
    user = User(email=f"{email_prefix}@example.com", password_hash=hash_password("StrongPass1"), is_active=False)
    db_session.add(user)
    db_session.commit()

    login = client.post("/api/v1/auth/login", json={"email": user.email, "password": "StrongPass1"})
    access_token, _, _ = create_token(str(user.id), "access", timedelta(minutes=15))
    me = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {access_token}"})

    assert login.status_code == 403
    assert me.status_code == 403


def test_me_authentication_errors_and_success(client: TestClient, email_prefix: str) -> None:
    email = f"{email_prefix}@example.com"
    client.post("/api/v1/auth/register", json=register_payload(email))
    tokens = client.post("/api/v1/auth/login", json={"email": email, "password": "StrongPass1"}).json()

    success = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"})
    missing = client.get("/api/v1/auth/me")
    malformed = client.get("/api/v1/auth/me", headers={"Authorization": "Bearer not-a-token"})
    wrong_type = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['refresh_token']}"})
    expired_access, _, _ = create_token("00000000-0000-0000-0000-000000000000", "access", timedelta(seconds=-1))
    expired = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {expired_access}"})

    assert success.status_code == 200
    assert success.json()["email"] == email
    assert missing.status_code == 401
    assert malformed.status_code == 401
    assert wrong_type.status_code == 401
    assert expired.status_code == 401


def test_refresh_rotates_and_rejects_wrong_or_revoked_tokens(client: TestClient, email_prefix: str) -> None:
    email = f"{email_prefix}@example.com"
    client.post("/api/v1/auth/register", json=register_payload(email))
    tokens = client.post("/api/v1/auth/login", json={"email": email, "password": "StrongPass1"}).json()

    access_as_refresh = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["access_token"]})
    refreshed = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    reused = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})

    assert access_as_refresh.status_code == 401
    assert refreshed.status_code == 200
    assert refreshed.json()["access_token"]
    assert refreshed.json()["refresh_token"] != tokens["refresh_token"]
    assert reused.status_code == 401


def test_expired_refresh_token_is_rejected(client: TestClient, db_session: Session, email_prefix: str) -> None:
    user = User(email=f"{email_prefix}@example.com", password_hash=hash_password("StrongPass1"))
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    token, token_id, _ = create_token(str(user.id), "refresh", timedelta(seconds=-1))
    db_session.add(
        RefreshToken(
            user_id=user.id,
            token_identifier_hash=hash_token_identifier(token_id),
            expires_at=datetime.now(UTC) - timedelta(seconds=1),
        )
    )
    db_session.commit()

    response = client.post("/api/v1/auth/refresh", json={"refresh_token": token})

    assert response.status_code == 401


def test_logout_revokes_refresh_token(client: TestClient, email_prefix: str) -> None:
    email = f"{email_prefix}@example.com"
    client.post("/api/v1/auth/register", json=register_payload(email))
    tokens = client.post("/api/v1/auth/login", json={"email": email, "password": "StrongPass1"}).json()

    logout = client.post("/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]})
    refresh_after_logout = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})

    assert logout.status_code == 200
    assert logout.json() == {"message": "Logged out successfully."}
    assert refresh_after_logout.status_code == 401
