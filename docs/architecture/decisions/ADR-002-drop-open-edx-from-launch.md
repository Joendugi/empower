# ADR-002: Drop Open edX from the launch story

**Status:** Accepted  
**Date:** September 2026  
**Supersedes:** [ADR-001](ADR-001-platform-choice.md)

---

## Decision

Launch Empower as **React PWA + FastAPI + Postgres**. Do not deploy Open edX / Tutor for the first public release.

Open edX remains an optional future integration behind `EDX_API_KEY`. With that key empty, `EdxClient` no-ops and is not part of the production architecture.

## Why this, not an AGPL review now

ADR-001 named Open edX as the LMS of record. That would trigger an AGPL v3 legal review before public launch. The live product already stores enrolment, progress, XP, certificates-in-progress, and curriculum in the PWA and FastAPI. Shipping a second LMS we do not run would add operations and licence work without changing what learners see.

Dropping edX from the launch story removes the AGPL obligation for this release. If we later vendor or modify Open edX as a network service, counsel must review AGPL before that work starts.

## Consequences

- Positive: one stack to host, no Tutor, no AGPL on the launch binary
- Positive: honest architecture docs match the running code
- Negative: we do not inherit edX course import, discussion, or certificate engines
- Follow-up: certificates stay on the FastAPI / Open Badges path already in this repo
