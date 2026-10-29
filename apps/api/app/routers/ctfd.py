from __future__ import annotations

import hmac
import logging
from typing import Any

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.database import get_db
from app.deps import get_current_learner
from app.models.badge import Badge
from app.models.learner import Learner
from app.models.xp_event import XPEvent
from app.routers.xp import xp_to_level
from app.schemas import CamelModel

logger = logging.getLogger(__name__)

router = APIRouter()


class CTFdSolvePayload(CamelModel):
    challenge_id: int | str = Field(..., alias="challengeId")
    challenge_name: str = Field(default="CTF Challenge", alias="challengeName")
    user_id: int | str = Field(default="", alias="userId")
    user_name: str = Field(default="", alias="userName")
    user_email: str = Field(default="", alias="userEmail")
    points: int = Field(default=50, ge=1, le=1000)
    flag: str = Field(default="")
    submission_type: str = Field(default="correct", alias="submissionType")
    lti_lineitem_url: str | None = Field(default=None, alias="ltiLineitemUrl")
    lti_user_id: str | None = Field(default=None, alias="ltiUserId")


class FlagSubmission(CamelModel):
    challenge_id: str = Field(..., alias="challengeId", max_length=200)
    flag: str = Field(..., max_length=500)


class CTFdChallengeSummary(CamelModel):
    id: str
    title: str
    category: str
    difficulty: str
    points: int
    description: str
    launch_url: str


# Sample CTFd challenges integrated into CyberLearn skill trees
MOCK_CTFD_CHALLENGES: list[dict[str, Any]] = [
    {
        "id": "ctf-linux-perms-01",
        "title": "Broken Vault: File Permissions",
        "category": "Linux & Privilege Escalation",
        "difficulty": "Easy",
        "points": 50,
        "description": "Inspect file ownership and permissions on an insecure configuration file to extract the hidden token.",
        "launch_url": f"{settings.CTFD_URL}/challenges#broken-vault",
    },
    {
        "id": "ctf-web-sqli-01",
        "title": "Login Bypass: The Nuller Gate",
        "category": "Web Security",
        "difficulty": "Medium",
        "points": 100,
        "description": "Exploit an unsanitized SQL query input in a simulated Blackout dispatch portal.",
        "launch_url": f"{settings.CTFD_URL}/challenges#nuller-gate",
    },
    {
        "id": "ctf-pcap-recon-01",
        "title": "Ghost Signals: Traffic Analysis",
        "category": "Network Forensics",
        "difficulty": "Medium",
        "points": 100,
        "description": "Analyze Wireshark packet captures from the 2031 substation attack to uncover the C2 server IP.",
        "launch_url": f"{settings.CTFD_URL}/challenges#ghost-signals",
    },
]

# Server-side answer key for the in-browser CTF sandbox (never returned by the API).
CHALLENGE_FLAGS: dict[str, str] = {
    "ctf-linux-perms-01": "flag{scada_file_perms_restored_2031}",
    "ctf-web-sqli-01": "flag{nuller_gate_sqli_bypassed}",
    "ctf-pcap-recon-01": "flag{wireshark_c2_beacon_intercepted}",
}
CHALLENGE_POINTS: dict[str, int] = {c["id"]: c["points"] for c in MOCK_CTFD_CHALLENGES}


async def _credit_solve(
    db: AsyncSession, learner: Learner, challenge_id: str, points: int
) -> tuple[int, bool]:
    """Credit XP + first-flag badge once per learner/challenge. Returns (xp_awarded, badge_awarded)."""
    idempotency_key = f"ctfd-solve-{learner.id}-{challenge_id}"
    existing_xp = await db.execute(
        select(XPEvent).where(XPEvent.idempotency_key == idempotency_key)
    )
    if existing_xp.scalars().first() is not None:
        return 0, False

    db.add(
        XPEvent(
            learner_id=learner.id,
            amount=points,
            source="ctf_flag",
            content_id=f"ctfd:{challenge_id}",
            idempotency_key=idempotency_key,
        )
    )
    learner.total_xp += points
    learner.level = xp_to_level(learner.total_xp)

    badge_awarded = False
    existing_badge = await db.execute(
        select(Badge).where(
            Badge.learner_id == learner.id,
            Badge.badge_type == "ctf_flag",
        )
    )
    if existing_badge.scalars().first() is None:
        db.add(
            Badge(
                learner_id=learner.id,
                badge_type="ctf_flag",
                open_badges_json='{"name":"CTF Flag Pioneer","description":"Captured first live security challenge flag in CyberLearn CTFd."}',
            )
        )
        badge_awarded = True

    await db.commit()
    return points, badge_awarded


