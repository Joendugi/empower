from __future__ import annotations

import json
from datetime import UTC, datetime
from typing import Any

from app.models.badge import Badge


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
        "issuer": {
            "type": ["Profile"],
            "id": "https://empower.local/issuer",
            "name": "Empower",
        },
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
        "empower": {"pathId": path_id, "badgeType": badge_type},
    }


def attach_open_badge(badge: Badge, assertion: dict[str, Any]) -> Badge:
    badge.open_badges_json = json.dumps(assertion, ensure_ascii=False)
    return badge
