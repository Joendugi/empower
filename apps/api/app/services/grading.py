from __future__ import annotations

import hashlib
from typing import Any


def normalize_answer(value: Any) -> str:
    if isinstance(value, list):
        return "|".join(normalize_answer(item) for item in value)
    return " ".join(str(value).strip().lower().split())


def answer_hash(value: Any) -> str:
    return hashlib.sha256(normalize_answer(value).encode("utf-8")).hexdigest()


def answer_hashes(correct: Any) -> list[str]:
    """Public hashes so the PWA can give offline feedback without plaintext keys."""
    if isinstance(correct, list):
        hashes = [answer_hash(item) for item in correct]
        hashes.append(answer_hash(correct))
        return hashes
    return [answer_hash(correct)]


def answers_match(expected: Any, submitted: Any, exercise_type: str | None = None) -> bool:
    if (
        exercise_type in {"MATCH_PAIRS", "DIAGRAM_LABEL"}
        and isinstance(expected, list)
        and isinstance(submitted, list)
    ):
        return sorted(normalize_answer(x) for x in expected) == sorted(
            normalize_answer(x) for x in submitted
        )
    if isinstance(expected, list):
        if isinstance(submitted, list):
            if len(expected) != len(submitted):
                return normalize_answer(expected) == normalize_answer(submitted)
            return all(
                normalize_answer(exp) == normalize_answer(got)
                for exp, got in zip(expected, submitted, strict=True)
            )
        return normalize_answer(submitted) == normalize_answer(expected)
    return normalize_answer(submitted) == normalize_answer(expected)
