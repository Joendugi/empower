from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import Field

from app.deps import get_current_educator
from app.models.learner import Learner
from app.schemas import CamelModel
from app.services.mail import mail_configured, send_mail_batch

router = APIRouter()


class NoticeEmailRequest(CamelModel):
    subject: str = Field(min_length=2, max_length=180)
    body: str = Field(min_length=2, max_length=4000)
    emails: list[str] = Field(min_length=1, max_length=40)


class NoticeEmailResponse(CamelModel):
    ok: bool = True
    mailed: int = 0


@router.post("/notices/email", response_model=NoticeEmailResponse)
async def deliver_notice_email(
    payload: NoticeEmailRequest,
    # Educators and staff only: otherwise any account could use our SMTP as a relay.
    learner: Learner = Depends(get_current_educator),
) -> NoticeEmailResponse:
    if not mail_configured():
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="SMTP is not configured — use the free inbox or mail app",
        )
    mailed = send_mail_batch(to=payload.emails, subject=payload.subject, body=payload.body)
    if mailed == 0:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="SMTP did not accept the message")
    return NoticeEmailResponse(ok=True, mailed=mailed)
