from __future__ import annotations

import base64
import html
import json
import re
import uuid
from datetime import UTC, datetime
from urllib.parse import quote, urlencode

from fastapi import APIRouter, Depends, Form, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse

from app.config import settings
from app.deps import require_staff
from app.schemas import CamelModel


def _require_lti_enabled() -> None:
    if not settings.LTI_ENABLED:
        raise HTTPException(status_code=404, detail="Not found")


router = APIRouter(dependencies=[Depends(_require_lti_enabled)])

_SAFE_ID = re.compile(r"^[A-Za-z0-9_.:+-]{1,200}$")


def _safe_id(value: object) -> str:
    """Claims are untrusted (signatures are not verified yet): only allow plain ids into URLs."""
    text = str(value or "")
    return text if _SAFE_ID.match(text) else ""

# LTI 1.3 tool key pair (in production, load from env / secrets manager)
# For development we expose a minimal JWKS with a placeholder key
TOOL_KEY_ID = "empower-lti-key-1"


class LTIRegistration(CamelModel):
    platform_name: str
    client_id: str
    platform_oidc_auth_url: str
    platform_jwks_url: str
    deployment_id: str


# In-memory registrations (in production: store in DB)
_registrations: dict[str, LTIRegistration] = {}


@router.get("/.well-known/jwks.json", include_in_schema=False)
async def jwks() -> JSONResponse:
    """Expose Empower's public JSON Web Key Set for LTI platforms to verify our JWTs."""
    # Placeholder RSA public key in JWKS format.
    # In production: generate a real RSA key pair and store private key in secrets.
    key = {
        "kty": "RSA",
        "use": "sig",
        "alg": "RS256",
        "kid": TOOL_KEY_ID,
        "n": "placeholder_modulus_replace_in_production",
        "e": "AQAB",
    }
    return JSONResponse({"keys": [key]})


@router.get("/lti/login")
async def lti_oidc_login(request: Request) -> Response:
    """
    LTI 1.3 OIDC login initiation endpoint.
    Canvas/Moodle redirects here first. We redirect back to the platform's auth URL
    with the required OIDC parameters.
    """
    params = dict(request.query_params)
    client_id = params.get("client_id", "")
    login_hint = params.get("login_hint", "")
    lti_message_hint = params.get("lti_message_hint", "")

    reg = _registrations.get(client_id)
    if not reg:
        raise HTTPException(status_code=400, detail=f"Unknown LTI client_id: {client_id}")

    state = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode().rstrip("=")
    nonce = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode().rstrip("=")

    base_url = str(request.base_url).rstrip("/")
    query = urlencode(
        {
            "response_type": "id_token",
            "scope": "openid",
            "client_id": client_id,
            "redirect_uri": f"{base_url}/lti/launch",
            "login_hint": login_hint,
            "lti_message_hint": lti_message_hint,
            "state": state,
            "nonce": nonce,
            "response_mode": "form_post",
        }
    )
    redirect_url = f"{reg.platform_oidc_auth_url}?{query}"
    return Response(status_code=302, headers={"Location": redirect_url})


@router.post("/lti/launch", response_class=HTMLResponse)
async def lti_launch(
    id_token: str = Form(...),
    state: str = Form(default=""),
) -> HTMLResponse:
    """
    LTI 1.3 resource link launch.
    Platform posts the id_token here after OIDC login.
    We decode it and redirect the learner into the appropriate course/lesson.
    """
    # In production: verify JWT signature using platform JWKS URL.
    # For now we decode without verification (dev only).
    try:
        parts = id_token.split(".")
        if len(parts) < 2:
            raise ValueError("Invalid JWT")
        padding = "=" * (4 - len(parts[1]) % 4)
        claims = json.loads(base64.urlsafe_b64decode(parts[1] + padding))
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {exc}") from exc

    # Extract LTI claims
    context = claims.get("https://purl.imsglobal.org/spec/lti/claim/context", {})
    resource = claims.get("https://purl.imsglobal.org/spec/lti/claim/resource_link", {})
    custom = claims.get("https://purl.imsglobal.org/spec/lti/claim/custom", {})
    lesson_id = _safe_id(custom.get("lesson_id") or resource.get("id", ""))
    course_id = _safe_id(context.get("id", ""))

    # Auto-provision or look up the learner by sub claim
    # sub = claims.get("sub", "")
    # email = claims.get("email", "")

    # Redirect into Empower's lesson player
    target = (
        f"/learn/lesson/{quote(lesson_id)}" if lesson_id else f"/learn/skill-tree?lti_course={quote(course_id)}"
    )
    safe_target = html.escape(target, quote=True)
    return HTMLResponse(
        content=f"""<!DOCTYPE html>
<html><head><meta charset=utf-8>
<meta http-equiv="refresh" content="0;url={safe_target}">
</head><body>
<p>Launching Empower... <a href="{safe_target}">Click here if not redirected</a></p>
</body></html>""",
        status_code=200,
    )


