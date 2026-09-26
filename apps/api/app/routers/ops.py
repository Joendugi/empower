from __future__ import annotations

import logging
from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, Request
from pydantic import Field
from sqlalchemy import delete, func, select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.models.studio import ErrorEventRow
from app.schemas import CamelModel

router = APIRouter()
logger = logging.getLogger("empower.ops")


class ErrorReport(CamelModel):
    message: str = Field(min_length=1, max_length=500)
    path: str | None = Field(default=None, max_length=300)


@router.post("/ops/errors")
async def report_error(
    payload: ErrorReport,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    logger.error("client_error path=%s message=%s ip=%s", payload.path, payload.message, request.client.host if request.client else "unknown")
    db.add(ErrorEventRow(message=payload.message, path=payload.path))
    cutoff = datetime.now(UTC) - timedelta(days=14)
    await db.execute(delete(ErrorEventRow).where(ErrorEventRow.created_at < cutoff))
    await db.commit()
    return {"status": "recorded"}


@router.get("/ops/status")
async def ops_status(db: AsyncSession = Depends(get_db)) -> dict[str, object]:
    await db.execute(text("SELECT 1"))
    errors = await db.scalar(select(func.count()).select_from(ErrorEventRow)) or 0
    return {
        "status": "ok",
        "environment": settings.ENVIRONMENT,
        "publicHost": settings.PUBLIC_HOST or None,
        "cache": "redis" if settings.redis_enabled else "memory",
        "edx": "off",
        "recentErrors": int(errors),
    }
