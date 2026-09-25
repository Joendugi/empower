# ADR-001: Use Headless Open edX + Custom React PWA

**Status:** Accepted
**Date:** September 2026
**Deciders:** CyberLearn Engineering Team

---

## Context

We need a learning management system to handle courses, competency units, grades, certificates, and enrolment for a cybersecurity and TVET platform targeting Kenya (5M registered users goal).

The team is proficient in Python and JavaScript/React. PHP is not a team skill. Key requirements:

- No PHP codebase to maintain
- Full control over gamification UI (Duolingo-style)
- Offline-first PWA for low-connectivity Kenya market
- CBET competency framework support for CDACC alignment
- Verifiable certificates (OpenBadges v3)
- Scalable to 500k MAU

Candidates evaluated: Moodle (PHP), Frappe LMS (Python/Vue), Open edX (Python/React), Kolibri (Python/Vue).

## Decision

Use **Open edX via Tutor** as the headless LMS system of record. Build a **React 18 + Workbox PWA** as the learner-facing gamification shell. Supplement with a **FastAPI Gamification Service** for XP, streaks, FSRS, and leaderboards.

## Rationale

| Factor | Rationale |
|---|---|
| **No PHP** | Open edX is Django/Python — aligns with team skills |
| **Gamification control** | PWA owns all gamification; zero dependency on LMS plugins |
| **Offline-first** | Workbox service worker gives full control; edX offline support is limited |
| **Scale** | edX.org has proven this stack at 10M+ users |
| **Upgrade path** | Tutor abstracts edX upgrades; our custom code is in plugins and separate services |
| **CBET / competencies** | Open edX has learning paths, badges (OpenBadges), and completion tracking |

## Licence Implication

Open edX is **AGPL v3**. Any modifications run as a network service must be open-sourced. All customizations are structured as **Tutor plugins** (separate repos), minimising what triggers this obligation. Legal counsel must confirm this strategy before public launch.

## Consequences

- Positive: No PHP; full gamification ownership; modern tech stack
- Positive: Tutor handles complex edX deployment (Docker/K8s)
- Negative: Two systems to maintain (edX + custom PWA)
- Negative: API contract between edX and PWA must be kept in sync
- Risk: AGPL obligations require legal review before launch
