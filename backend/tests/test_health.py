from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "MelodyDesk backend is running."}


def test_health_endpoint(client: TestClient) -> None:
    response = client.get("/api/v1/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_focus_dj_endpoint_returns_recommendation(client: TestClient) -> None:
    response = client.post(
        "/api/v1/ai/focus-dj",
        json={
            "activity": "coding",
            "mood": "focused",
            "duration_minutes": 45,
            "preferred_genres": ["Electronic", "Lo-fi"],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["query"]
    assert payload["energy"] in {"low", "medium", "high"}
    assert payload["reason"]
