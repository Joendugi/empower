# ADR-003: Service Worker + IndexedDB Offline Strategy

| Field | Value |
|-------|-------|
| **ID** | ADR-003 |
| **Date** | 2026-09-20 |
| **Status** | **Accepted** |
| **Deciders** | CTO, Platform Lead, Frontend Lead |
| **Supersedes** | — |
| **Superseded By** | — |

---

## Context

CyberLearn's primary market includes learners in Kenya and other sub-Saharan African countries where mobile internet conditions present significant challenges:

- **Connectivity**: 2G and 3G are the dominant mobile data tiers outside major urban centres. Average mobile download speeds in Kenya are 15–20 Mbps on a good day but can drop to < 1 Mbps on 2G.
- **Device sharing**: Devices are frequently shared among family members. A learner may only have access to a phone for a 30–60 minute window before it is needed by someone else — making uninterrupted connectivity unreliable.
- **Data cost**: Mobile data is expensive relative to income. Repeatedly re-downloading the same lesson assets is a real cost barrier.
- **Usage patterns**: Learners often pre-load content during a WiFi window (school, library, workplace) and complete lessons while offline or on low-bandwidth connections.

A purely online-dependent PWA would result in unacceptable lesson interruptions and learner drop-off. The platform must function fully offline after a lesson is first loaded.

---

## Decision

We will implement a layered offline strategy using browser-native APIs:

### Layer 1 — Workbox Service Worker (Lesson Content Cache)

A Workbox-powered service worker intercepts all lesson content requests and applies a **CacheFirst** strategy with a 7-day TTL:

- On first load: fetch lesson JSON from the API, store in the Cache Storage API, serve the response.
- On subsequent loads (online or offline): serve from cache immediately; update cache in the background if online.
- Scope: lesson JSON payloads, course metadata, and static assets (images, fonts, JS bundles). Excludes real-time endpoints (auth tokens, leaderboards).

```
Request → Service Worker → Cache Storage (CacheFirst, 7 days)
                        ↘ Network (on cache miss or background refresh)
```

### Layer 2 — Zustand + localStorage (UI State Persistence)

The Zustand global store is configured with the `persist` middleware to serialise state to `localStorage`. This preserves:
- Current lesson position and completion status.
- Cached XP totals and streak counters.
- User preferences and settings.

State is restored synchronously on app start, so the UI renders the last-known state instantly even before any network request completes.

### Layer 3 — IndexedDB Submission Queue (Eventually-Consistent Progress)

When a learner completes a quiz, submits an answer, or earns XP while offline, the event is written to an **IndexedDB queue** rather than being dropped or blocking the UI:

```
User action → IndexedDB queue (immediate, offline-safe)
           ↘ (on reconnect) Background Sync API → POST /api/submissions
```

The Background Sync API (supported in Chrome/Edge/Android; gracefully polyfilled on Safari via an online event listener) flushes the queue to the FastAPI submission endpoint when connectivity is restored.

XP and progress updates received by the server from the queue are treated as **eventually consistent**: the server applies them idempotently using a `submitted_at` timestamp to handle duplicates and out-of-order delivery.

---

## Consequences

### Positive

- **Lessons work fully offline** after the first load. A learner who pre-loads 5 lessons on WiFi can complete all 5 on a 2G commute without any connectivity.
- **Zero data re-download** for cached lessons. The CacheFirst strategy eliminates repeat bandwidth cost for the most common read path.
- **Progress is never lost.** Submissions queued in IndexedDB are durable across app restarts and will eventually sync even after extended offline periods.
- **Perceived performance improvement** for all users (not just offline) because CacheFirst removes network round-trips on repeat visits.

### Negative / Trade-offs

- **XP and progress are eventually consistent.** A learner's displayed XP total may lag behind their actual earned XP by the duration of an offline session. Leaderboards will not update until sync completes. This trade-off is explicitly accepted; the alternative (blocking UI on network) is worse for the target market.
- **Cache invalidation complexity.** When course content is updated (lesson text corrected, quiz question changed), learners with stale cached content will continue to see the old version for up to 7 days unless the cache is actively invalidated. Mitigation: the API must include a `content_version` field in lesson JSON; the service worker will bust the cache when the version changes.
- **Safari/iOS limitations.** The Background Sync API is not supported on iOS Safari (as of 2026). The fallback — flushing the queue on the `online` DOM event — works but requires the PWA to be open in the foreground. The team must document this limitation clearly for learners on iOS.
- **Storage quotas.** Browser storage quotas vary (typically 50–80% of available disk on Chrome). The service worker should implement a storage quota check and warn learners before caching if space is low.
