from __future__ import annotations

import asyncio
import ssl
from pathlib import Path
from urllib.parse import urlparse

import certifi
import asyncpg


def db_url() -> str:
    for path in (Path(__file__).resolve().parents[2] / ".env.production", Path(__file__).resolve().parents[1] / ".env"):
        if not path.exists():
            continue
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.startswith("SUPABASE_DB_URL="):
                return line.split("=", 1)[1].strip()
    raise SystemExit("SUPABASE_DB_URL missing")


async def main() -> None:
    url = db_url()
    ctx = ssl.create_default_context(cafile=certifi.where())
    conn = await asyncpg.connect(dsn=url.replace("postgresql+asyncpg://", "postgresql://"), ssl=ctx, timeout=20)
    learners = await conn.fetchval("select count(*) from public.learners")
    tables = await conn.fetchval(
        "select count(*) from information_schema.tables "
        "where table_schema='public' and table_name = any($1)",
        ["published_lessons", "analytics_events", "curriculum_drafts"],
    )
    print(f"ok host={urlparse(url).hostname} learners={learners} studio_tables={tables}")
    await conn.close()


if __name__ == "__main__":
    asyncio.run(main())
