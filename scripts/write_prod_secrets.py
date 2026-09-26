"""Write real production secrets into gitignored env files. Prints no secret values."""
from __future__ import annotations

import hashlib
import os
import re
import secrets
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_ENV = ROOT / "apps" / "api" / ".env"
PWA_ENV = ROOT / "apps" / "pwa" / ".env.local"
PROD_ENV = ROOT / ".env.production"


def upsert(path: Path, values: dict[str, str], defaults: dict[str, str] | None = None) -> None:
    current = path.read_text(encoding="utf-8") if path.exists() else ""
    lines = current.splitlines()
    seen: set[str] = set()
    out: list[str] = []
    for line in lines:
        match = re.match(r"^([A-Z0-9_]+)=", line)
        if match and match.group(1) in values:
            out.append(f"{match.group(1)}={values[match.group(1)]}")
            seen.add(match.group(1))
        else:
            out.append(line)
    for key, value in values.items():
        if key not in seen:
            out.append(f"{key}={value}")
    if defaults:
        existing_keys = {re.match(r"^([A-Z0-9_]+)=", line).group(1) for line in out if re.match(r"^([A-Z0-9_]+)=", line)}
        for key, value in defaults.items():
            if key not in existing_keys:
                out.append(f"{key}={value}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(out).rstrip() + "\n", encoding="utf-8")


def staff_hash(key: str) -> str:
    return hashlib.sha256(f"empower-staff-v1:{key}".encode("utf-8")).hexdigest()


def main() -> None:
    secret = os.environ.get("SECRET_KEY") or secrets.token_urlsafe(48)
    staff = os.environ.get("ADMIN_STAFF_KEY") or secrets.token_urlsafe(24)
    postgres = os.environ.get("POSTGRES_PASSWORD") or secrets.token_urlsafe(24)
    public_host = os.environ.get("PUBLIC_HOST") or "empower.local"
    cors = f'["https://{public_host}","http://localhost:5173","http://localhost:8080"]'
    hashed = staff_hash(staff)

    upsert(
        API_ENV,
        {
            "SECRET_KEY": secret,
            "ADMIN_STAFF_KEY": staff,
            "PUBLIC_HOST": public_host,
            "CORS_ORIGINS": cors,
        },
    )
    upsert(
        PWA_ENV,
        {
            "VITE_ADMIN_STAFF_HASH": hashed,
            "VITE_DEPLOYMENT_MODE": "cloud",
            "VITE_API_URL": "/api/v1",
            "VITE_BUILD_ID": os.environ.get("VITE_BUILD_ID") or "2026-09-26",
        },
    )
    upsert(
        PROD_ENV,
        {
            "SECRET_KEY": secret,
            "ADMIN_STAFF_KEY": staff,
            "POSTGRES_PASSWORD": postgres,
            "PUBLIC_HOST": public_host,
            "CORS_ORIGINS": f"https://{public_host}",
            "VITE_ADMIN_STAFF_HASH": hashed,
            "VITE_BUILD_ID": os.environ.get("VITE_BUILD_ID") or "2026-09-26",
            "REDIS_URL": "off",
            "ENVIRONMENT": "production",
        },
        defaults={
            "DATABASE_URL": f"postgresql+asyncpg://cyberlearn:{postgres}@postgres:5432/cyberlearn",
            "SUPABASE_DB_URL": "",
            "SUPABASE_URL": "",
        },
    )
    print(f"wrote secrets to {API_ENV.name}, {PWA_ENV.name}, {PROD_ENV.name}")
    print(f"PUBLIC_HOST={public_host}")
    print(f"VITE_ADMIN_STAFF_HASH set ({len(hashed)} hex chars)")


if __name__ == "__main__":
    main()
