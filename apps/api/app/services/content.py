from __future__ import annotations

import hashlib
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml

from app.config import settings
from app.services.grading import answer_hash, answer_hashes, normalize_answer
from app.services.published_catalog import (
    get_overlay_exercise,
    get_overlay_path,
    get_overlay_public_lesson,
    list_overlay_paths,
)


def _content_root() -> Path:
    configured = Path(settings.CONTENT_DIR)
    if configured.exists():
        return configured
    here = Path(__file__).resolve()
    for candidate in (
        here.parents[4] / "content",  # repo root from app/services/
        here.parents[2] / "content",  # apps/api/content
        Path.cwd() / "content",
        Path("/content"),
    ):
        if candidate.exists():
            return candidate
    return configured


def _load_yaml(path: Path) -> dict[str, Any]:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected mapping in {path}")
    return data


def _file_version(path: Path) -> str:
    raw = f"{path.stat().st_mtime_ns}:{path.read_bytes()!r}"
    return hashlib.sha256(raw.encode("utf-8", errors="replace")).hexdigest()[:12]


def _public_exercise(raw: dict[str, Any]) -> dict[str, Any]:
    correct = raw.get("correct_answer")
    public = {
        "id": raw["id"],
        "type": raw["type"],
        "prompt": raw["prompt"],
        "hint": raw.get("hint"),
        "explanation": raw.get("explanation"),
        "xpReward": raw.get("xp_reward", raw.get("xpReward", 10)),
        "options": raw.get("options"),
        "pairs": raw.get("pairs"),
        "dragItems": raw.get("drag_items") or raw.get("dragItems"),
        "diagramSlots": raw.get("diagram_slots") or raw.get("diagramSlots"),
        "terminalResponses": raw.get("terminal_responses") or raw.get("terminalResponses"),
        "answerHashes": answer_hashes(correct) if correct is not None else [],
    }
    if raw["type"] in {"MATCH_PAIRS", "DIAGRAM_LABEL"} and isinstance(correct, list):
        public["answerHashes"] = [
            *public["answerHashes"],
            answer_hash(sorted(correct, key=normalize_answer)),
        ]
    return {key: value for key, value in public.items() if value is not None}


def _public_lesson(raw: dict[str, Any], path: Path) -> dict[str, Any]:
    exercises = [_public_exercise(ex) for ex in raw.get("exercises", [])]
    xp_total = raw.get("xp_total") or sum(ex.get("xpReward", 0) for ex in exercises)
    return {
        "id": raw["id"],
        "courseId": raw.get("course_id") or raw.get("courseId"),
        "title": raw["title"],
        "titleSw": raw.get("title_sw") or raw.get("titleSw"),
        "estimatedMinutes": raw.get("estimated_minutes") or raw.get("estimatedMinutes", 5),
        "exercises": exercises,
        "cdaccUnitId": raw.get("cdacc_unit_id") or raw.get("cdaccUnitId"),
        "examDomain": raw.get("exam_domain") or raw.get("examDomain"),
        "xpTotal": xp_total,
        "contentVersion": _file_version(path),
        "license": raw.get("license"),
    }


@lru_cache(maxsize=1)
def _catalog() -> dict[str, Any]:
    root = _content_root()
    lessons: dict[str, dict[str, Any]] = {}
    raw_lessons: dict[str, dict[str, Any]] = {}
    lesson_paths: dict[str, Path] = {}
    for path in sorted((root / "lessons").glob("*.yaml")):
        raw = _load_yaml(path)
        lesson_id = str(raw["id"])
        raw_lessons[lesson_id] = raw
        lesson_paths[lesson_id] = path
        lessons[lesson_id] = _public_lesson(raw, path)

    paths: dict[str, dict[str, Any]] = {}
    for path in sorted((root / "skill-paths").glob("*.yaml")):
        raw = _load_yaml(path)
        nodes = []
        for node in raw.get("nodes", []):
            lesson_ids = node.get("lesson_ids") or node.get("lessonIds") or []
            nodes.append(
                {
                    "id": node["id"],
                    "title": node["title"],
                    "titleSw": node.get("title_sw") or node.get("titleSw"),
                    "description": node.get("description"),
                    "prerequisites": node.get("prerequisites") or [],
                    "lessonIds": lesson_ids,
                    "badgeIds": node.get("badge_ids") or node.get("badgeIds") or [],
                    "cdaccUnitId": node.get("cdacc_unit_id") or node.get("cdaccUnitId"),
                    "examDomain": node.get("exam_domain") or node.get("examDomain"),
                    "icon": node.get("icon"),
                    "xpTotal": sum(lessons[lid]["xpTotal"] for lid in lesson_ids if lid in lessons),
                    "lessonCount": len(lesson_ids),
                }
            )
        paths[str(raw["id"])] = {
            "id": raw["id"],
            "title": raw["title"],
            "titleSw": raw.get("title_sw") or raw.get("titleSw"),
            "description": raw.get("description"),
            "descriptionSw": raw.get("description_sw") or raw.get("descriptionSw"),
            "certificationTarget": raw.get("certification_target") or raw.get("certificationTarget"),
            "track": raw.get("track"),
            "contentVersion": str(raw.get("content_version") or raw.get("contentVersion") or "1"),
            "nodes": nodes,
        }
    return {"lessons": lessons, "raw_lessons": raw_lessons, "paths": paths, "lesson_paths": lesson_paths}


def list_skill_paths() -> list[dict[str, Any]]:
    bundled = {path["id"]: path for path in _catalog()["paths"].values()}
    for path in list_overlay_paths():
        bundled[path["id"]] = path
    return list(bundled.values())


def get_skill_path(path_id: str) -> dict[str, Any] | None:
    return _catalog()["paths"].get(path_id) or get_overlay_path(path_id)


def get_public_lesson(lesson_id: str) -> dict[str, Any] | None:
    return _catalog()["lessons"].get(lesson_id) or get_overlay_public_lesson(lesson_id)


def get_raw_exercise(lesson_id: str, exercise_id: str) -> dict[str, Any] | None:
    lesson = _catalog()["raw_lessons"].get(lesson_id)
    if lesson:
        for exercise in lesson.get("exercises", []):
            if exercise.get("id") == exercise_id:
                return exercise
    return get_overlay_exercise(lesson_id, exercise_id)


def list_lesson_ids_for_path() -> dict[str, list[str]]:
    mapping: dict[str, list[str]] = {}
    for path in _catalog()["paths"].values():
        for node in path["nodes"]:
            mapping[node["id"]] = list(node["lessonIds"])
    return mapping
