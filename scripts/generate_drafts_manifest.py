#!/usr/bin/env python3
"""
Generate apps/pwa/public/drafts-manifest.json from content/drafts/*.yaml
"""
from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List
import yaml

ROOT = Path(__file__).resolve().parents[1]
DRAFTS_DIR = ROOT / "content" / "drafts"
OUT_FILE = ROOT / "apps" / "pwa" / "public" / "drafts-manifest.json"


def main():
    if not DRAFTS_DIR.exists():
        print(f"[!] Drafts directory not found: {DRAFTS_DIR}")
        return

    drafts: List[Dict[str, Any]] = []

    for path in sorted(DRAFTS_DIR.glob("*.yaml")):
        if path.parent.name == "rejected":
            continue
        try:
            data = yaml.safe_load(path.read_text(encoding="utf-8"))
            if not isinstance(data, dict):
                continue

            quality = data.get("quality_audit", {})
            draft_summary = {
                "id": data.get("id", path.stem),
                "title": data.get("title", path.stem),
                "titleSw": data.get("title_sw", ""),
                "course": data.get("course_id", ""),
                "track": data.get("track", "trades"),
                "cdacc": data.get("cdacc_unit_id", ""),
                "status": data.get("status", "staged_for_educator_approval"),
                "createdAt": data.get("created_at", ""),
                "quality": {
                    "interactiveness": quality.get("interactiveness", 0),
                    "detailAndSafety": quality.get("details", 0),
                    "easeOfUnderstanding": quality.get("ease_of_understanding", 0),
                    "multimedia": quality.get("multimedia", 0),
                    "overall": quality.get("overall_score", 0),
                },
            }
            drafts.append(draft_summary)
        except Exception as e:
            print(f"[-] Failed to parse {path.name}: {e}")

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    OUT_FILE.write_text(json.dumps(drafts, indent=2), encoding="utf-8")
    print(f"[OK] Wrote {len(drafts)} drafts to {OUT_FILE.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
