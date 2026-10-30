#!/usr/bin/env python3
"""Build the PWA's lesson catalogue from content/ YAML.

Two outputs, so the app download stays small and lessons update without an app release:

- apps/pwa/src/content/generated/catalogue.json is bundled into the app: every skill path,
  plus a short stub per lesson (titles, outline, timing), enough to draw course pages.
- apps/pwa/public/packs/ holds one JSON "course pack" per course with the full lessons
  (exercises, briefings, notes), named by content hash so the CDN can cache it for good,
  and manifest.json, which maps each course to its current pack. The app fetches a pack
  when a lesson opens, or ahead of time for the learner's chosen courses, and the service
  worker keeps it for offline use.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CONTENT = ROOT / "content"
OUT = ROOT / "apps" / "pwa" / "src" / "content" / "generated" / "catalogue.json"
PACKS_DIR = ROOT / "apps" / "pwa" / "public" / "packs"
# Fields only the lesson player needs. They live in packs, not in the bundled stub.
PACK_ONLY_FIELDS = ("exercises", "briefing", "briefingSw", "media", "contentMd")


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


def lesson_stub(lesson: dict) -> dict:
    stub = {key: value for key, value in lesson.items() if key not in PACK_ONLY_FIELDS}
    stub["exercises"] = []
    stub["stub"] = True
    return stub


def write_packs(lessons: list[dict]) -> dict:
    by_course: dict[str, list[dict]] = {}
    for lesson in lessons:
        by_course.setdefault(lesson["courseId"], []).append(lesson)

    PACKS_DIR.mkdir(parents=True, exist_ok=True)
    for old in PACKS_DIR.glob("*.json"):
        old.unlink()  # stale hashed packs; the deploy keeps old copies on the CDN for open sessions

    packs = {}
    for course_id in sorted(by_course):
        course_lessons = sorted(by_course[course_id], key=lambda item: item["id"])
        body = json.dumps({"courseId": course_id, "lessons": course_lessons}, ensure_ascii=False, sort_keys=True)
        digest = hashlib.sha256(body.encode("utf-8")).hexdigest()[:12]
        name = f"{course_id}.{digest}.json"
        (PACKS_DIR / name).write_text(body, encoding="utf-8")
        packs[course_id] = {
            "file": name,
            "version": digest,
            "lessonIds": [item["id"] for item in course_lessons],
            "bytes": len(body.encode("utf-8")),
        }
    manifest_body = json.dumps(packs, sort_keys=True)
    manifest = {"version": hashlib.sha256(manifest_body.encode("utf-8")).hexdigest()[:12], "packs": packs}
    (PACKS_DIR / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n", encoding="utf-8")
    return manifest


def main() -> None:
    lessons = []
    for path in sorted((CONTENT / "lessons").glob("*.yaml")):
        raw = load_yaml(path)
        lesson = public_lesson(raw)
        content_md = (raw.get("content_md") or raw.get("contentMd") or "").strip()
        if content_md:
            lesson["contentMd"] = content_md
        lessons.append(lesson)
    paths = []
    for path in sorted((CONTENT / "skill-paths").glob("*.yaml")):
        paths.append(public_path(load_yaml(path)))
    featured = load_featured_path_ids()
    manifest = write_packs(lessons)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "contentVersion": "1",
                "packsVersion": manifest["version"],
                "featuredPathIds": featured,
                "paths": paths,
                "lessons": [lesson_stub(lesson) for lesson in lessons],
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    total = sum(item["bytes"] for item in manifest["packs"].values())
    print(f"Wrote {len(paths)} paths, {len(lessons)} lesson stubs, {len(featured)} featured ids to {OUT}")
    print(f"Wrote {len(manifest['packs'])} course packs ({total / 1024:.0f} KB) to {PACKS_DIR}")


if __name__ == "__main__":
    main()
