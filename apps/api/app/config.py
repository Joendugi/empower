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
    # Set on Kubernetes: production startup then refuses to run without Redis.
    REQUIRE_REDIS: bool = False

    # Security
    SECRET_KEY: str = "CHANGE-ME-IN-PRODUCTION-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    # Short-lived; the PWA renews it with the refresh token (services/sessions.py).
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    AUTH_COOKIE_NAME: str = "empower_session"
    REFRESH_COOKIE_NAME: str = "empower_refresh"
    AUTH_COOKIE_SECURE: bool = False
    ADMIN_STAFF_KEY: str = ""
    TRUSTED_HOSTS: list[str] = []
    PUBLIC_HOST: str = ""
    PUBLIC_APP_URL: str = ""

    # Environment
    ENVIRONMENT: str = "development"  # development | staging | production

    # Run Alembic on startup. Safe with several pods: env.py takes a Postgres advisory lock.
    RUN_MIGRATIONS_ON_STARTUP: bool = True
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    # How often each pod reloads Studio-published lessons from Postgres (another pod may have published).
    PUBLISHED_REFRESH_SECONDS: float = 30.0

    # Proxies in front of the API that append to X-Forwarded-For. CloudFront + ALB = 2.
    # 0 keeps the old behaviour (first entry), which the client controls.
    TRUSTED_PROXY_HOPS: int = 0
    # CloudFront adds this secret header to API requests; when set, requests without it are refused
    # so the load balancer can't be called directly.
    ORIGIN_VERIFY_SECRET: str = ""

    # Uploaded files: "local" writes to UPLOAD_DIR, "s3" writes to UPLOADS_BUCKET.
    STORAGE_BACKEND: str = "local"
    UPLOAD_DIR: str = str(Path(__file__).resolve().parents[1] / ".uploads")
    UPLOADS_BUCKET: str = ""
    AWS_REGION: str = ""

    # Error reporting. Empty = off. APP_VERSION is set to the git SHA by the deploy.
    APP_VERSION: str = "0.1.0"
    SENTRY_DSN: str = ""
    SENTRY_TRACES_SAMPLE_RATE: float = 0.05

    # CORS — JSON list or comma-separated origins
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
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
    def apply_supabase_database_url(self) -> Settings:
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

    def public_api_origin(self) -> str:
        host = self.PUBLIC_HOST.strip()
        if host.startswith("http://") or host.startswith("https://"):
            return host.rstrip("/")
        if host:
            return f"https://{host}"
        return "http://localhost:8000"

    def public_app_origin(self) -> str:
        app = self.PUBLIC_APP_URL.strip().rstrip("/")
        if app:
            return app
        if self.PUBLIC_HOST.strip():
            return self.public_api_origin()
        return "http://localhost:5173"

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

    # CTFd challenge platform integration
    CTFD_URL: str = "http://localhost:8000/ctfd"
    CTFD_API_KEY: str = ""
    CTFD_WEBHOOK_SECRET: str = ""  # empty = webhook disabled; set 16+ chars to enable

    # Tutor / Open edX LTI Bridge. Off by default: launch id_tokens are not yet signature-verified,
    # so startup refuses LTI_ENABLED in production (see security.assert_secure_settings).
    LTI_ENABLED: bool = False
    TUTOR_LMS_URL: str = "http://local.overhang.io"
    LTI_TOOL_KEY_ID: str = "cyberlearn-lti-key-1"

    # Lesson YAML (repo-root /content by default)
    CONTENT_DIR: str = str(Path(__file__).resolve().parents[3] / "content")

    # Rate limiting + timeouts
    AI_HINT_DAILY_LIMIT: int = 10  # free tier
    RUBRIC_FEEDBACK_DAILY_LIMIT: int = 20  # AI-graded open answers per learner per UTC day; 0 = unlimited
    LAB_HOURS_DAILY_LIMIT: float = 2.0  # hours per learner per day
    REQUEST_TIMEOUT_SECONDS: float = 25.0
    RATE_LIMIT_PER_MINUTE: int = 120
    RATE_LIMIT_AUTH_PER_MINUTE: int = 20
    RATE_LIMIT_WRITE_PER_MINUTE: int = 60

    # LLM & Formative Feedback
    LLM_PROVIDER: str = "auto"  # "auto" | "gemini" | "openai" | "heuristic"
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    LLM_MODEL: str = "gemini-1.5-flash"

    # Optional SMTP. Empty host = no send (PWA falls back to free mailto / inbox).
    # Brevo free = 300/day. Amazon SES ≈ $0.10 / 1,000. College Google Workspace = $0 extra.
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM: str = "Empower <noreply@localhost>"
    SMTP_STARTTLS: bool = True
    # Resend (https://resend.com) — preferred production path. Free tier ~100/day.
    RESEND_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()
