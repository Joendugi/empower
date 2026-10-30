from __future__ import annotations

import re
from pathlib import Path
from typing import Any, List, Optional
import yaml
from pydantic import BaseModel, Field, ValidationError

from src.cdacc_database import validate_cdacc_alignment

# Permitted open content licenses
ALLOWED_LICENSES = {
    "CC-BY-4.0",
    "CC-BY-SA-4.0",
    "CC0-1.0",
    "MIT",
    "Apache-2.0",
}

# CDACC Unit format: e.g. CU/ICT/CS/CR/01/6, CU/WEL/CR/01/5, or ENG/OS/EI/CR/04/6


DEFAULT_FEATURED_PATH_IDS = ("automotive", "solar-energy", "cybersecurity")


def load_featured_path_ids(content_root: Path) -> list[str]:
    featured_file = content_root / "featured.yaml"
    if not featured_file.exists():
        return list(DEFAULT_FEATURED_PATH_IDS)
    data = yaml.safe_load(featured_file.read_text(encoding="utf-8")) or {}
    raw = data.get("path_ids") or data.get("pathIds") or data.get("ids") or []
    return [str(item).strip() for item in raw if str(item).strip()]


class MediaModel(BaseModel):
    kind: str = Field(..., pattern="^(video|audio|animation|image)$")
    url: Optional[str] = None
    preset: Optional[str] = Field(None, pattern="^(pulse|gear|wave|weld|stitch|circuit)$")
    caption: Optional[str] = None
    must_finish: Optional[bool] = Field(None, alias="mustFinish")


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
    media: Optional[list[MediaModel]] = None


class LessonManifest(BaseModel):
    id: str
    course_id: str
    title: str
    title_sw: Optional[str] = None
    briefing: Optional[str] = None
    briefing_sw: Optional[str] = None
    outline: Optional[str] = None
    week_number: Optional[int] = None
    day_number: Optional[int] = None
    estimated_minutes: int = Field(ge=1, le=180)
    license: str
    cdacc_unit_id: Optional[str] = None
    exam_domain: Optional[str] = None
    narrative_frame: Optional[str] = None
    story_episode: Optional[str] = None
    media: Optional[list[MediaModel]] = None
    exercises: List[ExerciseModel]


# Tracks allowed in CyberLearn
ALLOWED_TRACKS = {"tvet", "cybersecurity", "trades"}

# Keywords specific to physical, mechanical, and vocational trades
TRADE_KEYWORDS = {
    "welding",
    "welder",
    "carpentry",
    "joinery",
    "woodworking",
    "plumbing",
    "pipefitting",
    "automotive",
    "masonry",
    "bricklaying",
    "tailoring",
    "garment",
    "sewing",
    "hairdressing",
    "cosmetology",
    "barbering",
    "agriculture",
    "husbandry",
    "farming",
    "aquaculture",
    "foundry",
    "metallurgy",
    "body-works",
    "refrigeration",
    "timber",
}

# Keywords specific to pure cybersecurity curricula
CYBERSECURITY_KEYWORDS = {
    "cybersecurity",
    "infosec",
    "phishing",
    "cryptography",
    "firewall",
    "reverse-proxy",
    "ctf",
    "osi-model",
    "malware",
    "pentest",
    "network-defense",
}


def detect_trade_keyword(text: str) -> Optional[str]:
    """Return the matched trade keyword if found in text, else None."""
    clean = re.sub(r"[^a-z0-9\-]", " ", text.lower())
    tokens = set(clean.replace("-", " ").split())
    for kw in TRADE_KEYWORDS:
        if kw in tokens or kw in clean:
            return kw
    return None


def detect_cybersecurity_keyword(text: str) -> Optional[str]:
    """Return the matched cybersecurity keyword if found in text, else None."""
    clean = re.sub(r"[^a-z0-9\-]", " ", text.lower())
    tokens = set(clean.replace("-", " ").split())
    for kw in CYBERSECURITY_KEYWORDS:
        if kw in tokens or kw in clean:
            return kw
    return None


