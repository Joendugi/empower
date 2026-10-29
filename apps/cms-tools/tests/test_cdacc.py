from __future__ import annotations

import pytest
from pathlib import Path

from src.validator import validate_lesson_file
from src.cdacc_database import (
    CDACCUnit,
    lookup_unit,
    lookup_units_for_lesson,
    all_unit_ids,
    units_by_level,
    units_by_type,
    validate_cdacc_alignment,
    CDACC_UNIT_REGISTRY,
)


# ─── Unit Registry Tests ─────────────────────────────────────────────────────

def test_registry_has_entries() -> None:
    assert len(CDACC_UNIT_REGISTRY) >= 8
    ids = all_unit_ids()
    assert len(ids) == len(CDACC_UNIT_REGISTRY)


def test_lookup_known_unit() -> None:
    unit = lookup_unit("CU/ICT/CS/CR/01/6")
    assert unit is not None
    assert isinstance(unit, CDACCUnit)
    assert unit.knqa_level == 6
    assert unit.unit_type == "CR"
    assert "Network Security" in unit.title
    assert len(unit.learning_outcomes) >= 2
    assert len(unit.performance_criteria) >= 2


def test_lookup_unknown_unit_returns_none() -> None:
    result = lookup_unit("CU/ICT/CS/ZZ/99/9")
    assert result is None


def test_lookup_units_for_lesson_known() -> None:
    units = lookup_units_for_lesson("rebuild-000-3-1")
    assert len(units) >= 1
    ids = [u.unit_id for u in units]
    assert "CU/ICT/CS/CR/02/4" in ids


def test_lookup_units_for_lesson_unknown() -> None:
    units = lookup_units_for_lesson("does-not-exist-lesson")
    assert units == []


def test_units_by_level() -> None:
    level3 = units_by_level(3)
    assert all(u.knqa_level == 3 for u in level3)
    assert len(level3) >= 2

    level6 = units_by_level(6)
    assert all(u.knqa_level == 6 for u in level6)


def test_units_by_type() -> None:
    core = units_by_type("CR")
    assert all(u.unit_type == "CR" for u in core)

    elective = units_by_type("EL")
    assert all(u.unit_type == "EL" for u in elective)

    foundation = units_by_type("FD")
    assert all(u.unit_type == "FD" for u in foundation)


def test_all_unit_ids_unique() -> None:
    ids = [u.unit_id for u in CDACC_UNIT_REGISTRY]
    assert len(ids) == len(set(ids)), "Duplicate unit IDs in CDACC registry!"


def test_all_units_have_required_fields() -> None:
    for unit in CDACC_UNIT_REGISTRY:
        assert unit.unit_id.startswith("CU/"), f"{unit.unit_id} has invalid format"
        assert unit.title
        assert unit.description
        assert 1 <= unit.knqa_level <= 8
        assert unit.unit_type in ("FD", "CR", "EL")


# ─── CDACCAlignmentResult Tests ──────────────────────────────────────────────

def test_validate_cdacc_alignment_valid_registered() -> None:
    result = validate_cdacc_alignment("rebuild-000-1-1", "CU/ICT/CS/FD/01/3")
    assert result.is_valid
    assert result.unit_found is True
    assert result.unit is not None
    assert result.unit.unit_id == "CU/ICT/CS/FD/01/3"
    # rebuild-000-1-1 IS in the suggested lessons, so no consistency warning
    assert not any("bidirectional" in w.lower() for w in result.warnings)


def test_validate_cdacc_alignment_valid_not_in_registry() -> None:
    # Valid format but not in registry → warning, not error
    result = validate_cdacc_alignment("some-lesson", "CU/ICT/CS/CR/99/4")
    assert result.is_valid
    assert result.unit_found is False
    assert len(result.warnings) == 1
    assert "not found in CyberLearn CDACC registry" in result.warnings[0]


def test_validate_cdacc_alignment_invalid_format() -> None:
    # Malformed unit ID → error
    result = validate_cdacc_alignment("some-lesson", "NOT-A-VALID-ID")
    assert not result.is_valid
    assert any("does not match standard format" in e for e in result.errors)


def test_validate_cdacc_alignment_no_unit_id() -> None:
    # No unit ID → warning about no mapping
    result = validate_cdacc_alignment("some-lesson", None)
    assert result.is_valid
    assert len(result.warnings) == 1
    assert "not mapped" in result.warnings[0]


