"""
FSRS-4.5 Spaced Repetition Scheduling Engine
=============================================

Implements a simplified version of the FSRS-4.5 algorithm by Jarrett Ye.
Full paper: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm

Ratings: 1=Again, 2=Hard, 3=Good, 4=Easy

NOTE: This is a simplified implementation suitable for MVP.
Replace with the full `fsrs` PyPI package when it stabilises.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from datetime import date, timedelta


@dataclass
class CardUpdate:
    stability: float
    difficulty: float
    due_date: date
    reps: int
    lapses: int
    state: str


def _clamp(value: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, value))


def _retrievability(stability: float, days_elapsed: float) -> float:
    """
    Compute memory retrievability R at time t given stability S.
    R = exp(ln(0.9) * t / S)
    At t=S, R=0.9 (90% chance of recall at stability days).
    """
    if stability <= 0:
        return 0.0
    return math.exp(math.log(0.9) * days_elapsed / stability)


def next_interval(
    stability: float,
    difficulty: float,
    reps: int,
    lapses: int,
    state: str,
    due_date: date,
    last_review: date | None,
    rating: int,  # 1=Again, 2=Hard, 3=Good, 4=Easy
    today: date | None = None,
) -> CardUpdate:
    """
    Compute the next FSRS card state after a review.

    Returns a CardUpdate with new stability, difficulty, due_date, etc.
    """
    if today is None:
        today = date.today()

    days_elapsed = (today - last_review).days if last_review else 0
    r = _retrievability(stability, days_elapsed)

    # ── Update difficulty ─────────────────────────────────────────────
    # Difficulty increases on Again/Hard, decreases on Easy
    # Rating 3 (Good) is neutral
    new_difficulty = _clamp(
        difficulty + (0.1 - (rating - 3) * 0.08),
        lo=0.1,
        hi=1.0,
    )

    # ── Update stability ──────────────────────────────────────────────
    match rating:
        case 1:  # Again — forgot; reset stability
            new_stability = max(
                0.2,
                0.2 * new_difficulty * max(1, lapses + 1) ** -0.5 * (math.exp(0.1) - 1),
            )
            new_lapses = lapses + 1
            new_state = "Relearning"
        case 2:  # Hard — recalled with difficulty
            new_stability = stability * 1.2
            new_lapses = lapses
            new_state = "Review"
        case 3:  # Good — recalled normally
            new_stability = stability * (1.0 + 2.0 * (1.0 - r))
            new_lapses = lapses
            new_state = "Review"
        case 4:  # Easy — recalled effortlessly
            new_stability = stability * (1.0 + 4.0 * (1.0 - r))
            new_lapses = lapses
            new_state = "Review"
        case _:
            raise ValueError(f"Invalid FSRS rating: {rating}. Must be 1–4.")

    # First review — initialise stability based on rating
    if reps == 0:
        initial = {1: 0.5, 2: 1.0, 3: 3.0, 4: 7.0}
        new_stability = initial.get(rating, 1.0)

    # ── Compute next due date ─────────────────────────────────────────
    interval_days = max(1, round(new_stability))
    next_due = today + timedelta(days=interval_days)

    return CardUpdate(
        stability=round(new_stability, 4),
        difficulty=round(new_difficulty, 4),
        due_date=next_due,
        reps=reps + 1,
        lapses=new_lapses,
        state=new_state,
    )
