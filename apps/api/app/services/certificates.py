from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from app.config import settings
from app.models.badge import Badge


def issuer_profile() -> dict[str, Any]:
    return {
        "type": ["Profile"],
        "id": f"{settings.public_api_origin()}/api/v1/issuer",
        "name": "Empower",
        "url": settings.public_app_origin(),
    }


def certificate_json_url(certificate_id: str) -> str:
    return f"{settings.public_api_origin()}/api/v1/certificates/{certificate_id}"


def certificate_verify_url(certificate_id: str) -> str:
    return f"{settings.public_app_origin()}/verify/{certificate_id}"


def open_badge_assertion(
    *,
    learner_id: str,
    learner_name: str,
    badge_type: str,
    path_id: str | None = None,
    path_title: str | None = None,
) -> dict[str, Any]:
    issued = datetime.now(UTC).isoformat()
    name = path_title or badge_type.replace("_", " ").title()
    return {
        "@context": [
            "https://www.w3.org/2018/credentials/v1",
            "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
        ],
        "type": ["VerifiableCredential", "OpenBadgeCredential"],
        "name": name,
        "issuer": issuer_profile(),
        "issuanceDate": issued,
        "credentialSubject": {
            "type": ["AchievementSubject"],
            "id": f"did:empower:{learner_id}",
            "name": learner_name,
            "achievement": {
                "type": ["Achievement"],
                "id": f"urn:empower:badge:{badge_type}",
                "name": name,
                "description": f"Completed {name} on Empower.",
                "criteria": {"narrative": f"Learner finished programme requirements for {name}."},
            },
        },
        "empower": {
            "pathId": path_id,
            "badgeType": badge_type,
            "verifyUrl": None,
        },
    }


def finalize_open_badge(assertion: dict[str, Any], certificate_id: str) -> dict[str, Any]:
    payload = dict(assertion)
    payload["id"] = certificate_json_url(certificate_id)
    payload["issuer"] = issuer_profile()
    empower = dict(payload.get("empower") or {})
    empower["verifyUrl"] = certificate_verify_url(certificate_id)
    payload["empower"] = empower
    return payload


def attach_open_badge(badge: Badge, assertion: dict[str, Any]) -> Badge:
    badge.open_badges_json = json.dumps(assertion, ensure_ascii=False)
    return badge
