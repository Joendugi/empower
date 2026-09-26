from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


def normalize_redis_url(url: str) -> str:
    value = url.strip()
    parsed = urlparse(value)
    if parsed.hostname and parsed.hostname.endswith(".upstash.io") and parsed.scheme == "redis":
        return "rediss://" + value[len("redis://") :]
    return value


def normalize_database_url(url: str) -> str:
    value = url.strip()
    if value.startswith("postgres://"):
        value = "postgresql://" + value[len("postgres://") :]
    if value.startswith("postgresql://") and "+asyncpg" not in value:
        value = value.replace("postgresql://", "postgresql+asyncpg://", 1)
    return value


class Settings(BaseSettings):
    """
    Application settings — loaded from environment variables / .env file.
    All values can be overridden via environment variables (takes precedence).
    """

    # Database — local Postgres, or a new Empower Supabase URI
    DATABASE_URL: str = "postgresql+asyncpg://cyberlearn:devpassword@localhost:5432/cyberlearn"
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_DB_URL: str = ""
    SUPABASE_SSL_INSECURE: bool = False

    # Cache — "off" uses free in-process MemoryCache. Redis/Upstash is optional.
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    AUTH_COOKIE_NAME: str = "empower_session"
    AUTH_COOKIE_SECURE: bool = False
    ADMIN_STAFF_KEY: str = ""
    TRUSTED_HOSTS: list[str] = []
    PUBLIC_HOST: str = ""

    # Environment
    ENVIRONMENT: str = "development"  # development | staging | production

    # CORS — JSON list or comma-separated origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    @field_validator("CORS_ORIGINS", "TRUSTED_HOSTS", mode="before")
    @classmethod
    def parse_host_list(cls, value: object) -> object:
        if isinstance(value, str):
            text = value.strip()
            if text.startswith("["):
                import json

                return json.loads(text)
            return [item.strip() for item in text.split(",") if item.strip()]
        return value

    @model_validator(mode="after")
    def apply_supabase_database_url(self) -> "Settings":
        if self.SUPABASE_DB_URL.strip() and "sqlite" not in self.DATABASE_URL:
            source = self.SUPABASE_DB_URL.strip()
        else:
            source = self.DATABASE_URL
        self.DATABASE_URL = normalize_database_url(source)
        self.REDIS_URL = normalize_redis_url(self.REDIS_URL)
        host = self.PUBLIC_HOST.strip().removeprefix("https://").removeprefix("http://").strip("/")
        if host:
            origin = f"https://{host}"
            if origin not in self.CORS_ORIGINS:
                self.CORS_ORIGINS = [*self.CORS_ORIGINS, origin]
        return self

    @property
    def is_production(self) -> bool:
        return self.ENVIRONMENT == "production"

    @property
    def redis_enabled(self) -> bool:
        value = (self.REDIS_URL or "").strip().lower()
        return value not in {"", "off", "none", "disabled", "false"}

    @property
    def is_supabase(self) -> bool:
        host = self.DATABASE_URL.lower()
        return "supabase.co" in host or "pooler.supabase.com" in host

    @property
    def uses_supabase_pooler(self) -> bool:
        return self.is_supabase and ":6543" in self.DATABASE_URL

    @property
    def cookie_secure(self) -> bool:
        return self.is_production or self.AUTH_COOKIE_SECURE

    @property
    def allowed_hosts(self) -> list[str]:
        hosts = {"localhost", "127.0.0.1"}
        hosts.update(item for item in self.TRUSTED_HOSTS if item)
        for origin in self.CORS_ORIGINS:
            parsed = urlparse(origin if "://" in origin else f"https://{origin}")
            if parsed.hostname:
                hosts.add(parsed.hostname)
        return sorted(hosts)

    # Open edX integration
    EDX_LMS_URL: str = "http://localhost:8080"
    EDX_API_KEY: str = ""

    # Lesson YAML (repo-root /content by default)
    CONTENT_DIR: str = str(Path(__file__).resolve().parents[3] / "content")

    # Rate limiting + timeouts
    AI_HINT_DAILY_LIMIT: int = 10  # free tier
    LAB_HOURS_DAILY_LIMIT: float = 2.0  # hours per learner per day
    REQUEST_TIMEOUT_SECONDS: float = 25.0
    RATE_LIMIT_PER_MINUTE: int = 120
    RATE_LIMIT_AUTH_PER_MINUTE: int = 20
    RATE_LIMIT_WRITE_PER_MINUTE: int = 60

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
