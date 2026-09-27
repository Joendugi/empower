from __future__ import annotations

import re
from pathlib import Path
from typing import Any, List, Optional
import yaml
from pydantic import BaseModel, Field, ValidationError

# Permitted open content licenses
ALLOWED_LICENSES = {
    "CC-BY-4.0",
    "CC-BY-SA-4.0",
    "CC0-1.0",
    "MIT",
    "Apache-2.0",
}

# CDACC Unit format: e.g. CU/ICT/CS/CR/01/6
CDACC_UNIT_REGEX = re.compile(r"^CU/[A-Z]{2,4}/[A-Z]{2,4}/[A-Z]{2,4}/\d{2}/\d$")

DEFAULT_FEATURED_PATH_IDS = ("automotive", "solar-energy", "cybersecurity")


def load_featured_path_ids(content_root: Path) -> list[str]:
    featured_file = content_root / "featured.yaml"
    if not featured_file.exists():
        return list(DEFAULT_FEATURED_PATH_IDS)
    data = yaml.safe_load(featured_file.read_text(encoding="utf-8")) or {}
    raw = data.get("path_ids") or data.get("pathIds") or data.get("ids") or []
    return [str(item).strip() for item in raw if str(item).strip()]


class ExerciseModel(BaseModel):
    id: str
    type: str = Field(
        ...,
        pattern="^(MULTIPLE_CHOICE|DRAG_DROP|FILL_BLANK|TERMINAL_SIM|MATCH_PAIRS|SCENARIO|DIAGRAM_LABEL|MEDIA|VIDEO_RECORD|AUDIO_RECORD|PHOTO_CAPTURE)$",
    )
    prompt: str
    correct_answer: Any = None
    xp_reward: int = Field(ge=5, le=200)
    hint: Optional[str] = None
    explanation: Optional[str] = None
    options: Optional[list[dict[str, Any]]] = None
    pairs: Optional[list[dict[str, Any]]] = None
    drag_items: Optional[list[dict[str, Any]]] = None
    diagram_slots: Optional[list[dict[str, Any]]] = None
    terminal_responses: Optional[dict[str, str]] = None


class LessonManifest(BaseModel):
    id: str
    course_id: str
    title: str
    title_sw: Optional[str] = None
    estimated_minutes: int = Field(ge=1, le=180)
    license: str
    cdacc_unit_id: Optional[str] = None
    exam_domain: Optional[str] = None
    exercises: List[ExerciseModel]


class ValidationResult:
    def __init__(self, file_path: Path):
        self.file_path = file_path
        self.errors: List[str] = []
        self.warnings: List[str] = []

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0


def validate_lesson_file(path: Path) -> ValidationResult:
    result = ValidationResult(path)

    if not path.exists():
        result.errors.append(f"File not found: {path}")
        return result

    try:
        content = yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception as e:
        result.errors.append(f"YAML Syntax Error: {e}")
        return result

    try:
        manifest = LessonManifest(**content)
    except ValidationError as e:
        for err in e.errors():
            loc = " -> ".join(str(l) for l in err["loc"])
            result.errors.append(f"Schema Error [{loc}]: {err['msg']}")
        return result

    # License check
    if manifest.license not in ALLOWED_LICENSES:
        result.errors.append(
            f"Invalid license '{manifest.license}'. Must be one of: {', '.join(sorted(ALLOWED_LICENSES))}"
        )

    # CDACC Unit format check
    if manifest.cdacc_unit_id:
        if not CDACC_UNIT_REGEX.match(manifest.cdacc_unit_id):
            result.warnings.append(
                f"CDACC unit ID '{manifest.cdacc_unit_id}' does not match standard pattern CU/XXX/XX/XX/00/0"
            )

    # Swahili translation coverage warning
    if not manifest.title_sw:
        result.warnings.append("Missing Swahili title ('title_sw')")

    return result


def validate_catalogue(content_root: Path) -> ValidationResult:
    result = ValidationResult(content_root)
    lessons_dir = content_root / "lessons"
    paths_dir = content_root / "skill-paths"
    lesson_ids: set[str] = set()
    path_ids: set[str] = set()
    for file in lessons_dir.glob("*.yaml"):
        data = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        if data.get("id"):
            lesson_ids.add(str(data["id"]))
        lesson_result = validate_lesson_file(file)
        result.errors.extend(f"{file.name}: {error}" for error in lesson_result.errors)
        result.warnings.extend(f"{file.name}: {warning}" for warning in lesson_result.warnings)
    for file in paths_dir.glob("*.yaml"):
        data = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        if data.get("id"):
            path_ids.add(str(data["id"]))
        for node in data.get("nodes", []):
            for lesson_id in node.get("lesson_ids") or node.get("lessonIds") or []:
                if lesson_id not in lesson_ids:
                    result.errors.append(f"{file.name}: lesson_ids missing file for '{lesson_id}'")
    if not path_ids:
        result.errors.append("No skill-path YAML files found")
    for featured_id in load_featured_path_ids(content_root):
        if featured_id not in path_ids:
            result.errors.append(f"featured id '{featured_id}' has no skill-path file")
    return result

