#!/usr/bin/env python3
"""Build apps/pwa/src/content/generated/catalogue.json from content/ YAML."""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "apps" / "pwa" / "src" / "content" / "generated" / "catalogue.json"
# Long-form lesson notes, kept out of the main bundle and loaded when a lesson opens.
NOTES_OUT = OUT.with_name("lessonNotes.json")


def load_yaml(path: Path) -> dict:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected mapping in {path}")
    return data


def _normalize_answer(value) -> str:
    # Must match apps/api/app/services/grading.normalize_answer and the PWA's lib/hash.normalizeAnswer.
    if isinstance(value, list):
        return "|".join(_normalize_answer(item) for item in value)
    return " ".join(str(value).strip().lower().split())


def _answer_hash(value) -> str:
    return hashlib.sha256(_normalize_answer(value).encode("utf-8")).hexdigest()


def answer_hashes(exercise_type: str, correct) -> list[str]:
    """Same hashes the API serves (app/services/content.py), so no plaintext key ships in the bundle."""
    if correct is None or correct == "" or correct == []:
        return []
    if isinstance(correct, list):
        hashes = [_answer_hash(item) for item in correct] + [_answer_hash(correct)]
        if exercise_type in {"MATCH_PAIRS", "DIAGRAM_LABEL"}:
            hashes.append(_answer_hash(sorted(correct, key=_normalize_answer)))
        return hashes
    return [_answer_hash(correct)]


def public_exercise(raw: dict) -> dict:
    exercise = {
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
        "diagramKind": raw.get("diagram_kind") or raw.get("diagramKind"),
        "terminalResponses": raw.get("terminal_responses") or raw.get("terminalResponses"),
        "answerHashes": answer_hashes(raw["type"], raw.get("correct_answer", raw.get("correctAnswer"))) or None,
        "media": raw.get("media"),
        "rubric": raw.get("rubric"),
        "minSeconds": raw.get("min_seconds") or raw.get("minSeconds"),
    }
    return {key: value for key, value in exercise.items() if value is not None}


def public_lesson(raw: dict) -> dict:
    exercises = [public_exercise(item) for item in raw.get("exercises", [])]
    lesson = {
        "id": raw["id"],
        "courseId": raw.get("course_id") or raw.get("courseId"),
        "title": raw["title"],
        "titleSw": raw.get("title_sw") or raw.get("titleSw"),
        "briefing": raw.get("briefing"),
        "briefingSw": raw.get("briefing_sw") or raw.get("briefingSw"),
        "outline": raw.get("outline"),
        "weekNumber": raw.get("week_number") or raw.get("weekNumber"),
        "dayNumber": raw.get("day_number") or raw.get("dayNumber"),
        "estimatedMinutes": raw.get("estimated_minutes") or raw.get("estimatedMinutes", 5),
        "exercises": exercises,
        "cdaccUnitId": raw.get("cdacc_unit_id") or raw.get("cdaccUnitId"),
        "examDomain": raw.get("exam_domain") or raw.get("examDomain"),
        "xpTotal": raw.get("xp_total") or sum(item.get("xpReward", 0) for item in exercises),
        "license": raw.get("license"),
        "media": raw.get("media"),
        "contentVersion": raw.get("content_version") or raw.get("contentVersion") or "1",
    }
    return {key: value for key, value in lesson.items() if value is not None}


def public_path(raw: dict) -> dict:
    nodes = []
    for idx, node in enumerate(raw.get("nodes", [])):
        lesson_ids = node.get("lesson_ids") or node.get("lessonIds") or []
        if not lesson_ids and node.get("lessonId"):
            lesson_ids = [str(node["lessonId"])]
        node_id = str(node.get("id") or node.get("node_id") or node.get("lessonId") or f"{raw.get('id', 'path')}-node-{idx+1}")
        nodes.append(
            {
                "id": node_id,
                "title": node.get("title") or node_id,
                "titleSw": node.get("title_sw") or node.get("titleSw"),
                "description": node.get("description"),
                "prerequisites": node.get("prerequisites") or [],
                "lessonIds": lesson_ids,
                "badgeIds": node.get("badge_ids") or node.get("badgeIds") or [],
                "cdaccUnitId": node.get("cdacc_unit_id") or node.get("cdaccUnitId"),
                "examDomain": node.get("exam_domain") or node.get("examDomain"),
                "icon": node.get("icon"),
            }
        )
    return {
        "id": raw["id"],
        "title": raw["title"],
        "titleSw": raw.get("title_sw") or raw.get("titleSw"),
        "description": raw.get("description") or "",
        "descriptionSw": raw.get("description_sw") or raw.get("descriptionSw"),
        "certificationTarget": raw.get("certification_target") or raw.get("certificationTarget"),
        "track": raw.get("track"),
        "contentVersion": str(raw.get("content_version") or raw.get("contentVersion") or "1"),
        "nodes": nodes,
    }


def load_featured_path_ids() -> list[str]:
    featured = CONTENT / "featured.yaml"
    if not featured.exists():
        return ["automotive", "solar-energy", "cybersecurity"]
    data = load_yaml(featured)
    raw = data.get("path_ids") or data.get("pathIds") or data.get("ids") or []
    return [str(item).strip() for item in raw if str(item).strip()]


def main() -> None:
    lessons = []
    notes: dict[str, str] = {}
    for path in sorted((CONTENT / "lessons").glob("*.yaml")):
        raw = load_yaml(path)
        lessons.append(public_lesson(raw))
        content_md = (raw.get("content_md") or raw.get("contentMd") or "").strip()
        if content_md:
            notes[raw["id"]] = content_md
    paths = []
    for path in sorted((CONTENT / "skill-paths").glob("*.yaml")):
        paths.append(public_path(load_yaml(path)))
    featured = load_featured_path_ids()
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "contentVersion": "1",
                "featuredPathIds": featured,
                "paths": paths,
                "lessons": lessons,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    NOTES_OUT.write_text(json.dumps(notes, ensure_ascii=False, sort_keys=True) + "\n", encoding="utf-8")
    print(f"Wrote {len(paths)} paths, {len(lessons)} lessons, {len(featured)} featured ids to {OUT}")
    print(f"Wrote detailed notes for {len(notes)} lessons to {NOTES_OUT}")


if __name__ == "__main__":
    main()
