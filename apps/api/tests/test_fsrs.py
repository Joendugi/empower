"""
Tests for the FSRS spaced repetition engine.
These are pure unit tests — no database or network required.
"""

from __future__ import annotations

from datetime import date, timedelta

from app.services.fsrs import next_interval


def test_good_rating_increases_stability() -> None:
    """Rating=3 (Good) on a card reviewed today should increase stability."""
    today = date.today()
    update = next_interval(
        stability=3.0,
        difficulty=0.3,
        reps=2,
        lapses=0,
        state="Review",
        due_date=today,
        last_review=today - timedelta(days=3),
        rating=3,
    )
    assert update.stability > 3.0, "Good rating should increase stability"


def test_again_rating_increments_lapses() -> None:
    """Rating=1 (Again) should increment lapses and reset to Relearning."""
    today = date.today()
    update = next_interval(
        stability=5.0,
        difficulty=0.3,
        reps=3,
        lapses=0,
        state="Review",
        due_date=today,
        last_review=today - timedelta(days=5),
        rating=1,
    )
    assert update.lapses == 1
    assert update.state == "Relearning"
    assert update.stability < 5.0, "Again should reduce stability"


def test_next_due_date_at_least_one_day() -> None:
    """Next due date must always be at least 1 day in the future."""
    today = date.today()
    for rating in [1, 2, 3, 4]:
        update = next_interval(
            stability=1.0,
            difficulty=0.5,
            reps=1,
            lapses=0,
            state="Review",
            due_date=today,
            last_review=today - timedelta(days=1),
            rating=rating,
        )
        assert update.due_date >= today + timedelta(days=1), (
            f"Rating={rating} produced due_date in the past or today"
        )


def test_difficulty_stays_in_bounds() -> None:
    """Difficulty must always stay in [0.1, 1.0] regardless of rating."""
    today = date.today()
    # Start at extremes and apply extreme ratings
    for start_diff, rating in [(0.1, 1), (1.0, 4), (0.5, 1), (0.5, 4)]:
        update = next_interval(
            stability=2.0,
            difficulty=start_diff,
            reps=5,
            lapses=0,
            state="Review",
            due_date=today,
            last_review=today - timedelta(days=2),
            rating=rating,
        )
        assert 0.1 <= update.difficulty <= 1.0, (
            f"Difficulty {update.difficulty} out of bounds for start={start_diff}, rating={rating}"
        )


def test_easy_rating_gives_longer_interval_than_good() -> None:
    """Easy (4) should always schedule further out than Good (3) given same card."""
    today = date.today()
    last = today - timedelta(days=5)
    good = next_interval(3.0, 0.3, 3, 0, "Review", today, last, 3)
    easy = next_interval(3.0, 0.3, 3, 0, "Review", today, last, 4)
    assert easy.due_date >= good.due_date, "Easy should have equal or longer interval than Good"


def test_first_review_initialises_stability() -> None:
    """First review (reps=0) should set stability from the rating table."""
    today = date.today()
    update = next_interval(
        stability=1.0,
        difficulty=0.3,
        reps=0,
        lapses=0,
        state="New",
        due_date=today,
        last_review=None,
        rating=4,  # Easy first review
    )
    # Easy first review should give ~7 days
    assert update.stability == 7.0
    assert update.reps == 1
