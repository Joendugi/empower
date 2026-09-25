# CyberLearn Kenya

> Cloud-first cybersecurity & TVET learning platform — Duolingo-style interactive learning for the Kenyan and East African market. Target: ~5 million registered learners.

## Architecture Overview

```
apps/
├── pwa/        React 18 + Vite + Workbox  — Learner shell (gamification UI, offline-first)
├── api/        FastAPI + SQLAlchemy 2.0   — Auth, content, XP, streaks, FSRS, leaderboard
└── cms-tools/  Python CLI                 — YAML lesson validator

content/
├── lessons/     CC BY-SA 4.0 lesson YAML (answers stay on the server)
└── skill-paths/ Skill tree manifests

packages/
├── types/      Shared TypeScript type definitions
└── ui/         Shared React component library (Phase 1+)

infra/
├── terraform/  AWS infrastructure as code (EKS, RDS, ElastiCache, S3, CloudFront)
└── helm/       Kubernetes Helm charts for each service

docs/
├── architecture/decisions/   Architecture Decision Records (ADRs)
└── runbooks/                 Operational runbooks
```

Open edX (via **Tutor**) is the LMS system of record — deployed separately. This monorepo contains the custom learner experience layer and supporting services.

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20 |
| pnpm | ≥ 9 |
| Python | ≥ 3.12 |
| Docker + Docker Compose | Latest |
| Terraform | ≥ 1.8 |

## Getting Started (Local Dev)

```bash
# 1. Clone and install JS dependencies
git clone <repo>
cd cyberlearn
pnpm install

# 2. Set up API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your local values

# 3. Start backing services (Postgres, Redis)
docker compose up -d postgres redis

# 4. Run DB migrations
cd apps/api && alembic upgrade head && cd ../..

# 5. Start all apps in parallel
pnpm dev
```

Open:
- PWA: http://localhost:5173
- API docs: http://localhost:8000/docs
- API health: http://localhost:8000/health

## Apps

| App | Stack | Port | Description |
|---|---|---|---|
| `pwa` | React 18, Vite, Workbox, Tailwind | 5173 | Learner shell — gamification, lessons, offline, i18n |
| `api` | FastAPI, SQLAlchemy 2.0, Celery | 8000 | Auth, content, XP, FSRS, leaderboard |
| `cms-tools` | Python, Click | CLI | Lesson YAML validation |

## Packages

| Package | Description |
|---|---|
| `@cyberlearn/types` | Shared TypeScript interfaces (Learner, Lesson, Exercise, FSRSCard, etc.) |
| `@cyberlearn/ui` | Shared React component library |

## Licence

- `apps/api/`, `packages/` — MIT
- Any Open edX Tutor plugin code — AGPL v3 (see `/tutor-plugins/` when created)
- Lesson content (`content/`) — CC BY-SA 4.0

See [docs/architecture/decisions/ADR-001-platform-choice.md](docs/architecture/decisions/ADR-001-platform-choice.md) for full rationale.