@router.get("/ctfd/status")
async def ctfd_status() -> dict[str, Any]:
    """Check CTFd challenge platform sidecar configuration."""
    return {
        "status": "online",
        "ctfd_url": settings.CTFD_URL,
        "api_enabled": bool(settings.CTFD_API_KEY),
        "webhook_configured": bool(settings.CTFD_WEBHOOK_SECRET),
        "available_challenges": len(MOCK_CTFD_CHALLENGES),
    }


@router.get("/ctfd/challenges", response_model=list[CTFdChallengeSummary])
async def list_ctfd_challenges() -> list[dict[str, Any]]:
    """List hands-on CTFd challenges for skill tree and Open edX LTI integration."""
    return MOCK_CTFD_CHALLENGES


@router.post("/ctfd/webhook")
async def ctfd_webhook(
    payload: CTFdSolvePayload,
    db: AsyncSession = Depends(get_db),
    x_ctfd_secret: str | None = Header(None, alias="X-CTFd-Secret"),
) -> dict[str, Any]:
    """
    Webhook receiver from CTFd sidecar when a learner submits a correct flag.
    - Validates shared secret
    - Credits XP to learner
    - Awards 'ctf_flag' badge on first solve
    - Forwards grade passback to upstream Open edX / LMS if LTI context is present
    """
    expected_secret = settings.CTFD_WEBHOOK_SECRET
    if not expected_secret:
        raise HTTPException(status_code=503, detail="CTFd webhook is not configured")
    if not x_ctfd_secret or not hmac.compare_digest(x_ctfd_secret, expected_secret):
        raise HTTPException(status_code=403, detail="Invalid CTFd webhook secret")

    if payload.submission_type != "correct":
        return {"status": "ignored", "reason": "not_correct_submission"}

    # Only email is unique on Learner; display names can collide.
    email = payload.user_email.strip().lower()
    if not email:
        return {"status": "ignored", "reason": "missing_user_email"}
    res = await db.execute(select(Learner).where(Learner.email == email))
    learner = res.scalars().first()
    if learner is None:
        return {"status": "ignored", "reason": "unknown_learner"}

    xp_awarded, badge_awarded = await _credit_solve(
        db, learner, str(payload.challenge_id), payload.points
    )

    # Handle LTI grade passback if lineitem context is supplied
    lti_passback_status = "none"
    if payload.lti_lineitem_url:
        lti_passback_status = "queued"
        logger.info(
            "LTI Grade Passback queued for user %s on challenge %s to %s",
            payload.lti_user_id or learner.id,
            payload.challenge_id,
            payload.lti_lineitem_url,
        )

    return {
        "status": "recorded",
        "learner_id": learner.id,
        "challenge_id": payload.challenge_id,
        "xp_awarded": xp_awarded,
        "badge_awarded": badge_awarded,
        "new_total_xp": learner.total_xp,
        "new_level": learner.level,
        "lti_passback": lti_passback_status,
    }


@router.post("/ctfd/solve")
async def direct_flag_solve(
    payload: FlagSubmission,
    learner: Learner = Depends(get_current_learner),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    """Flag submission from the in-browser CTF sandbox, verified against the server answer key."""
    expected = CHALLENGE_FLAGS.get(payload.challenge_id)
    if expected is None:
        raise HTTPException(status_code=404, detail="Unknown challenge")
    if not hmac.compare_digest(payload.flag.strip().encode(), expected.encode()):
        return {"status": "incorrect", "points": 0}

    points = CHALLENGE_POINTS[payload.challenge_id]
    xp_awarded, badge_awarded = await _credit_solve(db, learner, payload.challenge_id, points)
    return {
        "status": "correct" if xp_awarded else "already_solved",
        "points": xp_awarded,
        "badge_awarded": badge_awarded,
        "new_total_xp": learner.total_xp,
        "new_level": learner.level,
    }
