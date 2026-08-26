from functools import lru_cache
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    project_name: str = "MelodyDesk API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    backend_url: AnyHttpUrl | str = "http://localhost:8000"
    frontend_url: AnyHttpUrl | str = "http://localhost:5173"
    cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

@lru_cache
def get_settings() -> Settings:
    return Settings()
