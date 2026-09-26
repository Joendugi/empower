from __future__ import annotations

import base64
import json
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Form, HTTPException, Request, Response
from fastapi.responses import HTMLResponse, JSONResponse

from app.config import settings
from app.schemas import CamelModel

router = APIRouter()

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
    target_link_uri = params.get("target_link_uri", "")

    reg = _registrations.get(client_id)
    if not reg:
        raise HTTPException(status_code=400, detail=f"Unknown LTI client_id: {client_id}")

    state = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode().rstrip("=")
    nonce = base64.urlsafe_b64encode(uuid.uuid4().bytes).decode().rstrip("=")

    base_url = str(request.base_url).rstrip("/")
    redirect_url = (
        f"{reg.platform_oidc_auth_url}"
        f"?response_type=id_token"
        f"&scope=openid"
        f"&client_id={client_id}"
        f"&redirect_uri={base_url}/lti/launch"
        f"&login_hint={login_hint}"
        f"&lti_message_hint={lti_message_hint}"
        f"&state={state}"
        f"&nonce={nonce}"
        f"&response_mode=form_post"
    )
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
    lesson_id = custom.get("lesson_id") or resource.get("id", "")
    course_id = context.get("id", "")

    # Auto-provision or look up the learner by sub claim
    # sub = claims.get("sub", "")
    # email = claims.get("email", "")

    # Redirect into Empower's lesson player
    target = f"/learn/lesson/{lesson_id}" if lesson_id else f"/learn/skill-tree?lti_course={course_id}"
    return HTMLResponse(
        content=f"""<!DOCTYPE html>
<html><head><meta charset=utf-8>
<meta http-equiv="refresh" content="0;url={target}">
</head><body>
<p>Launching Empower... <a href="{target}">Click here if not redirected</a></p>
</body></html>""",
        status_code=200,
    )


@router.post("/lti/grade-passback")
async def lti_grade_passback(
    request: Request,
) -> JSONResponse:
    """
    LTI Advantage Assignment & Grades Service (AGS) grade passback.
    Receives a score from Empower and pushes it back to the LMS gradebook.
    In production: use the platform's AGS endpoint URL from the id_token claims.
    """
    body = await request.json()
    learner_id = body.get("learner_id")
    lesson_id = body.get("lesson_id")
    score_given = body.get("score_given", 0.0)
    score_maximum = body.get("score_maximum", 100.0)
    timestamp = datetime.now(timezone.utc).isoformat()

    # TODO: call platform AGS lineitem endpoint with bearer token
    return JSONResponse({
        "status": "queued",
        "learner_id": learner_id,
        "lesson_id": lesson_id,
        "score_given": score_given,
        "score_maximum": score_maximum,
        "timestamp": timestamp,
        "note": "Grade passback queued. Connect AGS lineitem URL from LTI launch claims in production."
    })


@router.post("/api/v1/lti/register", response_model=LTIRegistration)
async def register_platform(payload: LTIRegistration) -> LTIRegistration:
    """Register a Canvas/Moodle platform for LTI 1.3 launches."""
    _registrations[payload.client_id] = payload
    return payload


@router.get("/api/v1/lti/platforms")
async def list_platforms() -> list[LTIRegistration]:
    return list(_registrations.values())