def test_validate_cdacc_alignment_inconsistent_lesson() -> None:
    # Lesson ID not in unit's suggested_cyberlearn_lessons → consistency warning
    result = validate_cdacc_alignment("lesson-not-in-unit", "CU/ICT/CS/CR/01/6")
    assert result.is_valid
    assert result.unit_found is True
    assert any("does not list the lesson" in w for w in result.warnings)


# ─── Validator Integration Tests ─────────────────────────────────────────────

def test_validator_passes_registered_cdacc_unit(tmp_path: Path) -> None:
    """Lesson with a registered CDACC unit ID should validate cleanly."""
    f = tmp_path / "lesson.yaml"
    f.write_text(
        """
id: rebuild-000-1-1
course_id: the-rebuild-protocol
title: "What is Digital Infrastructure?"
title_sw: "Miundombinu ya kidijitali ni nini?"
estimated_minutes: 10
license: CC-BY-SA-4.0
cdacc_unit_id: "CU/ICT/CS/FD/01/3"
exercises:
  - id: r000-11-q1
    type: MULTIPLE_CHOICE
    prompt: "How many infrastructure layers are there?"
    correct_answer: "5"
    options:
      - id: "5"
        text: Right
      - id: "other"
        text: Wrong
    xp_reward: 20
""",
        encoding="utf-8",
    )
    result = validate_lesson_file(f)
    assert result.is_valid
    assert len(result.errors) == 0


def test_validator_warns_unregistered_cdacc_unit(tmp_path: Path) -> None:
    """Lesson with valid-format but unregistered unit ID should produce a warning, not an error."""
    f = tmp_path / "lesson.yaml"
    f.write_text(
        """
id: some-lesson
course_id: demo
title: "Demo Lesson"
title_sw: "Somo la Demo"
estimated_minutes: 5
license: CC-BY-SA-4.0
cdacc_unit_id: "CU/ICT/CS/CR/88/3"
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: "Question?"
    correct_answer: "1"
    options:
      - id: "1"
        text: Right
      - id: "other"
        text: Wrong
    xp_reward: 20
""",
        encoding="utf-8",
    )
    result = validate_lesson_file(f)
    assert result.is_valid
    assert any("not found in CyberLearn CDACC registry" in w for w in result.warnings)


def test_validator_errors_on_malformed_cdacc_unit_id(tmp_path: Path) -> None:
    """Lesson with a malformed CDACC unit ID should fail validation."""
    f = tmp_path / "lesson.yaml"
    f.write_text(
        """
id: bad-cdacc-lesson
course_id: demo
title: "Bad CDACC Lesson"
title_sw: "Somo Baya"
estimated_minutes: 5
license: CC-BY-SA-4.0
cdacc_unit_id: "INVALID-FORMAT"
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: "Q?"
    correct_answer: "1"
    options:
      - id: "1"
        text: Right
      - id: "other"
        text: Wrong
    xp_reward: 20
""",
        encoding="utf-8",
    )
    result = validate_lesson_file(f)
    assert not result.is_valid
    assert any("does not match standard format" in e for e in result.errors)


def test_validator_warns_no_cdacc_unit_id(tmp_path: Path) -> None:
    """Lesson missing cdacc_unit_id should produce a CDACC coverage warning."""
    f = tmp_path / "lesson.yaml"
    f.write_text(
        """
id: no-cdacc-lesson
course_id: demo
title: "No CDACC Lesson"
title_sw: "Somo Bila CDACC"
estimated_minutes: 5
license: CC-BY-SA-4.0
exercises:
  - id: ex1
    type: MULTIPLE_CHOICE
    prompt: "Q?"
    correct_answer: "1"
    options:
      - id: "1"
        text: Right
      - id: "other"
        text: Wrong
    xp_reward: 20
""",
        encoding="utf-8",
    )
    result = validate_lesson_file(f)
    assert result.is_valid
    assert any("not mapped" in w.lower() for w in result.warnings)


# ─── Coverage Report ─────────────────────────────────────────────────────────

def test_coverage_report_shows_gap_units() -> None:
    covered = [u for u in CDACC_UNIT_REGISTRY if u.suggested_cyberlearn_lessons]
    uncovered = [u for u in CDACC_UNIT_REGISTRY if not u.suggested_cyberlearn_lessons]
    # At least some should have lessons
    assert len(covered) >= 5
    # Cloud, DFIR units are intentional gaps (no lessons yet)
    uncovered_ids = {u.unit_id for u in uncovered}
    assert "CU/ICT/CS/EL/01/5" in uncovered_ids  # Cloud security — no lesson yet
    assert "CU/ICT/CS/EL/03/6" in uncovered_ids  # DFIR — no lesson yet
