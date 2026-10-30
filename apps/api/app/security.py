from __future__ import annotations

import hashlib
import hmac
from urllib.parse import urlparse

from app.config import settings

STAFF_HASH_PREFIX = "empower-staff-v1"
INSECURE_SECRETS = {
    "CHANGE-ME-IN-PRODUCTION-use-openssl-rand-hex-32",
    "CHANGE-ME",
    "changeme",
    "devpassword",
}


def assert_secure_settings() -> None:
    if settings.ENVIRONMENT != "production":
        return
    secret = settings.SECRET_KEY.strip()
    if len(secret) < 32 or secret in INSECURE_SECRETS or "CHANGE-ME" in secret:
        raise RuntimeError("SECRET_KEY is missing or still a default value")
    database = settings.DATABASE_URL.lower()
    if any(token in database for token in ("changeme", "devpassword", "change-me")):
        raise RuntimeError("DATABASE_URL still uses a default password")
    staff = settings.ADMIN_STAFF_KEY.strip()
    if len(staff) < 12:
        raise RuntimeError("ADMIN_STAFF_KEY must be set to 12+ characters in production")
    ctfd_secret = settings.CTFD_WEBHOOK_SECRET.strip()
    if ctfd_secret and len(ctfd_secret) < 16:
        raise RuntimeError("CTFD_WEBHOOK_SECRET must be 16+ characters when set")
    if settings.LTI_ENABLED:
        raise RuntimeError("LTI_ENABLED is not production-ready: LTI launch tokens are not signature-verified yet")
    if not settings.CORS_ORIGINS:
        raise RuntimeError("CORS_ORIGINS must be set in production")
    if any(origin.strip() == "*" for origin in settings.CORS_ORIGINS):
        raise RuntimeError("CORS_ORIGINS must not include * in production")
    if settings.redis_enabled:
        parsed = urlparse(settings.REDIS_URL)
        if not parsed.password:
            raise RuntimeError("REDIS_URL must include a password in production")
    elif settings.REQUIRE_REDIS:
        # The memory fallback gives every pod its own rate limits and leaderboard.
        raise RuntimeError("REDIS_URL is required when REQUIRE_REDIS is on (several API pods)")
    if settings.STORAGE_BACKEND == "s3" and not settings.UPLOADS_BUCKET:
        raise RuntimeError("UPLOADS_BUCKET must be set when STORAGE_BACKEND=s3")
    if settings.STORAGE_BACKEND not in {"local", "s3"}:
        raise RuntimeError("STORAGE_BACKEND must be local or s3")


def staff_digest(value: str) -> str:
    payload = f"{STAFF_HASH_PREFIX}:{value.strip()}".encode()
    return hashlib.sha256(payload).hexdigest()


def staff_key_matches(passphrase: str) -> bool:
    expected = settings.ADMIN_STAFF_KEY.strip()
    if len(expected) < 12 or len(passphrase.strip()) < 10:
        return False
    return hmac.compare_digest(staff_digest(expected), staff_digest(passphrase))
