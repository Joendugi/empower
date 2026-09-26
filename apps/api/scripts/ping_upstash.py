import asyncio

import redis.asyncio as aioredis

from app.config import settings


async def main() -> None:
    client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True,
    )
    print("ping", await client.ping())
    await client.set("empower:health", "ok", ex=60)
    print("get", await client.get("empower:health"))
    await client.aclose()


if __name__ == "__main__":
    asyncio.run(main())
