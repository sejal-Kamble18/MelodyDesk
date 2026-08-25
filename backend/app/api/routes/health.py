from fastapi import APIRouter, HTTPException, status

from app.db.session import check_database_connection

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/database")
def database_health_check() -> dict[str, str]:
    if check_database_connection():
        return {"status": "ok", "database": "available"}

    raise HTTPException(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        detail={
            "error": {
                "code": "DATABASE_UNAVAILABLE",
                "message": "Database is unavailable.",
                "details": None,
            }
        },
    )
