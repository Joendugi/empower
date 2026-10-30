"""Behaviour needed to run several API pods behind CloudFront and a load balancer."""

from __future__ import annotations

import io
from typing import Any

import pytest
from fastapi import FastAPI
from httpx import ASGITransport, AsyncClient
from starlette.requests import Request

from app.edge import OriginVerifyMiddleware, ProbeAwareTrustedHostMiddleware
from tests.conftest import register_user


async def test_upvote_counts_once_per_learner(client: AsyncClient) -> None:
    await register_user(client)
    created = await client.post("/api/v1/lessons/osi-model-intro/posts", json={"body": "Why layer 3?"})
    post_id = created.json()["id"]

    first = await client.post(f"/api/v1/posts/{post_id}/upvote")
    second = await client.post(f"/api/v1/posts/{post_id}/upvote")
    assert first.json()["upvotes"] == 1
    assert second.json()["upvotes"] == 1

    await register_user(client, email="second@example.com")
    third = await client.post(f"/api/v1/posts/{post_id}/upvote")
    assert third.json()["upvotes"] == 2


async def test_reply_must_belong_to_same_lesson(client: AsyncClient) -> None:
    await register_user(client)
    created = await client.post("/api/v1/lessons/lesson-a/posts", json={"body": "Question"})
    reply = await client.post(
        "/api/v1/lessons/lesson-b/posts", json={"body": "Reply", "parentId": created.json()["id"]}
    )
    assert reply.status_code == 404


async def test_uploaded_book_is_stored_in_database_and_object_storage(
    client: AsyncClient, as_staff: None, tmp_path: Any, monkeypatch: pytest.MonkeyPatch
) -> None:
    from app.config import settings

    monkeypatch.setattr(settings, "UPLOAD_DIR", str(tmp_path))
    await register_user(client)
    files = {"file": ("notes.md", io.BytesIO(b"# Notes"), "text/markdown")}
    res = await client.post("/api/v1/library/upload", data={"title": "Notes", "author": "Me"}, files=files)
    assert res.status_code == 201
    book_id = res.json()["id"]
    assert (tmp_path / "library" / f"{book_id}.md").read_bytes() == b"# Notes"

    detail = await client.get(f"/api/v1/library/books/{book_id}")
    assert detail.status_code == 200
    assert detail.json()["title"] == "Notes"


async def test_guest_reading_progress_is_not_shared(client: AsyncClient) -> None:
    payload = {"bookId": "book-water-engineering", "currentPage": 3, "totalPages": 10}
    saved = await client.post("/api/v1/library/progress", json=payload)
    assert saved.status_code == 200
    assert (await client.get("/api/v1/library/progress")).json() == []


def _edge_app(**origin_kwargs: Any) -> FastAPI:
    app = FastAPI()

    @app.get("/health")
    async def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/api/v1/thing")
    async def thing() -> dict[str, str]:
        return {"ok": "yes"}

    app.add_middleware(ProbeAwareTrustedHostMiddleware, allowed_hosts=["learn.example.org"])
    if origin_kwargs:
        app.add_middleware(OriginVerifyMiddleware, **origin_kwargs)
    return app


async def test_probes_skip_host_check_but_api_does_not() -> None:
    transport = ASGITransport(app=_edge_app())
    async with AsyncClient(transport=transport, base_url="http://10.0.3.17:8000") as pod_ip:
        assert (await pod_ip.get("/health")).status_code == 200
        assert (await pod_ip.get("/api/v1/thing")).status_code == 400


async def test_origin_secret_required_except_for_probes() -> None:
    transport = ASGITransport(app=_edge_app(secret="s3cret-from-cloudfront"))
    async with AsyncClient(transport=transport, base_url="https://learn.example.org") as ac:
        assert (await ac.get("/health")).status_code == 200
        assert (await ac.get("/api/v1/thing")).status_code == 403
        assert (await ac.get("/api/v1/thing", headers={"x-origin-verify": "wrong"})).status_code == 403
        ok = await ac.get("/api/v1/thing", headers={"x-origin-verify": "s3cret-from-cloudfront"})
        assert ok.status_code == 200


@pytest.mark.parametrize(
    ("forwarded", "expected"),
    [
        # client-forged entry, then CloudFront's view of the client, then the ALB's view of CloudFront
        ("6.6.6.6, 198.51.100.10, 130.176.1.1", "198.51.100.10"),
        ("198.51.100.10, 130.176.1.1", "198.51.100.10"),
        ("2001:db8::1, 130.176.1.1", "2001:db8::1"),
    ],
)
def test_client_ip_ignores_forged_forwarded_entries(
    monkeypatch: pytest.MonkeyPatch, forwarded: str, expected: str
) -> None:
    from app.config import settings
    from app.services.rate_limit import client_ip

    monkeypatch.setattr(settings, "TRUSTED_PROXY_HOPS", 2)
    scope = {
        "type": "http",
        "headers": [(b"x-forwarded-for", forwarded.encode())],
        "client": ("10.0.0.5", 1234),
    }
    assert client_ip(Request(scope)) == expected
