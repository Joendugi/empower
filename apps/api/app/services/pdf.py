from __future__ import annotations


def _escape(text: str) -> str:
    cleaned = text.encode("latin-1", "replace").decode("latin-1")
    return cleaned.replace("\\", "\\\\").replace("(", "\\(").replace(")", "\\)")


def build_certificate_pdf(
    *,
    learner_name: str,
    path_title: str,
    issued: str,
    certificate_id: str,
    verify_url: str,
) -> bytes:
    """Single-page A4 PDF. Helvetica only — no extra system fonts."""
    commands = [
        "BT",
        "/F1 11 Tf 56 780 Td (EMPOWER TECHNICAL AND VOCATIONAL TRAINING) Tj",
        "/F1 22 Tf 0 -36 Td (Certificate of Competency) Tj",
        "/F1 11 Tf 0 -28 Td (This credential is presented to) Tj",
        f"/F1 20 Tf 0 -30 Td ({_escape(learner_name)}) Tj",
        "/F1 11 Tf 0 -24 Td (for completing the programme) Tj",
        f"/F1 16 Tf 0 -26 Td ({_escape(path_title)}) Tj",
        f"/F1 10 Tf 0 -36 Td (Issued: {_escape(issued)}) Tj",
        f"/F1 9 Tf 0 -16 Td (Certificate ID: {_escape(certificate_id)}) Tj",
        f"/F1 8 Tf 0 -16 Td (Verify: {_escape(verify_url)}) Tj",
        "ET",
    ]
    stream = "\n".join(commands).encode("latin-1")
    objects = [
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R "
        b"/Resources << /Font << /F1 5 0 R >> >> >>",
        b"<< /Length %d >>\nstream\n" % len(stream) + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    ]
    chunks: list[bytes] = [b"%PDF-1.4\n"]
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(sum(len(part) for part in chunks))
        chunks.append(f"{index} 0 obj\n".encode("ascii") + body + b"\nendobj\n")
    xref_at = sum(len(part) for part in chunks)
    xref = [b"xref\n", f"0 {len(objects) + 1}\n".encode("ascii"), b"0000000000 65535 f \n"]
    for offset in offsets[1:]:
        xref.append(f"{offset:010d} 00000 n \n".encode("ascii"))
    trailer = (
        b"trailer\n"
        + f"<< /Size {len(objects) + 1} /Root 1 0 R >>\n".encode("ascii")
        + b"startxref\n"
        + f"{xref_at}\n".encode("ascii")
        + b"%%EOF\n"
    )
    return b"".join(chunks + xref + [trailer])
