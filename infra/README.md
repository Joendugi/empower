# Infrastructure

CyberLearn runs on AWS in `af-south-1` (Cape Town), with CloudFront serving Kenya from its Nairobi edge.

```
learner ──HTTPS──► CloudFront (app hostname)
                     ├─ /*        → S3 web bucket     (the PWA, cached)
                     ├─ /media/*  → S3 media bucket   (cached)
                     └─ /api/*    → ALB → EKS pods    (never cached)
                                         ├─ api      FastAPI, 2–12 pods, autoscaled on CPU
                                         ├─ worker   Celery (AI grading, email)
                                         └─ beat     Celery scheduler, exactly one
                                       RDS Postgres 16 · ElastiCache Redis 7 · S3 uploads
```

| Path | What it is |
| --- | --- |
| `terraform/bootstrap/` | Run once per AWS account: state bucket, GitHub OIDC, ECR, image-build role |
| `terraform/` | One stack per environment: VPC, EKS, RDS, Redis, S3, ALB, CloudFront, DNS, secrets, IAM |
| `terraform/envs/` | Per-environment settings (`staging`, `production`) |
| `helm/cluster-config/` | App namespace and RBAC; installed by Terraform |
| `helm/cyberlearn/` | API, worker and scheduler; installed by the Deploy workflow |

## How the pieces trust each other

- **No long-lived AWS keys.** GitHub Actions signs in through OIDC. The build role works only from `main`. Each environment's deploy role works only from the GitHub environment with the same name, so production deploys go through that environment's required reviewers.
- **CI can touch only its namespace.** The deploy role is namespace admin on `cyberlearn`, not cluster admin.
- **The ALB can't be called directly.** It accepts only CloudFront's IP ranges. Its listener forwards only requests that carry the secret `X-Origin-Verify` header CloudFront adds, and the API checks the same header.
- **Secrets never touch git or CI.** Terraform generates the database password, Redis token, `SECRET_KEY`, `ADMIN_STAFF_KEY` and the origin secret into Secrets Manager. External Secrets Operator copies them into the cluster. Pods get AWS access through EKS Pod Identity, and the API role can only read and write the uploads bucket.
- **Several API pods are safe.** Discussions, library uploads and reading progress are stored in Postgres and S3, not in pod memory. Rate limits and leaderboards use Redis, which is required (`REQUIRE_REDIS`). Each pod migrates the database on startup under a Postgres advisory lock, and reloads Studio-published lessons every 30 seconds.

## First-time setup

You need the AWS CLI, Terraform ≥ 1.10 and a Route 53 public hosted zone for your domain (`cyberlearn.ke` in `envs/*.tfvars`; change it if yours differs).

**1. Bootstrap (once per account)**

```sh
cd infra/terraform/bootstrap
terraform init
terraform apply -var github_org=Joendugi -var github_repo=empower
```

Then set the `state_bucket` output as `bucket` in `envs/staging.backend.hcl` and `envs/production.backend.hcl`, and add the `build_role_arn` output as the repository secret `AWS_BUILD_ROLE_ARN` (Settings → Secrets and variables → Actions).

**2. An environment** (staging shown; production is the same with `production`)

```sh
cd infra/terraform
terraform init -backend-config=envs/staging.backend.hcl
terraform apply -var-file=envs/staging.tfvars
```

The first apply takes about 25 minutes, mostly EKS, RDS and CloudFront.

**3. GitHub environment.** Create the `staging` environment in Settings → Environments and add two secrets:

| Secret | Value |
| --- | --- |
| `AWS_DEPLOY_ROLE_ARN` | `terraform output -raw github_deploy_role_arn` |
| `VITE_ADMIN_STAFF_HASH` | `printf 'empower-staff-v1:%s' "$(terraform output -raw admin_staff_key)" \| sha256sum \| cut -d' ' -f1` |

For `production`, also add required reviewers so a person approves each release.

**4. Third-party keys.** Add only the keys you use:

```sh
aws secretsmanager put-secret-value --secret-id cyberlearn-staging/api/external \
  --secret-string '{"GEMINI_API_KEY":"...","SENTRY_DSN":"...","SMTP_HOST":"...","SMTP_USER":"...","SMTP_PASSWORD":"..."}'
```

Pods pick up changes within an hour, or straight away after `kubectl -n cyberlearn rollout restart deploy`.

**5. Deploy.** Push to `main`. Once CI passes, the Deploy workflow builds the image, upgrades the Helm release on staging, uploads the PWA and runs a smoke test, then does the same for production. You can also start it from the Actions tab.

## Day to day

```sh
aws eks update-kubeconfig --name cyberlearn-staging --region af-south-1
kubectl -n cyberlearn get pods
kubectl -n cyberlearn logs deploy/cyberlearn-api -f
helm -n cyberlearn history cyberlearn
helm -n cyberlearn rollback cyberlearn <revision>   # previous release, same database
```

Container logs and metrics are in CloudWatch → Container Insights. API errors go to Sentry once `SENTRY_DSN` is set.

## Rough monthly cost

On-demand prices in af-south-1 as of 2026; check the AWS pricing calculator before committing.

| | Staging | Production |
| --- | --- | --- |
| EKS control plane | $73 | $73 |
| Nodes | 2 × t3.large | 3–10 × m6i.large |
| NAT gateways | 1 | 3 |
| RDS | db.t4g.medium, single-AZ | db.m7g.large, Multi-AZ |
| Redis | 1 × cache.t4g.small | 2 × cache.m7g.large |

CloudFront and S3 depend on traffic. Most learner traffic is the cached app and media, so the API tier grows much more slowly than learner numbers.

## Not done yet

- **WAF** in front of CloudFront (managed rules plus a rate rule), before a public launch.
- **RDS Proxy.** Not needed while `pods × (DB_POOL_SIZE + DB_MAX_OVERFLOW)` stays under the instance's `max_connections`.
- **LTI registrations** are still held in memory. LTI is refused in production until launch tokens are signature-verified.
- **Restore drills.** Restore an RDS snapshot to a scratch instance every month and time how long it takes.
