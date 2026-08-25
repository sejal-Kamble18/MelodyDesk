from fastapi.testclient import TestClient

from app.api.routes import health


def test_root_endpoint(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "MelodyDesk backend is running."}


def test_health_endpoint(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_database_health_endpoint_when_available(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(health, "check_database_connection", lambda: True)

    response = client.get("/api/v1/health/database")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "available"}


def test_database_health_endpoint_when_unavailable(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(health, "check_database_connection", lambda: False)

    response = client.get("/api/v1/health/database")

    assert response.status_code == 503
    assert response.json() == {
        "error": {
            "code": "DATABASE_UNAVAILABLE",
            "message": "Database is unavailable.",
            "details": None,
        }
    }
