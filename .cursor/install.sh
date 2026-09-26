#!/usr/bin/env bash
# Cloud Agent bootstrap for the Empower / CyberLearn monorepo.
# Idempotent: safe to re-run against cached state.
set -euo pipefail

cd /workspace

# --- System packages -------------------------------------------------------
# The default base image ships python3 but not the venv seed (ensurepip),
# which python3 -m venv needs.
if ! python3 -c "import ensurepip" >/dev/null 2>&1; then
  sudo apt-get update -qq
  sudo apt-get install -y -qq python3-venv
fi

# --- JavaScript workspace --------------------------------------------------
pnpm install --frozen-lockfile

# --- Python virtual environment (API + CMS tools) --------------------------
if [ ! -x /workspace/.venv/bin/python ]; then
  python3 -m venv /workspace/.venv
fi
/workspace/.venv/bin/pip install --upgrade pip
# greenlet backs SQLAlchemy's asyncio engine but is not pinned by the API deps.
/workspace/.venv/bin/pip install "greenlet>=3.0"
/workspace/.venv/bin/pip install -e "/workspace/apps/api[dev]"
/workspace/.venv/bin/pip install -e "/workspace/apps/cms-tools[dev]"

echo "Empower environment bootstrap complete."
