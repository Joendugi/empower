from __future__ import annotations

import hashlib
import hmac

from fastapi import Response

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


def staff_digest(value: str) -> str:
    payload = f"{STAFF_HASH_PREFIX}:{value.strip()}".encode()
    return hashlib.sha256(payload).hexdigest()


def staff_key_matches(passphrase: str) -> bool:
    expected = settings.ADMIN_STAFF_KEY.strip()
    if len(expected) < 12 or len(passphrase.strip()) < 10:
        return False
    return hmac.compare_digest(staff_digest(expected), staff_digest(passphrase))


def attach_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=settings.AUTH_COOKIE_NAME,
        value=token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=settings.cookie_secure,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(
        key=settings.AUTH_COOKIE_NAME,
        path="/",
        secure=settings.cookie_secure,
        httponly=True,
        samesite="lax",
    )
