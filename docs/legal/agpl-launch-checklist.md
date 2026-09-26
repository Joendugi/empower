# AGPL launch checklist

**Launch stance:** Open edX is **not** part of the first public release. See [ADR-002](../architecture/decisions/ADR-002-drop-open-edx-from-launch.md). The shipping stack is the MIT-licensed PWA + FastAPI monorepo, so AGPL does not apply to that binary.

If you later run a modified Open edX / Tutor deployment as a network service:

- Inventory every Open edX modification and Tutor plugin.
- Confirm network-use copyleft obligations for those modifications.
- Publish source for AGPL-covered components or obtain a commercial licence.
- Keep the PWA and FastAPI service free of copied AGPL code.
- Record counsel’s written decision with company legal before that work goes live.
