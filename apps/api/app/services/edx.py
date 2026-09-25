from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings

logger = logging.getLogger(__name__)


class EdxClient:
    """
    Thin Open edX LMS client.

    When EDX_API_KEY is empty the client is disabled and all calls no-op.
    Wire EDX_LMS_URL to a Tutor-deployed LMS when that stack is running.
    """

    def __init__(self) -> None:
        self.base_url = settings.EDX_LMS_URL.rstrip("/")
        self.api_key = settings.EDX_API_KEY
        self.enabled = bool(self.api_key)

    def status(self) -> dict[str, Any]:
        return {
            "enabled": self.enabled,
            "lms_url": self.base_url,
            "mode": "live" if self.enabled else "disabled",
        }

    async def record_completion(
        self,
        *,
        learner_id: str,
        lesson_id: str,
        course_id: str,
    ) -> dict[str, Any]:
        if not self.enabled:
            return {
                "synced": False,
                "reason": "edx_disabled",
                "learner_id": learner_id,
                "lesson_id": lesson_id,
            }
        url = f"{self.base_url}/api/completion/v1/completion-batch"
        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {
            "username": learner_id,
            "course_key": course_id,
            "blocks": {lesson_id: 1.0},
        }
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                response = await client.post(url, json=payload, headers=headers)
            return {
                "synced": response.is_success,
                "status_code": response.status_code,
                "learner_id": learner_id,
                "lesson_id": lesson_id,
            }
        except httpx.HTTPError as exc:
            logger.warning("Open edX completion sync failed: %s", exc)
            return {
                "synced": False,
                "reason": "edx_unreachable",
                "learner_id": learner_id,
                "lesson_id": lesson_id,
            }


edx_client = EdxClient()
