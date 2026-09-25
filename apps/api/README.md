# CyberLearn Gamification Service

A FastAPI micro-service that powers the gamification layer of the CyberLearn platform.

## Features

- **XP & Levelling** — award experience points and compute learner levels.
- **Streaks** — track daily learning streaks with freeze-token support.
- **Badges** — award and query Open Badges-compatible badge records.
- **FSRS Spaced Repetition** — FSRS-4.5 algorithm drives personalised review scheduling.
- **Leaderboards** — real-time global and cohort leaderboards backed by Redis sorted sets.

## Tech Stack

| Layer | Technology |
|---|---|
| API | FastAPI 0.111+ |
| DB ORM | SQLAlchemy 2.0 (async, asyncpg) |
| Cache / Pub-Sub | Redis 7 |
| Task queue | Celery 5.4 + Redis broker |
| Migrations | Alembic |

## Local Setup

```bash
# 1. Create virtual environment
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

# 2. Install package in editable mode (including dev extras)
pip install -e .[dev]

# 3. Copy environment file and fill in values
cp .env.example .env

# 4. Run database migrations
alembic upgrade head

# 5. Start the development server
uvicorn app.main:app --reload
```

## Running Tests

```bash
pytest --cov=app --cov-report=term-missing
```

## Running the Celery Worker

```bash
celery -A app.workers.celery_app worker --loglevel=info
```

## Running Celery Beat (scheduled tasks)

```bash
celery -A app.workers.celery_app beat --loglevel=info
```

## API Documentation

Once the server is running, interactive docs are available at:

- Swagger UI: http://localhost:8000/docs
- ReDoc:       http://localhost:8000/redoc

## Environment Variables

See `.env.example` for all required variables.
