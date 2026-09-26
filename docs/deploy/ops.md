# Production ops

## Secrets (gitignored)

`scripts/write_prod_secrets.py` writes real values into `apps/api/.env`, `apps/pwa/.env.local`, and `.env.production`. Never commit those files.

Bake only `VITE_ADMIN_STAFF_HASH` into the PWA. The office passphrase stays in `ADMIN_STAFF_KEY`.

## Hostname and TLS

Set `PUBLIC_HOST` (default `empower.local`). Put `fullchain.pem` and `privkey.pem` in `./certs`.

- Local smoke: self-signed certs from `scripts/make_tls_certs.ps1` plus a hosts file row `127.0.0.1 empower.local`.
- Public traffic: replace those files with Let’s Encrypt (or campus) material for the real DNS name and keep `CORS_ORIGINS` on `https://<PUBLIC_HOST>`.

## Postgres backups

```
pwsh -File scripts/backup_postgres.ps1
```

Writes timestamped `pg_dump` files under `backups/` (gitignored). Point `SUPABASE_DB_URL` or `DATABASE_URL` at the Empower database only.

## Uptime and errors

- `GET /ready` and `GET /api/v1/ops/status` for probes.
- Browser errors POST to `/api/v1/ops/errors`.
- `python scripts/uptime_ping.py --url https://empower.local/ready`

## Timeouts and rate limits

Edge (nginx) and API both enforce budgets:

| Layer | Auth | General API | Timeout |
| --- | --- | --- | --- |
| nginx | `8r/m` (+burst 5) | `60r/m` (+burst 40) | proxy connect 5s; auth read 20s; api read 30s |
| API | `RATE_LIMIT_AUTH_PER_MINUTE` (default 20) | `RATE_LIMIT_PER_MINUTE` (120) + write bucket (60) | `REQUEST_TIMEOUT_SECONDS` (25) → 504 |

`/health` and `/ready` skip API limits. Failed logins still use the separate auth-failure lockout (8 tries / 15 min). Set any rate env to `0` to disable that bucket. PWA `requestTimeoutMs` should stay ≤ the API timeout (office clamps 2–25s).

## Cache

Default production cache is in-process MemoryCache (`REDIS_URL=off`). If you use Upstash, rotate the password in the Upstash console after any paste into chat, then replace `REDIS_URL` locally. Do not reuse a leaked token.

## Supabase TLS on Windows

If Python fails the pooler handshake with `CERTIFICATE_VERIFY_FAILED`, install/update `certifi` and ensure `apps/api` uses it (already wired in `database.py`). As a **local-only** escape hatch set `SUPABASE_SSL_INSECURE=true` in `apps/api/.env` — never enable that in production.

## Open edX

Not in the launch stack. See ADR-002.
