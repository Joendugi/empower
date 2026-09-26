from __future__ import annotations

import asyncio
import ssl
from pathlib import Path

import asyncpg
import certifi

ROOT = Path(__file__).resolve().parents[3]
SQL = (ROOT / "supabase" / "migrations" / "20260926030000_auth_challenges.sql").read_text(
    encoding="utf-8"
)


def load_url() -> str:
    for path in (ROOT / ".env.production", ROOT / "apps" / "api" / ".env"):
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("SUPABASE_DB_URL="):
                return line.split("=", 1)[1].strip().replace("postgresql+asyncpg://", "postgresql://")
    raise SystemExit("SUPABASE_DB_URL missing")


async def main() -> None:
    url = load_url()
    host = url.split("@", 1)[1].split("/", 1)[0] if "@" in url else "?"
    print(f"target host: {host}")
    ctx = ssl.create_default_context(cafile=certifi.where())
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    conn = await asyncpg.connect(dsn=url, ssl=ctx, timeout=30, statement_cache_size=0)
    try:
        has_learners = await conn.fetchval(
            "select exists(select 1 from information_schema.tables "
            "where table_schema='public' and table_name='learners')"
        )
        has_wallets = await conn.fetchval(
            "select exists(select 1 from information_schema.tables "
            "where table_schema='public' and table_name='wallets')"
        )
        print(f"learners={has_learners} wallets={has_wallets}")
        if has_wallets and not has_learners:
            raise SystemExit("refusing: marketplace DB")
        if not has_learners:
            raise SystemExit("refusing: Empower core schema missing")
        await conn.execute(SQL)
        has_mig = await conn.fetchval(
            "select exists(select 1 from information_schema.tables "
            "where table_schema='supabase_migrations' and table_name='schema_migrations')"
        )
        if has_mig:
            await conn.execute(
                "insert into supabase_migrations.schema_migrations(version, name) "
                "values ($1, $2) on conflict do nothing",
                "20260926030000",
                "auth_challenges",
            )
        ok_table = await conn.fetchval(
            "select exists(select 1 from information_schema.tables "
            "where table_schema='public' and table_name='auth_challenges')"
        )
        ok_col = await conn.fetchval(
            "select exists(select 1 from information_schema.columns "
            "where table_name='learners' and column_name='email_verified')"
        )
        print(f"auth_challenges={ok_table} email_verified={ok_col}")
    finally:
        await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
