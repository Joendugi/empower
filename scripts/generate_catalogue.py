#!/usr/bin/env python3
"""Build apps/pwa/src/content/generated/catalogue.json from content/ YAML."""

from __future__ import annotations

import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "apps" / "pwa" / "src" / "content" / "generated" / "catalogue.json"


def load_yaml(path: Path) -> dict:
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"Expected mapping in {path}")
    return data


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
        "correctAnswer": raw.get("correct_answer") or raw.get("correctAnswer"),
        "media": raw.get("media"),
        "rubric": raw.get("rubric"),
        "minSeconds": raw.get("min_seconds") or raw.get("minSeconds"),
    }
    return {key: value for key, value in exercise.items() if value is not None}


def public_lesson(raw: dict) -> dict:
    exercises = [public_exercise(item) for item in raw.get("exercises", [])]
    return {
        "id": raw["id"],
        "courseId": raw.get("course_id") or raw.get("courseId"),
        "title": raw["title"],
        "titleSw": raw.get("title_sw") or raw.get("titleSw"),
        "briefing": raw.get("briefing"),
        "briefingSw": raw.get("briefing_sw") or raw.get("briefingSw"),
        "estimatedMinutes": raw.get("estimated_minutes") or raw.get("estimatedMinutes", 5),
        "exercises": exercises,
        "cdaccUnitId": raw.get("cdacc_unit_id") or raw.get("cdaccUnitId"),
        "examDomain": raw.get("exam_domain") or raw.get("examDomain"),
        "xpTotal": raw.get("xp_total") or sum(item.get("xpReward", 0) for item in exercises),
        "license": raw.get("license"),
        "media": raw.get("media"),
        "contentVersion": raw.get("content_version") or raw.get("contentVersion") or "1",
    }


def public_path(raw: dict) -> dict:
    nodes = []
    for node in raw.get("nodes", []):
        nodes.append(
            {
                "id": node["id"],
                "title": node["title"],
                "titleSw": node.get("title_sw") or node.get("titleSw"),
                "description": node.get("description"),
                "prerequisites": node.get("prerequisites") or [],
                "lessonIds": node.get("lesson_ids") or node.get("lessonIds") or [],
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
    for path in sorted((CONTENT / "lessons").glob("*.yaml")):
        lessons.append(public_lesson(load_yaml(path)))
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
    print(f"Wrote {len(paths)} paths, {len(lessons)} lessons, {len(featured)} featured ids to {OUT}")


if __name__ == "__main__":
    main()
