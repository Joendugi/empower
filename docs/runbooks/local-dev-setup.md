# Runbook: Local Development Setup

**Last updated:** September 2026
**Owner:** Engineering Team

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Docker Desktop | Latest | https://docker.com |
| pnpm | ≥ 9 | `npm install -g pnpm@9` |
| Node.js | ≥ 20 | https://nodejs.org |
| Python | ≥ 3.12 | https://python.org |
| Git | Latest | https://git-scm.com |

## First-Time Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-org/cyberlearn.git
cd cyberlearn

# 2. Install JavaScript dependencies (all workspaces)
pnpm install

# 3. Set up API environment
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — the defaults work for local Docker setup

# 4. Start PostgreSQL and Redis
docker compose up -d postgres redis

# 5. Wait for services to be healthy
docker compose ps   # all should show "healthy"

# 6. Run database migrations
docker compose run --rm api alembic upgrade head

# 7. Start all development servers
pnpm dev
# OR start individually:
#   docker compose up api celery-worker celery-beat
#   pnpm --filter @cyberlearn/pwa dev
```

## Verify Everything Is Working

```bash
# API health check
curl http://localhost:8000/health
# Expected: {"status":"ok","version":"0.1.0","environment":"development"}

# API docs (interactive Swagger UI)
open http://localhost:8000/docs

# PWA
open http://localhost:5173

# Database (via psql)
docker compose exec postgres psql -U cyberlearn -d cyberlearn
```

## Common Issues

### Port already in use

```bash
# Find what's using port 5432
netstat -ano | findstr :5432    # Windows
lsof -i :5432                   # macOS/Linux

# Change port in docker-compose.yml: "5433:5432"
# And update DATABASE_URL in apps/api/.env accordingly
```

### Docker out of memory

Docker Desktop default is 2 GB RAM. Increase to 4 GB:
Settings → Resources → Memory → 4096 MB

### Python import errors

```bash
cd apps/api
python -m pip install -e ".[dev]"
```

### pnpm workspace resolution errors

```bash
pnpm install --force
```

## Stopping

```bash
# Stop all Docker services
docker compose down

# Stop all Docker services AND delete data volumes (clean slate)
docker compose down -v
```

## Running Tests

```bash
# Python tests (unit only — no Docker needed)
cd apps/api && pytest tests/ -v

# JavaScript tests
pnpm --filter @cyberlearn/pwa test

# All tests
pnpm test
```
