from collections.abc import Generator
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.main import app
from app.models.user import RefreshToken, User


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def email_prefix() -> str:
    return f"test-{uuid4().hex}"


@pytest.fixture(autouse=True)
def cleanup_test_users(db_session: Session) -> Generator[None, None, None]:
    yield
    test_users = select(User.id).where(User.email.like("test-%@example.com"))
    db_session.execute(delete(RefreshToken).where(RefreshToken.user_id.in_(test_users)))
    db_session.execute(delete(User).where(User.email.like("test-%@example.com")))
    db_session.commit()