class SkillNodeManifest(BaseModel):
    id: str = Field(..., min_length=2)
    title: str = Field(..., min_length=2)
    title_sw: Optional[str] = None
    description: Optional[str] = None
    description_sw: Optional[str] = None
    prerequisites: Optional[List[str]] = None
    lesson_ids: Optional[List[str]] = Field(None, alias="lessonIds")
    badge_ids: Optional[List[str]] = Field(None, alias="badgeIds")
    cdacc_unit_id: Optional[str] = Field(None, alias="cdaccUnitId")
    exam_domain: Optional[str] = Field(None, alias="examDomain")
    icon: Optional[str] = None


class SkillPathManifest(BaseModel):
    id: str = Field(..., pattern=r"^[a-z0-9]+(-[a-z0-9]+)*$")
    title: str = Field(..., min_length=2)
    title_sw: Optional[str] = None
    description: Optional[str] = None
    description_sw: Optional[str] = None
    certification_target: Optional[str] = Field(None, alias="certificationTarget")
    track: str = Field(..., pattern="^(tvet|cybersecurity|trades)$")
    content_version: Optional[str] = Field(None, alias="contentVersion")
    nodes: List[SkillNodeManifest] = Field(default_factory=list)


def validate_track_classification(manifest: SkillPathManifest) -> List[str]:
    """Enforce strict isolation between tracks: mechanical trades must never be under cybersecurity."""
    errors: List[str] = []

    # Rule 1: Mechanical/hands-on trades MUST NEVER be under cybersecurity
    if manifest.track == "cybersecurity":
        # Check path ID and title
        trade_kw = detect_trade_keyword(manifest.id) or detect_trade_keyword(manifest.title)
        if trade_kw:
            errors.append(
                f"Track classification error: Skill path '{manifest.id}' is categorized under track 'cybersecurity', "
                f"but contains trade keyword '{trade_kw}'. Mechanical and vocational trades (e.g. welding, carpentry, automotive) "
                f"must be categorized under 'trades' or 'tvet', never 'cybersecurity'."
            )
        # Check individual nodes
        for node in manifest.nodes:
            node_trade_kw = detect_trade_keyword(node.id) or detect_trade_keyword(node.title)
            if node_trade_kw:
                errors.append(
                    f"Track classification error: Node '{node.id}' in cybersecurity path '{manifest.id}' "
                    f"contains trade keyword '{node_trade_kw}'. Mechanical trades must not be in 'cybersecurity'."
                )

    # Rule 2: Pure cybersecurity curricula must not be under 'trades'
    elif manifest.track == "trades":
        cyber_kw = detect_cybersecurity_keyword(manifest.id)
        if cyber_kw:
            errors.append(
                f"Track classification error: Skill path '{manifest.id}' is categorized under track 'trades', "
                f"but matches cybersecurity keyword '{cyber_kw}'. Cybersecurity paths must use track 'cybersecurity'."
            )

    return errors


def validate_exercise_answers(exercises: list[dict[str, Any]]) -> List[str]:
    """Every auto-graded exercise must carry an answer key the PWA and API can actually grade."""
    errors: List[str] = []
    for ex in exercises:
        kind = ex.get("type")
        where = f"Exercise '{ex.get('id')}' ({kind})"
        answer = ex.get("correct_answer")
        if kind == "MULTIPLE_CHOICE":
            options = ex.get("options") or []
            ids = [o.get("id") for o in options if isinstance(o, dict)]
            if len(ids) != len(options) or not all(ids) or len(set(ids)) != len(ids):
                errors.append(f"{where}: every option needs a unique 'id'")
            elif str(answer) not in {str(i) for i in ids}:
                errors.append(f"{where}: correct_answer must be one of the option ids {ids}")
            if any(isinstance(o, dict) and "correct" in o for o in options):
                errors.append(f"{where}: use correct_answer, not per-option 'correct' flags (they ship to learners)")
        elif kind == "MATCH_PAIRS":
            pairs = ex.get("pairs") or []
            ok = all(
                isinstance(p.get(side), dict) and p[side].get("id") and p[side].get("text")
                for p in pairs
                for side in ("left", "right")
            )
            if not pairs or not ok:
                errors.append(f"{where}: pairs must be {{left: {{id, text}}, right: {{id, text}}}}")
            else:
                expected = {f"{p['left']['id']}={p['right']['id']}" for p in pairs}
                if not isinstance(answer, list) or set(map(str, answer)) != expected:
                    errors.append(f"{where}: correct_answer must list every 'leftId=rightId' pair")
        elif kind == "FILL_BLANK":
            blanks = str(ex.get("prompt", "")).count("___")
            if answer in (None, "", []):
                errors.append(f"{where}: missing correct_answer")
            elif blanks > 1 and (not isinstance(answer, list) or len(answer) != blanks):
                errors.append(f"{where}: prompt has {blanks} blanks, so correct_answer must be a list of {blanks}")
        elif kind in {"DRAG_DROP", "DIAGRAM_LABEL"} and answer in (None, "", []):
            errors.append(f"{where}: missing correct_answer")
    return errors


