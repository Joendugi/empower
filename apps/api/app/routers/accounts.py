"""Account administration. Roles live only here, on the server; the PWA reads them from /auth/me."""

from __future__ import annotations

from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.deps import get_current_admin
from app.models.learner import Learner
from app.schemas import CamelModel
from app.services.sessions import revoke_all_for_learner

router = APIRouter()

Role = Literal["learner", "educator", "admin"]


class AccountRead(CamelModel):
    id: str
    email: str | None
    display_name: str
    role: str
    is_guest: bool
    email_verified: bool
    total_xp: int


class RoleUpdate(CamelModel):
    role: Role


def _account(row: Learner) -> AccountRead:
    return AccountRead(
        id=row.id,
        email=row.email,
        display_name=row.display_name,
        role=row.role or "learner",
        is_guest=row.is_guest,
        email_verified=bool(row.email_verified),
        total_xp=row.total_xp,
    )


@router.get("/admin/accounts", response_model=list[AccountRead])
async def list_accounts(
    q: str | None = Query(default=None, max_length=120),
    role: Role | None = None,
    limit: int = Query(default=50, ge=1, le=200),
    _admin: Learner = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> list[AccountRead]:
    query = select(Learner).where(Learner.is_guest.is_(False))
    if q:
        needle = f"%{q.strip().lower()}%"
        query = query.where(or_(func.lower(Learner.email).like(needle), func.lower(Learner.display_name).like(needle)))
    if role:
        query = query.where(Learner.role == role)
    rows = await db.scalars(query.order_by(Learner.display_name).limit(limit))
    return [_account(row) for row in rows.all()]


@router.patch("/admin/accounts/{learner_id}/role", response_model=AccountRead)
async def change_role(
    learner_id: str,
    payload: RoleUpdate,
    admin: Learner = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
) -> AccountRead:
    target = await db.get(Learner, learner_id)
    if target is None or target.is_guest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    if target.id == admin.id and payload.role != "admin":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You can't remove your own admin role")
    if target.role != payload.role:
        target.role = payload.role
        # Make the account sign in again so every device picks up the new role straight away.
        await revoke_all_for_learner(db, target.id)
    await db.commit()
    return _account(target)
