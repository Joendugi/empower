# Database Backup and Restore

> **Runbook ID:** RB-002  
> **Owner:** Platform Team / SRE  
> **Last Updated:** 2026-09-20  
> **Criticality:** P0 — Follow this runbook exactly during a database incident.

---

## Automated Backups (RDS)

CyberLearn's production database runs on Amazon RDS for PostgreSQL. AWS manages automated backups transparently.

| Setting | Value |
|---------|-------|
| Backup retention period | **7 days** |
| Backup window | 02:00–03:00 UTC (low-traffic for af-south-1 audience) |
| Recovery type | Point-in-Time Recovery (PITR) to any second within the retention window |
| Encryption | AES-256 (AWS KMS managed key) |
| Multi-AZ | Enabled in production (synchronous standby in second AZ) |

> **No action required** for the automated backup to run — it is enabled by default on all RDS instances created by Terraform with `backup_retention_period = 7`.

---

## Manual Backup (pg_dump → S3)

Use this for one-off snapshots before a risky migration or data transformation.

### 1. Capture a dump from the RDS instance

```bash
# Set connection variables (or load from .env / AWS Secrets Manager)
export PGHOST="<rds-endpoint>"
export PGPORT="5432"
export PGUSER="cyberlearn"
export PGPASSWORD="$(aws secretsmanager get-secret-value \
  --secret-id cyberlearn/production/db-password \
  --query SecretString --output text)"

# Create a compressed custom-format dump
pg_dump \
  --format=custom \
  --compress=9 \
  --no-acl \
  --no-owner \
  --dbname=cyberlearn \
  --file=/tmp/cyberlearn_$(date +%Y%m%d_%H%M%S).dump
```

### 2. Upload the dump to S3

```bash
DUMP_FILE=$(ls -t /tmp/cyberlearn_*.dump | head -1)
BUCKET="cyberlearn-production-backups"

aws s3 cp "$DUMP_FILE" \
  "s3://${BUCKET}/manual-dumps/$(basename $DUMP_FILE)" \
  --sse AES256

echo "Backup uploaded: s3://${BUCKET}/manual-dumps/$(basename $DUMP_FILE)"
```

### 3. Verify the dump is readable

```bash
pg_restore --list "$DUMP_FILE" | head -20
```

---

## Restore Procedure

### Option A — RDS Point-in-Time Restore (preferred)

Use this when you need to recover from data corruption or accidental deletion.

1. **Identify the target time** — determine the last known-good timestamp (check application logs, audit trail, or ask the incident reporter).

2. **Initiate restore via AWS Console or CLI:**

```bash
aws rds restore-db-instance-to-point-in-time \
  --source-db-instance-identifier cyberlearn-production-db \
  --target-db-instance-identifier cyberlearn-production-db-restored \
  --restore-time "2026-09-20T01:30:00Z" \
  --region af-south-1
```

3. **Wait for the new instance to be `available`** (typically 15–30 minutes):

```bash
aws rds wait db-instance-available \
  --db-instance-identifier cyberlearn-production-db-restored
```

4. **Verify data integrity** on the restored instance before promoting:

```bash
psql -h <restored-endpoint> -U cyberlearn -c "SELECT COUNT(*) FROM users;"
psql -h <restored-endpoint> -U cyberlearn -c "SELECT MAX(created_at) FROM course_enrollments;"
```

5. **Promote** — update the `DATABASE_URL` secret in AWS Secrets Manager and/or the Kubernetes Secret to point to the restored instance, then perform a rolling restart of the application pods:

```bash
kubectl rollout restart deployment/gamification-service --namespace production
```

6. **Rename** — after confirming the application is healthy, delete or snapshot the old instance and rename the restored instance to the canonical name via the AWS Console.

### Option B — Manual Restore from pg_dump

```bash
DUMP_FILE="cyberlearn_20260920_013000.dump"
TARGET_DB="cyberlearn_restored"

# Download from S3
aws s3 cp \
  "s3://cyberlearn-production-backups/manual-dumps/${DUMP_FILE}" \
  /tmp/

# Create target database
psql -h <host> -U cyberlearn -c "CREATE DATABASE ${TARGET_DB};"

# Restore
pg_restore \
  --host=<host> \
  --port=5432 \
  --username=cyberlearn \
  --dbname="${TARGET_DB}" \
  --no-owner \
  --no-acl \
  --jobs=4 \
  /tmp/${DUMP_FILE}
```

---

## Disaster Recovery Targets

| Metric | Target | Notes |
|--------|--------|-------|
| **RTO** (Recovery Time Objective) | **< 4 hours** | Time from incident declaration to service restoration |
| **RPO** (Recovery Point Objective) | **< 1 hour** | Maximum acceptable data loss |

The 7-day PITR window and Multi-AZ standby together satisfy these targets for most failure scenarios. For a complete AZ failure, the Multi-AZ standby promotes automatically (typically < 60 seconds).

---

## Restore Testing Schedule

Untested backups are not backups. Run a restore drill on the following schedule:

| Frequency | Scope | Owner | Log Location |
|-----------|-------|-------|-------------|
| **Monthly** | Full PITR restore to isolated test instance; verify row counts and run smoke tests | On-call SRE | `s3://cyberlearn-production-backups/drill-reports/` |
| **Quarterly** | Full DR simulation — restore + re-point application + end-to-end test | Platform Lead | Same as above |

After each drill, update the `Last Tested` date in the team's DR register and file any issues as GitHub issues tagged `dr-drill`.
