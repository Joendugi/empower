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

## Cache

Default production cache is in-process MemoryCache (`REDIS_URL=off`). If you use Upstash, rotate the password in the Upstash console after any paste into chat, then replace `REDIS_URL` locally. Do not reuse a leaked token.

## Open edX

Not in the launch stack. See ADR-002.