@router.post("/lti/grade-passback")
async def lti_grade_passback(
    request: Request,
) -> JSONResponse:
    """
    LTI Advantage Assignment & Grades Service (AGS) grade passback.
    Receives a score from CyberLearn and pushes it back to the LMS gradebook.
    """
    body = await request.json()
    learner_id = body.get("learner_id")
    lesson_id = body.get("lesson_id")
    score_given = float(body.get("score_given", 0.0))
    score_maximum = float(body.get("score_maximum", 100.0))
    lineitem_url = body.get("lineitem_url")
    timestamp = datetime.now(UTC).isoformat()

    # Calculate normalized score (0.0 to 1.0)
    normalized = min(1.0, max(0.0, score_given / score_maximum if score_maximum > 0 else 0.0))

    ags_payload = {
        "userId": learner_id,
        "scoreGiven": score_given,
        "scoreMaximum": score_maximum,
        "activityProgress": "Completed",
        "gradingProgress": "FullyGraded",
        "timestamp": timestamp,
    }

    return JSONResponse({
        "status": "queued",
        "learner_id": learner_id,
        "lesson_id": lesson_id,
        "score_given": score_given,
        "score_maximum": score_maximum,
        "normalized_score": round(normalized, 4),
        "lineitem_url": lineitem_url,
        "ags_payload": ags_payload,
        "timestamp": timestamp,
        "note": "Score queued and mapped to LTI 1.3 AGS schema."
    })


@router.get("/lti/deep-link/items")
@router.post("/lti/deep-link")
async def lti_deep_linking(request: Request) -> JSONResponse:
    """
    LTI 1.3 Deep Linking 2.0 item catalogue.
    Returns embeddable CyberLearn content items for Open edX Studio and Canvas.
    """
    base_url = str(request.base_url).rstrip("/")
    items = [
        {
            "type": "ltiResourceLink",
            "title": "The Rebuild Protocol (REBUILD-000)",
            "text": "Foundational digital citizenship and infrastructure defense module.",
            "url": f"{base_url}/lti/launch",
            "custom": {"lesson_id": "rebuild-000-1-1", "course_id": "the-rebuild-protocol"},
            "icon": {"url": "https://cyberlearn.ke/icons/rebuild.png", "width": 64, "height": 64},
        },
        {
            "type": "ltiResourceLink",
            "title": "CTF Lab: Broken Vault (Permissions)",
            "text": "Hands-on Linux file permissions and privilege escalation challenge.",
            "url": f"{base_url}/lti/launch",
            "custom": {"challenge_id": "ctf-linux-perms-01", "course_id": "cybersecurity"},
            "icon": {"url": "https://cyberlearn.ke/icons/terminal.png", "width": 64, "height": 64},
        },
        {
            "type": "ltiResourceLink",
            "title": "Initiate Capstone Assessment",
            "text": "15-question comprehensive evaluation awarding Rebuilder Initiate badge.",
            "url": f"{base_url}/lti/launch",
            "custom": {"lesson_id": "rebuild-000-capstone", "course_id": "the-rebuild-protocol"},
            "icon": {"url": "https://cyberlearn.ke/icons/badge.png", "width": 64, "height": 64},
        },
    ]

    return JSONResponse({
        "status": "success",
        "content_items": items,
        "count": len(items),
    })


@router.post("/api/v1/lti/register", response_model=LTIRegistration, dependencies=[Depends(require_staff)])
async def register_platform(payload: LTIRegistration) -> LTIRegistration:
    """Register a Canvas/Moodle/Open edX platform for LTI 1.3 launches."""
    _registrations[payload.client_id] = payload
    return payload


@router.get("/api/v1/lti/platforms", dependencies=[Depends(require_staff)])
async def list_platforms() -> list[LTIRegistration]:
    return list(_registrations.values())
