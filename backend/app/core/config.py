from functools import lru_cache
from pydantic import AnyHttpUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=(".env", ".env.local"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    project_name: str = "MelodyDesk API"
    environment: str = "development"
    api_v1_prefix: str = "/api/v1"
    backend_url: AnyHttpUrl | str = "http://localhost:8000"
    frontend_url: AnyHttpUrl | str = "http://localhost:5173"
    cors_origins: str = "http://localhost:5173"
    openai_api_key: SecretStr | None = None
    openai_model: str = "gpt-4.1-mini"
    openai_base_url: str = "https://api.openai.com/v1"
    spotify_client_id: SecretStr | None = None
    spotify_client_secret: SecretStr | None = None

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

@lru_cache
def get_settings() -> Settings:
    return Settings()
