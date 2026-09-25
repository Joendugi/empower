# Cloud hosting and local storage

Empower is dual-mode: the PWA keeps accounts, curriculum, progress, and practical recordings on the device, and can also talk to a hosted FastAPI + Postgres stack.

## What stays on the device

| Store | Key / DB | Contents |
|---|---|---|
| localStorage | `cyberlearn-learner` | Progress only (XP, lessons, profile). Access tokens are not stored here. |
| sessionStorage | `empower-session-token` | Access token for this browser tab only |
| localStorage | `empower-accounts` | Device accounts (email + password hash) |
| localStorage | `empower-curriculum` | Custom / edited lessons |
| localStorage | `empower-moderation` | Educator applications and proposals |
| localStorage | `empower-platform` | Offline / campus / cloud settings |
| IndexedDB | `cyberlearn` | Offline sync queue |
| IndexedDB | `empower-assets` | Video, audio, and photo evidence |

Sign-in always writes a device account. If the cloud API is down, the same email and password still open the classroom. Sign in again while the API is reachable to receive a cloud JWT and sync.

## Deployment modes (Admin → Architecture)

- **Offline** — catalogue and accounts stay in the browser. No API required.
- **Campus** — try the local/college API, then fall back to device storage.
- **Cloud** — same fallback, pointed at a public API URL.

Set these at build time with `VITE_DEPLOYMENT_MODE` and `VITE_API_URL`.

## Office access (admin only)

The public `/admin` URL is a 404. The office is unlisted: sign in, open `/office`, then type the staff passphrase in the unmarked field on the “page not available” screen. Nginx also returns 404 for `/admin`. There is no Admin link in the learner UI.

Set `ADMIN_STAFF_KEY` on the API (12+ characters). Bake only `VITE_ADMIN_STAFF_HASH` (SHA-256 of `empower-staff-v1:` + passphrase) into the PWA. Never ship the passphrase in `VITE_*`. After five failed tries the field locks for that tab. Sign-out clears the office session.

## Preferred server setup: nginx in front

Use nginx (already in `apps/pwa/Dockerfile`) as the public edge:

- TLS on 443 with Let’s Encrypt or a campus certificate; HTTP only redirects.
- Proxy `/api/` to FastAPI. Auth routes are rate-limited (`8r/m`).
- Security headers: nosniff, deny framing, CSP, no `server_tokens`.
- Do not log `Authorization` headers.
- HTML and `/office` use `Cache-Control: no-store` so tokens and office HTML are not cached.

```bash
export SECRET_KEY=$(openssl rand -hex 32)
export ADMIN_STAFF_KEY='a-long-office-passphrase'
export VITE_ADMIN_STAFF_HASH='64-char-sha256-hex'
export POSTGRES_PASSWORD='a-long-db-password'
docker compose -f docker-compose.prod.yml up --build
```

Open http://localhost:8080. The nginx PWA proxies `/api` to FastAPI.

### 1. One-box Docker (fastest)

Same compose file as above. For a public host, put another nginx or Caddy in front for HTTPS.

### 2. Split hosts (typical production)

- **PWA**: Cloudflare Pages, Netlify, Vercel, or any static host. Build `pnpm --filter @cyberlearn/pwa build` with `VITE_API_URL=https://api.your-domain.tld/api/v1` and `VITE_DEPLOYMENT_MODE=cloud`.
- **API**: Fly.io, Railway, Render, or a VPS running the `apps/api/Dockerfile`.
- **Postgres + Redis**: a **new** Empower Supabase project (never an existing marketplace/wallet database), Neon, or the compose Postgres. Redis can be set to `off` if you only need `/ready` against Postgres.
- **Media (optional)**: Cloudflare R2 / S3 / Cloudinary in `VITE_MEDIA_CDN_URL` and Admin → Media CDN. Workshop recordings still live in IndexedDB until you add an upload pipeline.

### 3. Kubernetes (already sketched)

`.github/workflows/deploy.yml` and `infra/helm/gamification-service` push the API to AWS EKS (`af-south-1`). Add a second image for `apps/pwa/Dockerfile` or serve `apps/pwa/dist` from CloudFront + S3.

### 4. Cheap single-node SQLite

For a campus lab without Postgres:

```
DATABASE_URL=sqlite+aiosqlite:///./empower.db
ENVIRONMENT=production
```

Tables are created automatically for SQLite. Set `REDIS_URL=off` if you are not running Redis.

### 5. New Supabase project (Empower only)

The Cursor Supabase MCP in this workspace is already bound to a different product. Do not apply Empower tables there.

1. Create a **new** project at [supabase.com/dashboard](https://supabase.com/dashboard/new) named `empower`.
2. Copy the database URI (Session pooler, port 6543) into `apps/api/.env` as `SUPABASE_DB_URL` or `DATABASE_URL`.
3. From this repo: `npx supabase link --project-ref YOUR_REF` then `npx supabase db push`.
4. Reconnect the Supabase MCP to the new `empower` project if you want agent SQL against it.

The SQL lives in `supabase/migrations/20260926010000_empower_core.sql`. Row Level Security is on and `anon` / `authenticated` have no table grants — only FastAPI (postgres / service role) can read learners.

## Local development

```bash
cp apps/api/.env.example apps/api/.env
cp apps/pwa/.env.example apps/pwa/.env.local
docker compose up -d postgres redis
pnpm dev
```

The Vite proxy sends `/api` to `http://localhost:8000`. If the API is not running, campus mode still registers and signs in from `localStorage`.
