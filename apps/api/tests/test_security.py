from __future__ import annotations

import pytest
from fastapi import Response

from app.config import Settings, normalize_database_url
from app.security import assert_secure_settings, attach_session_cookie, staff_key_matches


def test_normalize_upstash_uses_tls() -> None:
    from app.config import normalize_redis_url

    raw = "redis://default:token@funky-eft-44362.upstash.io:6379"
    assert normalize_redis_url(raw).startswith("rediss://")


def test_normalize_supabase_uri() -> None:
    url = normalize_database_url("postgres://postgres:secret@db.abc.supabase.co:5432/postgres")
    assert url.startswith("postgresql+asyncpg://")
    assert "supabase.co" in url


def test_production_rejects_default_secret(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import security

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="CHANGE-ME-IN-PRODUCTION-use-openssl-rand-hex-32",
            DATABASE_URL="postgresql+asyncpg://cyberlearn:strong-password@db:5432/cyberlearn",
            ADMIN_STAFF_KEY="long-office-key-ok",
        ),
    )
    with pytest.raises(RuntimeError, match="SECRET_KEY"):
        assert_secure_settings()


def test_production_accepts_strong_settings(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import security

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="a" * 32,
            DATABASE_URL="postgresql+asyncpg://cyberlearn:strong-password@db:5432/cyberlearn",
            ADMIN_STAFF_KEY="long-office-key-ok",
            REDIS_URL="redis://:s3cret@redis:6379/0",
            CORS_ORIGINS=["https://learn.example.org"],
        ),
    )
    assert_secure_settings()


def test_production_rejects_open_cors(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import security

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="a" * 32,
            DATABASE_URL="postgresql+asyncpg://cyberlearn:strong-password@db:5432/cyberlearn",
            ADMIN_STAFF_KEY="long-office-key-ok",
            REDIS_URL="off",
            CORS_ORIGINS=["*"],
        ),
    )
    with pytest.raises(RuntimeError, match="CORS_ORIGINS"):
        assert_secure_settings()


def test_production_rejects_open_redis(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import security

    monkeypatch.setattr(
        security,
        "settings",
        Settings(
            ENVIRONMENT="production",
            SECRET_KEY="a" * 32,
            DATABASE_URL="postgresql+asyncpg://cyberlearn:strong-password@db:5432/cyberlearn",
            ADMIN_STAFF_KEY="long-office-key-ok",
            REDIS_URL="redis://redis:6379/0",
        ),
    )
    with pytest.raises(RuntimeError, match="REDIS_URL"):
        assert_secure_settings()


def test_staff_key_compare(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import security

    monkeypatch.setattr(security.settings, "ADMIN_STAFF_KEY", "dev-office-key-change-me")
    assert staff_key_matches("dev-office-key-change-me") is True
    assert staff_key_matches("wrong-office-key-xx") is False


def test_alembic_upgrade_runs_in_child_process(monkeypatch: pytest.MonkeyPatch) -> None:
    from app import migrate

    called: dict[str, object] = {}

    def fake_run(args: object, cwd: object, check: bool) -> object:
        called["args"] = args
        called["cwd"] = cwd
        return type("Result", (), {"returncode": 0})()

    monkeypatch.setattr(migrate.subprocess, "run", fake_run)
    migrate.run_alembic_upgrade()
    assert called["args"][-2:] == ["upgrade", "head"]


def test_session_cookie_is_httponly() -> None:
    response = Response()
    attach_session_cookie(response, "jwt-token")
    header = response.headers.get("set-cookie", "")
    assert "empower_session=" in header
    assert "HttpOnly" in header
