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


class ExerciseModel(BaseModel):
    id: str
    type: str = Field(
        ...,
        pattern="^(MULTIPLE_CHOICE|DRAG_DROP|FILL_BLANK|TERMINAL_SIM|MATCH_PAIRS|SCENARIO|DIAGRAM_LABEL)$",
    )
    prompt: str
    correct_answer: Any
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
    estimated_minutes: int = Field(ge=1, le=60)
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
