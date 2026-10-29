#!/usr/bin/env python3
"""
Curriculum Reviewer & Educator Approval CLI.
Enables course authors to inspect AI-generated lesson drafts, audit pedagogical quality parameters,
and verify & approve lessons into production.
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any, Dict

import yaml

ROOT = Path(__file__).resolve().parents[1]
DRAFTS_DIR = ROOT / "content" / "drafts"
LESSONS_DIR = ROOT / "content" / "lessons"
ARCHIVE_DIR = ROOT / "content" / "drafts" / "rejected"
DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
ARCHIVE_DIR.mkdir(parents=True, exist_ok=True)


def list_drafts():
    draft_files = sorted(DRAFTS_DIR.glob("*.yaml"))
    if not draft_files:
        print("\n[Educator Review] No pending drafts found in content/drafts/.")
        print("Run `python scripts/ai_lesson_researcher.py` to research and stage new candidate lessons.\n")
        return

    print(f"\n{'='*80}")
    print(f" PENDING AI CURRICULUM DRAFTS ({len(draft_files)} awaiting author approval)")
    print(f"{'='*80}")
    print(f"{'ID':<36} | {'COURSE':<18} | {'I':>3} {'D':>3} {'E':>3} {'M':>3} | {'SCORE':>5}")
    print(f"{'-'*36}-+-{'-'*18}-+-{'-'*15}-+-{'-'*6}")

    for file in draft_files:
        try:
            data = yaml.safe_load(file.read_text(encoding="utf-8")) or {}
        except Exception:
            continue
        lid = data.get("id", file.stem)
        course = data.get("course_id", "general")
        audit = data.get("quality_audit") or {}
        i = audit.get("interactiveness", "-")
        d = audit.get("details", "-")
        e = audit.get("ease_of_understanding", "-")
        m = audit.get("multimedia", "-")
        overall = audit.get("overall_score", "-")
        print(f"{lid:<36} | {course:<18} | {str(i):>3} {str(d):>3} {str(e):>3} {str(m):>3} | {str(overall):>4}%")
    print(f"{'='*80}")
    print("Legend: [I]nteractiveness | [D]etails & Safety | [E]ase & Readability | [M]ultimedia")
    print("To inspect: python scripts/curriculum_reviewer.py inspect <id>")
    print("To approve: python scripts/curriculum_reviewer.py approve <id>\n")


def inspect_draft(draft_id: str):
    file_path = DRAFTS_DIR / f"{draft_id}.yaml"
    if not file_path.exists():
        # Try finding by partial ID
        matches = list(DRAFTS_DIR.glob(f"*{draft_id}*.yaml"))
        if matches:
            file_path = matches[0]
        else:
            print(f"Draft not found: {draft_id}")
            return

    data = yaml.safe_load(file_path.read_text(encoding="utf-8")) or {}
    audit = data.get("quality_audit") or {}

    print(f"\n{'='*75}")
    print(f" LESSON DRAFT: {data.get('title')}")
    print(f" Swahili Title: {data.get('title_sw')}")
    print(f" ID: {data.get('id')}  |  Course: {data.get('course_id')}  |  CDACC: {data.get('cdacc_unit_id')}")
    print(f"{'='*75}")

    print("\n[1] PEDAGOGICAL AUDIT PARAMETERS:")
    print(f"  * Interactiveness:          {audit.get('interactiveness', 'N/A')}/100")
    print(f"  * Detail & Technical Rigor: {audit.get('details', 'N/A')}/100")
    print(f"  * Ease of Understanding:    {audit.get('ease_of_understanding', 'N/A')}/100")
    print(f"  * Illustrations & Media:    {audit.get('multimedia', 'N/A')}/100")
    print(f"  [*] Overall Pedagogical Score: {audit.get('overall_score', 'N/A')}/100")

    print("\n[2] STUDY BRIEFING (English):")
    print(f"  {data.get('briefing')}")

    print("\n[3] SWAHILI BRIEFING:")
    print(f"  {data.get('briefing_sw')}")

    media = data.get("media") or []
    if media:
        print("\n[4] MULTIMEDIA & ILLUSTRATIONS:")
        for idx, m in enumerate(media, 1):
            print(f"  {idx}. Kind: {m.get('kind')} | Preset: {m.get('preset')} | URL: {m.get('url')}")
            print(f"     Caption: {m.get('caption')}")

    exercises = data.get("exercises") or []
    print(f"\n[5] INTERACTIVE EXERCISES ({len(exercises)}):")
    for idx, ex in enumerate(exercises, 1):
        print(f"  {idx}. [{ex.get('type')}] {ex.get('prompt')}")
        if ex.get("options"):
            for opt in ex.get("options"):
                marker = "*" if opt.get("id") == ex.get("correct_answer") else " "
                print(f"      [{opt.get('id')}]{marker} {opt.get('text')}")
        if ex.get("correct_answer"):
            print(f"     Correct: {ex.get('correct_answer')}")
        if ex.get("explanation"):
            print(f"     Explanation: {ex.get('explanation')}")

    print(f"\n{'='*75}")
    print(f"Author Action:")
    print(f"  Approve into production: python scripts/curriculum_reviewer.py approve {data.get('id')}")
    print(f"  Reject & archive:       python scripts/curriculum_reviewer.py reject {data.get('id')}\n")


def approve_draft(draft_id: str):
    file_path = DRAFTS_DIR / f"{draft_id}.yaml"
    if not file_path.exists():
        matches = list(DRAFTS_DIR.glob(f"*{draft_id}*.yaml"))
        if matches:
            file_path = matches[0]
        else:
            print(f"Error: Draft '{draft_id}' not found.")
            return

    data = yaml.safe_load(file_path.read_text(encoding="utf-8")) or {}
    clean_id = data.get("id", file_path.stem)
    target_path = LESSONS_DIR / f"{clean_id}.yaml"

    # Remove temporary staging keys before promoting to production
    data.pop("quality_audit", None)
    data.pop("status", None)

    # Write to content/lessons/
    target_path.write_text(yaml.dump(data, sort_keys=False, allow_unicode=True), encoding="utf-8")
    file_path.unlink()  # Remove from drafts

    print(f"\n[APPROVED] Promoted '{clean_id}' to {target_path.relative_to(ROOT)}")

    # Re-run catalogue generator
    print("Regenerating production catalogue...")
    subprocess.run([sys.executable, str(ROOT / "scripts" / "generate_catalogue.py")], check=True)
    print(f"[SUCCESS] '{clean_id}' is now live in production catalogue!\n")


def reject_draft(draft_id: str):
    file_path = DRAFTS_DIR / f"{draft_id}.yaml"
    if not file_path.exists():
        matches = list(DRAFTS_DIR.glob(f"*{draft_id}*.yaml"))
        if matches:
            file_path = matches[0]
        else:
            print(f"Error: Draft '{draft_id}' not found.")
            return

    target = ARCHIVE_DIR / file_path.name
    shutil.move(file_path, target)
    print(f"\n[REJECTED] Moved '{draft_id}' to archive ({target.relative_to(ROOT)}).\n")


def main():
    parser = argparse.ArgumentParser(description="Curriculum Reviewer & Approval Workflow")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("list", help="List all staged AI drafts with quality metrics")

    inspect_p = subparsers.add_parser("inspect", help="Inspect detailed draft contents and pedagogical audit")
    inspect_p.add_argument("id", type=str, help="Draft ID or partial ID")

    approve_p = subparsers.add_parser("approve", help="Approve draft and publish to production catalogue")
    approve_p.add_argument("id", type=str, help="Draft ID or partial ID")

    reject_p = subparsers.add_parser("reject", help="Reject draft and move to archive")
    reject_p.add_argument("id", type=str, help="Draft ID or partial ID")

    args = parser.parse_args()

    if args.command == "list" or not args.command:
        list_drafts()
    elif args.command == "inspect":
        inspect_draft(args.id)
    elif args.command == "approve":
        approve_draft(args.id)
    elif args.command == "reject":
        reject_draft(args.id)


if __name__ == "__main__":
    main()
