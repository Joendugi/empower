from __future__ import annotations

import hashlib
import json
from typing import Any

from app.services.grading import answer_hash, answer_hashes, normalize_answer

_raw_lessons: dict[str, dict[str, Any]] = {}
_public_lessons: dict[str, dict[str, Any]] = {}
_paths: dict[str, dict[str, Any]] = {}


def _as_dict(value: Any) -> dict[str, Any]:
    if isinstance(value, dict):
        return value
    if isinstance(value, str):
        parsed = json.loads(value)
        if isinstance(parsed, dict):
            return parsed
    raise ValueError("Expected JSON object")


def normalize_exercise(raw: dict[str, Any]) -> dict[str, Any]:
    correct = raw.get("correct_answer", raw.get("correctAnswer"))
    exercise_type = str(raw.get("type") or "MULTIPLE_CHOICE")
    return {
        "id": str(raw.get("id") or ""),
        "type": exercise_type,
        "prompt": raw.get("prompt"),
        "hint": raw.get("hint"),
        "explanation": raw.get("explanation"),
        "xp_reward": int(raw.get("xp_reward") or raw.get("xpReward") or 10),
        "options": raw.get("options"),
        "correct_answer": correct,
    }


def public_exercise(raw: dict[str, Any]) -> dict[str, Any]:
    exercise = normalize_exercise(raw)
    correct = exercise.get("correct_answer")
    public = {
        "id": exercise["id"],
        "type": exercise["type"],
        "prompt": exercise.get("prompt"),
        "hint": exercise.get("hint"),
        "explanation": exercise.get("explanation"),
        "xpReward": exercise.get("xp_reward", 10),
        "options": exercise.get("options"),
        "answerHashes": answer_hashes(correct) if correct is not None else [],
    }
    if exercise["type"] in {"MATCH_PAIRS", "DIAGRAM_LABEL"} and isinstance(correct, list):
        public["answerHashes"] = [
            *public["answerHashes"],
            answer_hash(sorted(correct, key=normalize_answer)),
        ]
    return {key: value for key, value in public.items() if value is not None}


def public_lesson(raw: dict[str, Any], version: str | None = None) -> dict[str, Any]:
    exercises = [public_exercise(item) for item in raw.get("exercises") or []]
    digest = version or hashlib.sha256(json.dumps(raw, sort_keys=True, default=str).encode()).hexdigest()[:12]
    return {
        "id": raw["id"],
        "courseId": raw.get("course_id") or raw.get("courseId"),
        "title": raw.get("title") or raw["id"],
        "titleSw": raw.get("title_sw") or raw.get("titleSw"),
        "estimatedMinutes": raw.get("estimated_minutes") or raw.get("estimatedMinutes") or 5,
        "exercises": exercises,
        "cdaccUnitId": raw.get("cdacc_unit_id") or raw.get("cdaccUnitId"),
        "examDomain": raw.get("exam_domain") or raw.get("examDomain"),
        "xpTotal": raw.get("xp_total") or raw.get("xpTotal") or sum(ex.get("xpReward", 0) for ex in exercises),
        "contentVersion": digest,
        "outline": raw.get("outline"),
        "briefing": raw.get("briefing"),
        "media": raw.get("media"),
    }


def register_published_lesson(raw: dict[str, Any], public: dict[str, Any] | None = None) -> dict[str, Any]:
    lesson_id = str(raw["id"])
    normalized = {
        **raw,
        "id": lesson_id,
        "exercises": [normalize_exercise(item) for item in raw.get("exercises") or []],
    }
    published = public or public_lesson(normalized)
    _raw_lessons[lesson_id] = normalized
    _public_lessons[lesson_id] = published
    return published


def register_published_path(payload: dict[str, Any]) -> dict[str, Any]:
    path_id = str(payload["id"])
    _paths[path_id] = payload
    return payload


def get_overlay_exercise(lesson_id: str, exercise_id: str) -> dict[str, Any] | None:
    lesson = _raw_lessons.get(lesson_id)
    if not lesson:
        return None
    for exercise in lesson.get("exercises") or []:
        if exercise.get("id") == exercise_id:
            return exercise
    return None


def get_overlay_public_lesson(lesson_id: str) -> dict[str, Any] | None:
    return _public_lessons.get(lesson_id)


def list_overlay_paths() -> list[dict[str, Any]]:
    return list(_paths.values())


def get_overlay_path(path_id: str) -> dict[str, Any] | None:
    return _paths.get(path_id)


def load_published_snapshot(lessons: list[dict[str, Any]], paths: list[dict[str, Any]]) -> None:
    for lesson in lessons:
        raw = _as_dict(lesson.get("raw") or lesson.get("raw_json") or lesson)
        public = lesson.get("public") or lesson.get("public_json")
        register_published_lesson(raw, _as_dict(public) if public else None)
    for path in paths:
        payload = _as_dict(path.get("payload") or path.get("payload_json") or path)
        register_published_path(payload)
