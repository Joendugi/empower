from __future__ import annotations

import logging
import smtplib
from email.message import EmailMessage

import httpx

from app.config import settings

log = logging.getLogger(__name__)
RESEND_URL = "https://api.resend.com/emails"


def mail_configured() -> bool:
    return bool(settings.RESEND_API_KEY.strip() or settings.SMTP_HOST.strip())


def mail_backend() -> str:
    if settings.RESEND_API_KEY.strip():
        return "resend"
    if settings.SMTP_HOST.strip():
        return "smtp"
    return "off"


def send_mail(*, to: str, subject: str, body: str) -> bool:
    """Send one plain-text message via Resend, then SMTP. False if both are unset or fail."""
    target = to.strip()
    if not target or not mail_configured():
        return False
    if settings.RESEND_API_KEY.strip():
        return _send_resend(target, subject, body)
    return _send_smtp(target, subject, body)


def send_mail_batch(*, to: list[str], subject: str, body: str, limit: int = 40) -> int:
    seen: set[str] = set()
    sent = 0
    for raw in to[:limit]:
        email = raw.strip().lower()
        if not email or email in seen:
            continue
        seen.add(email)
        if send_mail(to=email, subject=subject, body=body):
            sent += 1
    return sent


def _from_address() -> str:
    return settings.SMTP_FROM.strip() or "Empower <noreply@localhost>"


def _send_resend(to: str, subject: str, body: str) -> bool:
    try:
        response = httpx.post(
            RESEND_URL,
            headers={
                "Authorization": f"Bearer {settings.RESEND_API_KEY.strip()}",
                "Content-Type": "application/json",
            },
            json={
                "from": _from_address(),
                "to": [to],
                "subject": subject.strip(),
                "text": body,
            },
            timeout=15.0,
        )
        if response.is_success:
            return True
        log.warning("Resend rejected mail for %s: %s", to, response.status_code)
        return False
    except httpx.HTTPError:
        log.warning("Resend send failed for %s", to, exc_info=not settings.is_production)
        return False


def _send_smtp(to: str, subject: str, body: str) -> bool:
    message = EmailMessage()
    message["Subject"] = subject.strip()
    message["From"] = _from_address()
    message["To"] = to
    message.set_content(body)
    try:
        with smtplib.SMTP(settings.SMTP_HOST.strip(), settings.SMTP_PORT, timeout=15) as smtp:
            if settings.SMTP_STARTTLS:
                smtp.starttls()
            user = settings.SMTP_USER.strip()
            if user:
                smtp.login(user, settings.SMTP_PASSWORD)
            smtp.send_message(message)
        return True
    except OSError:
        log.warning("SMTP send failed for %s", to, exc_info=not settings.is_production)
        return False
