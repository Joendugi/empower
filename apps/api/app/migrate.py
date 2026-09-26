from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def run_alembic_upgrade() -> None:
    """Apply Alembic revisions in a child process so uvicorn's event loop is not nested."""
    api_root = Path(__file__).resolve().parents[1]
    completed = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        cwd=api_root,
        check=False,
    )
    if completed.returncode != 0:
        raise RuntimeError("Alembic upgrade failed — the API will not start")


def main() -> None:
    run_alembic_upgrade()


if __name__ == "__main__":
    main()
