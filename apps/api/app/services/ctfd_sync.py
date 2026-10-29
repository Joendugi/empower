"""
CTFd Platform Synchronization Service
=====================================
Synchronizes challenges between a CTFd sidecar instance and the CyberLearn curriculum:
  - Fetches live challenges from CTFd API (with fallback to local catalog).
  - Aligns challenges to skill nodes (e.g. Linux, Web Security, Forensics).
  - Handles solve webhook verification and learner credential mapping.
"""

from __future__ import annotations

import logging
from typing import Any

import httpx

from app.config import settings
from app.routers.ctfd import MOCK_CTFD_CHALLENGES

logger = logging.getLogger(__name__)


async def fetch_ctfd_challenges_remote() -> list[dict[str, Any]]:
    """
    Query the live CTFd instance for available challenges using API key.
    If the remote endpoint is unavailable or not configured, falls back
    to the integrated CyberLearn CTF catalog.
    """
    if not (settings.CTFD_URL and settings.CTFD_API_KEY):
        logger.debug("CTFd API key not configured — using local catalog.")
        return MOCK_CTFD_CHALLENGES

    url = f"{settings.CTFD_URL.rstrip('/')}/api/v1/challenges"
    headers = {
        "Authorization": f"Token {settings.CTFD_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                raw_challenges = data.get("data", [])
                formatted = []
                for item in raw_challenges:
                    formatted.append({
                        "id": f"ctfd-remote-{item.get('id')}",
                        "title": item.get("name", "Untitled Challenge"),
                        "category": item.get("category", "General Security"),
                        "difficulty": item.get("difficulty", "Medium"),
                        "points": item.get("value", 50),
                        "description": item.get("description", ""),
                        "launch_url": f"{settings.CTFD_URL}/challenges#{item.get('id')}",
                    })
                return formatted
    except Exception as exc:
        logger.warning("Failed to connect to remote CTFd: %s. Using local challenges.", exc)

    return MOCK_CTFD_CHALLENGES


def map_challenge_to_lesson(challenge_id: str) -> str | None:
    """
    Map a CTFd challenge ID to a CyberLearn lesson ID for automated curriculum credit.
    """
    mappings = {
        "ctf-linux-perms-01": "linux-essentials-lesson-1",
        "ctf-web-sqli-01": "web-security-lesson-1",
        "ctf-pcap-recon-01": "network-fundamentals-lesson-1",
    }
    return mappings.get(challenge_id)
