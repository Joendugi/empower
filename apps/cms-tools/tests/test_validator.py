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
    options:
      - id: "7"
        text: Right
      - id: "other"
        text: Wrong
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
    options:
      - id: "1"
        text: Right
      - id: "other"
        text: Wrong
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
    options:
      - id: "1"
        text: Right
      - id: "other"
        text: Wrong
    xp_reward: 50
""",
        encoding="utf-8",
    )


def _write_path(root: Path, path_id: str, lesson_id: str, track: str = "trades") -> None:
    (root / "skill-paths").mkdir(exist_ok=True)
    (root / "skill-paths" / f"{path_id}.yaml").write_text(
        f"""
id: {path_id}
title: Demo path
title_sw: Njia ya mfano
track: {track}
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


def test_welding_rejected_in_cybersecurity_track(tmp_path: Path) -> None:
    """Welding and other mechanical trades must never be classified under cybersecurity."""
    _write_lesson(tmp_path)
    _write_path(tmp_path, "welding-fabrication", "demo-lesson", track="cybersecurity")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - welding-fabrication\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("welding" in err and "cybersecurity" in err for err in result.errors)


def test_trade_node_rejected_in_cybersecurity_track(tmp_path: Path) -> None:
    """A node containing trade keywords inside a cybersecurity path must be rejected."""
    (tmp_path / "skill-paths").mkdir(exist_ok=True)
    _write_lesson(tmp_path)
    (tmp_path / "skill-paths" / "cybersecurity.yaml").write_text(
        """
id: cybersecurity
title: Defensive Security
title_sw: Usalama wa Mtandao
track: cybersecurity
nodes:
  - id: carpentry-joinery-basics
    title: Carpentry Basics
    lesson_ids:
      - demo-lesson
""",
        encoding="utf-8",
    )
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - cybersecurity\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("carpentry" in err and "cybersecurity" in err for err in result.errors)


def test_cybersecurity_rejected_in_trades_track(tmp_path: Path) -> None:
    """Pure cybersecurity path must not be classified under trades."""
    _write_lesson(tmp_path)
    _write_path(tmp_path, "cybersecurity", "demo-lesson", track="trades")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - cybersecurity\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("Track classification error" in err for err in result.errors)


def test_invalid_node_id_format_rejected(tmp_path: Path) -> None:
    """Node ID with invalid characters must be rejected."""
    (tmp_path / "skill-paths").mkdir(exist_ok=True)
    _write_lesson(tmp_path)
    (tmp_path / "skill-paths" / "automotive.yaml").write_text(
        """
id: automotive
title: Automotive Service
title_sw: Huduma ya Magari
track: trades
nodes:
  - id: "Invalid Node ID!!"
    title: Auto Unit
    lesson_ids:
      - demo-lesson
""",
        encoding="utf-8",
    )
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - automotive\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert not result.is_valid
    assert any("kebab-case" in err for err in result.errors)


def _lesson_with(tmp_path: Path, exercise_yaml: str) -> Path:
    f = tmp_path / "lesson.yaml"
    f.write_text(
        "id: demo\ncourse_id: demo\ntitle: Demo\nestimated_minutes: 5\nlicense: CC-BY-SA-4.0\nexercises:\n"
        + exercise_yaml,
        encoding="utf-8",
    )
    return f


def test_mc_with_correct_flags_rejected(tmp_path: Path) -> None:
    f = _lesson_with(
        tmp_path,
        """
  - id: q1
    type: MULTIPLE_CHOICE
    prompt: Q?
    xp_reward: 20
    options:
      - text: Right
        correct: true
      - text: Wrong
        correct: false
""",
    )
    result = validate_lesson_file(f)
    assert any("unique 'id'" in e for e in result.errors)
    assert any("'correct' flags" in e for e in result.errors)


def test_match_pairs_need_ids_and_answer(tmp_path: Path) -> None:
    f = _lesson_with(
        tmp_path,
        """
  - id: q1
    type: MATCH_PAIRS
    prompt: Match
    xp_reward: 20
    pairs:
      - left: Face
        right: Drawing out
""",
    )
    assert any("pairs must be" in e for e in validate_lesson_file(f).errors)

    f = _lesson_with(
        tmp_path,
        """
  - id: q1
    type: MATCH_PAIRS
    prompt: Match
    xp_reward: 20
    pairs:
      - left: {id: l1, text: Face}
        right: {id: r1, text: Drawing out}
    correct_answer: ["l1=r1"]
""",
    )
    assert validate_lesson_file(f).is_valid


def test_multi_blank_needs_answer_list(tmp_path: Path) -> None:
    f = _lesson_with(
        tmp_path,
        """
  - id: q1
    type: FILL_BLANK
    prompt: Splint the joint ___ and the joint ___.
    xp_reward: 20
    correct_answer: above and below
""",
    )
    assert any("must be a list of 2" in e for e in validate_lesson_file(f).errors)


def test_path_without_nodes_rejected(tmp_path: Path) -> None:
    _write_lesson(tmp_path)
    (tmp_path / "skill-paths").mkdir()
    (tmp_path / "skill-paths" / "food.yaml").write_text(
        "id: food\ntitle: Food\ntrack: trades\nweeks:\n  - nodes:\n      - id: demo-lesson\n", encoding="utf-8"
    )
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - food\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert any("no nodes with lesson_ids" in e and "weeks" in e for e in result.errors)


def test_orphan_lesson_warns(tmp_path: Path) -> None:
    _write_lesson(tmp_path)
    _write_lesson(tmp_path, "lonely-lesson")
    _write_path(tmp_path, "automotive", "demo-lesson")
    (tmp_path / "featured.yaml").write_text("path_ids:\n  - automotive\n", encoding="utf-8")
    result = validate_catalogue(tmp_path)
    assert result.is_valid
    assert any("lonely-lesson" in w and "not used" in w for w in result.warnings)