class ValidationResult:
    def __init__(self, file_path: Path):
        self.file_path = file_path
        self.errors: List[str] = []
        self.warnings: List[str] = []

    @property
    def is_valid(self) -> bool:
        return len(self.errors) == 0


def validate_skill_path_file(path: Path) -> ValidationResult:
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
        manifest = SkillPathManifest(**content)
    except ValidationError as e:
        for err in e.errors():
            loc = " -> ".join(str(l) for l in err["loc"])
            result.errors.append(f"Schema Error [{loc}]: {err['msg']}")
        return result

    # Check track classification isolation
    result.errors.extend(validate_track_classification(manifest))

    # A path the generator can't turn into nodes ships to learners as an empty course.
    raw_nodes = content.get("nodes") or []
    if not any(n.get("lesson_ids") or n.get("lessonIds") for n in raw_nodes if isinstance(n, dict)):
        hint = " (found 'lessons'/'weeks' — convert them to 'nodes')" if content.get("lessons") or content.get("weeks") else ""
        result.errors.append(f"Skill path has no nodes with lesson_ids{hint}")

    # Check node ID formatting
    for node in manifest.nodes:
        if not re.match(r"^[a-z0-9]+(-[a-z0-9]+)*$", node.id):
            result.errors.append(
                f"Node ID '{node.id}' must be lowercase alphanumeric with hyphens (kebab-case)"
            )

    if not manifest.title_sw:
        result.warnings.append("Missing Swahili title ('title_sw')")

    return result


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

    result.errors.extend(validate_exercise_answers(content.get("exercises") or []))

    # License check
    if manifest.license not in ALLOWED_LICENSES:
        result.errors.append(
            f"Invalid license '{manifest.license}'. Must be one of: {', '.join(sorted(ALLOWED_LICENSES))}"
        )

    # CDACC Unit validation: format check + registry lookup + bidirectional mapping
    cdacc = validate_cdacc_alignment(manifest.id, manifest.cdacc_unit_id)
    result.errors.extend(cdacc.errors)
    result.warnings.extend(cdacc.warnings)

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
    used_lesson_ids: set[str] = set()

    for file in lessons_dir.glob("*.yaml"):
        data = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        if data.get("id"):
            lesson_ids.add(str(data["id"]))
        lesson_result = validate_lesson_file(file)
        result.errors.extend(f"{file.name}: {error}" for error in lesson_result.errors)
        result.warnings.extend(f"{file.name}: {warning}" for warning in lesson_result.warnings)

    for file in paths_dir.glob("*.yaml"):
        path_result = validate_skill_path_file(file)
        result.errors.extend(f"{file.name}: {error}" for error in path_result.errors)
        result.warnings.extend(f"{file.name}: {warning}" for warning in path_result.warnings)

        data = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        if data.get("id"):
            path_ids.add(str(data["id"]))
        for node in data.get("nodes", []):
            for lesson_id in node.get("lesson_ids") or node.get("lessonIds") or []:
                used_lesson_ids.add(lesson_id)
                if lesson_id not in lesson_ids:
                    result.errors.append(f"{file.name}: lesson_ids missing file for '{lesson_id}'")

    if not path_ids:
        result.errors.append("No skill-path YAML files found")

    for orphan in sorted(lesson_ids - used_lesson_ids):
        result.warnings.append(f"{orphan}: lesson is not used by any skill path (learners cannot reach it)")

    for featured_id in load_featured_path_ids(content_root):
        if featured_id not in path_ids:
            result.errors.append(f"featured id '{featured_id}' has no skill-path file")

    return result

