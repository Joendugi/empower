import pytest
from pathlib import Path
from src.validator import validate_lesson_file


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
