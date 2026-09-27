import pytest
from pathlib import Path
from src.validator import validate_catalogue, validate_lesson_file


def test_valid_lesson_file(tmp_path: Path) -> None:
    lesson_content = """
id: osi-intro
course_id: net-sec
title: "The OSI Model"
title_sw: "Mfumo wa OSI"
estimated_minutes: 5
license: "CC-BY-SA-4.0"
cdacc_unit_id: "CU/ICT/CS/CR/01/6"
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: "How many layers in OSI?"
    correct_answer: "7"
    xp_reward: 50
"""
    f = tmp_path / "lesson.yaml"
    f.write_text(lesson_content, encoding="utf-8")

    result = validate_lesson_file(f)
    assert result.is_valid
    assert len(result.errors) == 0


def test_invalid_license(tmp_path: Path) -> None:
    lesson_content = """
id: osi-intro
course_id: net-sec
title: "The OSI Model"
estimated_minutes: 5
license: "PROPRIETARY"
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: "Question?"
    correct_answer: "1"
    xp_reward: 50
"""
    f = tmp_path / "lesson.yaml"
    f.write_text(lesson_content, encoding="utf-8")

    result = validate_lesson_file(f)
    assert not result.is_valid
    assert any("Invalid license" in e for e in result.errors)


def _write_lesson(root: Path, lesson_id: str = "demo-lesson") -> None:
    (root / "lessons").mkdir(exist_ok=True)
    (root / "lessons" / f"{lesson_id}.yaml").write_text(
        f"""
id: {lesson_id}
course_id: demo
title: Demo
estimated_minutes: 10
license: CC-BY-SA-4.0
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: Q?
    correct_answer: "1"
    xp_reward: 50
""",
        encoding="utf-8",
    )


def _write_path(root: Path, path_id: str, lesson_id: str) -> None:
    (root / "skill-paths").mkdir(exist_ok=True)
    (root / "skill-paths" / f"{path_id}.yaml").write_text(
        f"""
id: {path_id}
title: Demo path
nodes:
  - id: {path_id}-unit
    title: Unit
    lesson_ids:
      - {lesson_id}
""",
        encoding="utf-8",
    )


def test_catalogue_rejects_missing_lesson_id(tmp_path: Path) -> None:
    _write_lesson(tmp_path)
    _write_path(tmp_path, "automotive", "missing-lesson")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - automotive\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("missing-lesson" in error for error in result.errors)


def test_catalogue_rejects_missing_featured_id(tmp_path: Path) -> None:
    _write_lesson(tmp_path)
    _write_path(tmp_path, "automotive", "demo-lesson")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - not-a-real-course\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("not-a-real-course" in error for error in result.errors)


def test_catalogue_accepts_featured_and_lessons(tmp_path: Path) -> None:
    _write_lesson(tmp_path)
    _write_path(tmp_path, "automotive", "demo-lesson")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - automotive\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert result.is_valid
