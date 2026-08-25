from functools import lru_cache
from typing import Annotated

from pydantic import AnyHttpUrl, SecretStr, field_validator, model_validator
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
    database_url: SecretStr = SecretStr("postgresql+psycopg://localhost:5432/melodydesk")
    jwt_secret_key: SecretStr
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    @field_validator("cors_origins", mode="before")
    @classmethod
    def parse_cors_origins(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    @model_validator(mode="after")
    def validate_security_settings(self) -> "Settings":
        secret = self.jwt_secret_key.get_secret_value()
        if len(secret) < 32:
            raise ValueError("JWT_SECRET_KEY must be at least 32 characters long.")
        if self.jwt_algorithm != "HS256":
            raise ValueError("Only HS256 JWT signing is supported.")
        if self.access_token_expire_minutes <= 0:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be positive.")
        if self.refresh_token_expire_days <= 0:
            raise ValueError("REFRESH_TOKEN_EXPIRE_DAYS must be positive.")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
