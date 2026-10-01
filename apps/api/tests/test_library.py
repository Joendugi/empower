from __future__ import annotations

import io
from httpx import AsyncClient

from tests.conftest import register_user


async def test_library_books_list_and_filter(client: AsyncClient) -> None:
    # List all books
    res = await client.get("/api/v1/library/books")
    assert res.status_code == 200
    books = res.json()
    assert len(books) >= 4

    # Check that core books exist
    ids = {b["id"] for b in books}
    assert "book-water-engineering" in ids
    assert "book-solar-pv-systems" in ids

    # Filter by category
    res_resilience = await client.get("/api/v1/library/books?category=resilience")
    assert res_resilience.status_code == 200
    resilience_books = res_resilience.json()
    assert all(b["category"] == "resilience" for b in resilience_books)

    # Search query
    res_search = await client.get("/api/v1/library/books?q=Moringa")
    assert res_search.status_code == 200
    search_results = res_search.json()
    assert any("water" in b["id"] for b in search_results)


async def test_library_book_details(client: AsyncClient) -> None:
    res = await client.get("/api/v1/library/books/book-water-engineering")
    assert res.status_code == 200
    book = res.json()
    assert book["title"] == "Decentralized Potable Water Engineering & Slow Sand Filtration"
    assert len(book["chapters"]) >= 3
    assert "contentMarkdown" in book


async def test_library_upload_and_progress(client: AsyncClient) -> None:
    await register_user(client)

    # Upload a markdown/text book
    file_bytes = b"# My Custom Field Notes\n\nChapter 1 on rainwater harvesting."
    files = {"file": ("rainwater.md", io.BytesIO(file_bytes), "text/markdown")}
    data = {
        "title": "Community Rainwater Harvesting",
        "author": "Machakos Technical College",
        "category": "resilience",
        "tradeTitle": "Plumbing & Water",
        "description": "Practical guide to guttering and ferro-cement cisterns.",
    }

    res_upload = await client.post("/api/v1/library/upload", data=data, files=files)
    assert res_upload.status_code == 201
    uploaded = res_upload.json()
    assert uploaded["title"] == "Community Rainwater Harvesting"
    book_id = uploaded["id"]

    # Verify uploaded book appears in the list
    res_list = await client.get("/api/v1/library/books")
    assert any(b["id"] == book_id for b in res_list.json())

    # Save reading progress
    progress_payload = {
        "bookId": book_id,
        "currentPage": 5,
        "totalPages": 20,
        "bookmarks": [1, 5],
    }
    res_prog = await client.post("/api/v1/library/progress", json=progress_payload)
    assert res_prog.status_code == 200
    prog = res_prog.json()
    assert prog["percent"] == 25.0

    # Retrieve reading progress
    res_get_prog = await client.get("/api/v1/library/progress")
    assert res_get_prog.status_code == 200
    all_prog = res_get_prog.json()
    assert any(p["bookId"] == book_id for p in all_prog)
