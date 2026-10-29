#!/usr/bin/env python3
"""
AI Lesson Researcher (Option B: Google Gemini Free Tier).
Researches technical and vocational curriculum topics, drafts structured lesson manifests,
and computes pedagogical quality parameters (Interactiveness, Details, Readability, Multimedia).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Optional

import yaml

ROOT = Path(__file__).resolve().parents[1]
DRAFTS_DIR = ROOT / "content" / "drafts"
LESSONS_DIR = ROOT / "content" / "lessons"
PATHS_DIR = ROOT / "content" / "skill-paths"
DRAFTS_DIR.mkdir(parents=True, exist_ok=True)


def load_env_key() -> Optional[str]:
    """Retrieve GEMINI_API_KEY from environment or .env files."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key.strip()

    for env_path in [ROOT / ".env", ROOT / "apps" / "api" / ".env"]:
        if env_path.exists():
            for line in env_path.read_text(encoding="utf-8").splitlines():
                line = line.strip()
                if line.startswith("GEMINI_API_KEY=") and not line.startswith("#"):
                    val = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    return None


def calculate_pedagogical_metrics(lesson: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compute objective 0-100 scores across 4 key dimensions:
      1. Interactiveness
      2. Technical Detail & Rigor
      3. Ease of Understanding / Readability
      4. Illustrations & Multimedia
    """
    briefing = lesson.get("briefing") or ""
    exercises = lesson.get("exercises") or []
    media = lesson.get("media") or []
    words = briefing.split()
    word_count = len(words)

    # 1. Interactiveness (0-100)
    # Target: 3-5 exercises with diverse types
    exercise_count = len(exercises)
    types_found = set(e.get("type", "MULTIPLE_CHOICE") for e in exercises)
    type_diversity = len(types_found)

    # Formula: count score (up to 60) + diversity score (up to 40)
    interactiveness = min(100, int((exercise_count / 4.0) * 60 + (type_diversity / 2.0) * 40))

    # 2. Details & Technical Rigor (0-100)
    details = 0
    # Length & substance
    if word_count >= 140:
        details += 35
    elif word_count >= 80:
        details += 20
    # Safety & workshop compliance keywords
    safety_keywords = ["safety", "ppe", "hazard", "isolate", "goggles", "gloves", "earth", "ventilat", "wps", "inspection"]
    safety_hits = sum(1 for kw in safety_keywords if kw in briefing.lower())
    details += min(35, safety_hits * 12)
    # CDACC occupational mapping
    if lesson.get("cdacc_unit_id"):
        details += 30

    # 3. Ease of Understanding / Readability (0-100)
    sentences = [s.strip() for s in re.split(r"[.!?]+", briefing) if s.strip()]
    sentence_count = max(1, len(sentences))
    avg_sentence_len = word_count / sentence_count

    # Plain technical English target: 12-18 words/sentence
    if 10 <= avg_sentence_len <= 18:
        readability = 70
    elif avg_sentence_len < 10:
        readability = 60
    else:
        readability = max(30, int(70 - (avg_sentence_len - 18) * 3))

    # Bilingual accessibility bonus
    if lesson.get("title_sw") and lesson.get("briefing_sw"):
        readability += 30
    ease_of_understanding = min(100, readability)

    # 4. Illustrations & Multimedia (0-100)
    multimedia = 0
    has_video = False
    has_animation = False
    for item in media:
        kind = item.get("kind")
        url = item.get("url") or ""
        preset = item.get("preset") or ""
        if kind == "video" and ("youtube.com" in url or "youtu.be" in url or url.startswith("http")):
            multimedia += 55
            has_video = True
        elif kind == "animation" or preset:
            multimedia += 45
            has_animation = True
    multimedia = min(100, multimedia)

    # Composite overall score
    overall = int(0.30 * interactiveness + 0.30 * details + 0.20 * ease_of_understanding + 0.20 * multimedia)

    return {
        "interactiveness": interactiveness,
        "details": details,
        "ease_of_understanding": ease_of_understanding,
        "multimedia": multimedia,
        "overall_score": overall,
        "metrics": {
            "exercise_count": exercise_count,
            "exercise_types": sorted(list(types_found)),
            "word_count": word_count,
            "avg_sentence_words": round(avg_sentence_len, 1),
            "has_swahili_translation": bool(lesson.get("title_sw") and lesson.get("briefing_sw")),
            "has_video": has_video,
            "has_animation": has_animation,
            "cdacc_aligned": bool(lesson.get("cdacc_unit_id")),
        },
    }


def call_gemini_api(api_key: str, prompt: str) -> str:
    """Call Google Gemini 2.5 Flash API endpoint."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.2,
            "topP": 0.8,
            "maxOutputTokens": 16384,
            "responseMimeType": "application/json",
        },
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=90) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        candidates = res.get("candidates") or []
        if not candidates:
            raise ValueError("No candidates returned from Gemini API")
        parts = candidates[0].get("content", {}).get("parts", [])
        return "".join(p.get("text", "") for p in parts)


def generate_mock_lesson(topic: str, track: str, course_id: str, cdacc_code: str) -> Dict[str, Any]:
    """Fallback generator for offline testing or prior to API key configuration."""
    clean_id = re.sub(r"[^a-z0-9]+", "-", topic.lower()).strip("-")
    slug = f"{course_id}-{clean_id}"

    # Determine default animation preset based on domain
    preset = "circuit" if "electric" in course_id or "solar" in course_id else "weld" if "weld" in course_id else "gear"

    return {
        "id": f"{slug}-lesson",
        "course_id": course_id,
        "title": f"{topic.title()}: Principles and Practical Application",
        "title_sw": f"{topic.title()}: Kanuni na Utendaji wa Vitendo",
        "briefing": (
            f"In professional workshop practice, mastering {topic} requires strict adherence to safety standards "
            f"and sequential execution. Always inspect personal protective equipment (PPE), ensure proper tool calibration, "
            f"and verify that the workpiece is securely mounted before commencing. Observe manufacturer specifications and "
            f"relevant standards. Maintain a clean work environment, store consumables dry, and double-check your alignment."
        ),
        "briefing_sw": (
            f"Katika mazoezi ya warsha, kuelewa {topic} kunahitaji kufuata sheria za usalama na mpangilio sahihi. "
            f"Kagua vifaa vya kujikinga (PPE) kabla ya kuanza kazi."
        ),
        "estimated_minutes": 20,
        "license": "CC-BY-SA-4.0",
        "cdacc_unit_id": cdacc_code or "CU/WEL/CR/01/5",
        "exam_domain": f"{topic.title()} Competency",
        "media": [
            {
                "kind": "video",
                "url": "https://www.youtube.com/watch?v=0kH8X9_w2_c",
                "caption": f"Practical Demonstration: {topic.title()}",
            },
            {
                "kind": "animation",
                "preset": preset,
                "caption": f"Interactive Simulation: {topic.title()} operation cycle",
            },
        ],
        "exercises": [
            {
                "id": f"{slug}-q1",
                "type": "MULTIPLE_CHOICE",
                "prompt": f"What is the first step a technician must take before starting {topic}?",
                "options": [
                    {"id": "a", "text": "Begin operation immediately without inspection"},
                    {"id": "b", "text": "Inspect PPE, workspace ventilation, and machine guards"},
                    {"id": "c", "text": "Disable circuit breakers to save power"},
                    {"id": "d", "text": "Paint the workpiece"},
                ],
                "correct_answer": "b",
                "hint": "Safety and equipment inspection always precede tool contact.",
                "explanation": "Workplace health and safety regulations require pre-operational checks of all tools and PPE.",
                "xp_reward": 50,
            },
            {
                "id": f"{slug}-q2",
                "type": "FILL_BLANK",
                "prompt": "Personal protective equipment (PPE) must always be worn to prevent ___ in the workshop.",
                "correct_answer": "injury",
                "hint": "Physical harm or accident.",
                "explanation": "Rated PPE shields the operator from electrical, chemical, and physical hazards.",
                "xp_reward": 50,
            },
            {
                "id": f"{slug}-q3",
                "type": "MULTIPLE_CHOICE",
                "prompt": f"Why is calibration and clean alignment critical in {topic}?",
                "options": [
                    {"id": "a", "text": "To ensure precision, prevent joint defects, and guarantee durability"},
                    {"id": "b", "text": "It is only required for cosmetic reasons"},
                    {"id": "c", "text": "It uses more consumables"},
                    {"id": "d", "text": "No reason; alignment does not affect quality"},
                ],
                "correct_answer": "a",
                "hint": "Accuracy leads to high-grade workmanship.",
                "explanation": "Precise setout prevents structural failure, porosity, and tolerance issues.",
                "xp_reward": 50,
            },
        ],
    }


def research_topic(
    topic: str,
    track: str = "trades",
    course_id: str = "welding-fabrication",
    cdacc_code: str = "CU/WEL/CR/01/5",
    api_key: Optional[str] = None,
    lesson_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Research topic with Gemini API (or Mock fallback) and evaluate pedagogical scores.

    Args:
        lesson_id: If provided, overrides the auto-generated lesson ID and output filename.
                   Use this in batch mode to ensure the saved YAML matches the ID referenced
                   by the skill-path YAML (e.g. 'plumbing-isolate').
    """
    print(f"\n[AI Researcher] Researching topic: '{topic}' (Track: {track}, Course: {course_id})")

    lesson_data: Optional[Dict[str, Any]] = None

    if api_key:
        prompt = f"""
You are an expert TVET technical curriculum designer aligning coursework with Kenya CDACC CBET occupational standards.
Research and generate a comprehensive vocational training lesson for:
Topic: "{topic}"
Course Domain: "{course_id}"
Track: "{track}"
CDACC Unit Standard Code: "{cdacc_code}"

Strict requirements for depth & quality:
- MUST NOT be shallow or generic. Avoid broad generic filler like "always inspect PPE and follow safety".
- Provide concrete technical details: exact tools, measurements (mm, amps, volts, bar, ratios), standards, material grades, and physical failure modes.
- The briefing MUST be an in-depth workshop study guide (250 to 350 words) with:
  1. Technical context and equipment parameters (exact numbers: e.g. amp ranges, angle degrees, mix ratios, safety limits)
  2. Step-by-step execution sequence with quality criteria
  3. Common faults, causes, and corrective action
- Keep briefing and briefing_sw as continuous single-line strings with \\n for paragraph breaks, ensuring valid JSON escaping.
- Authentic Swahili translation for title and study summary (briefing_sw).
- 3 to 4 rigorous, practical exercises with realistic scenarios (e.g. diagnosing a defect, calculating or selecting a parameter), detailed hints, and comprehensive technical explanations.
- Realistic YouTube instructional video link on the topic, and appropriate animation preset ('weld', 'circuit', 'gear', 'wave', 'stitch').

Return ONLY valid JSON matching this schema:
{{
  "id": "{course_id}-{re.sub(r'[^a-z0-9]+', '-', topic.lower()).strip('-')}-lesson",
  "course_id": "{course_id}",
  "title": "string",
  "title_sw": "string",
  "briefing": "string",
  "briefing_sw": "string",
  "estimated_minutes": 20,
  "license": "CC-BY-SA-4.0",
  "cdacc_unit_id": "{cdacc_code}",
  "exam_domain": "string",
  "media": [
    {{
      "kind": "video",
      "url": "https://www.youtube.com/watch?v=...",
      "caption": "string"
    }},
    {{
      "kind": "animation",
      "preset": "weld",
      "caption": "string"
    }}
  ],
  "exercises": [
    {{
      "id": "{course_id}-q1",
      "type": "MULTIPLE_CHOICE",
      "prompt": "string",
      "options": [{{"id": "a", "text": "..."}}, {{"id": "b", "text": "..."}}],
      "correct_answer": "a",
      "hint": "string",
      "explanation": "string",
      "xp_reward": 50
    }}
  ]
}}
"""
        try:
            print(" -> Connecting to Google Gemini 2.5 Flash API (Free Tier)...")
            raw_json = call_gemini_api(api_key, prompt).strip()
            # Clean markdown code fences if model returned them
            if raw_json.startswith("```json"):
                raw_json = raw_json[7:]
            elif raw_json.startswith("```"):
                raw_json = raw_json[3:]
            if raw_json.endswith("```"):
                raw_json = raw_json[:-3]
            raw_json = raw_json.strip()

            try:
                lesson_data = json.loads(raw_json, strict=False)
            except Exception:
                lesson_data = yaml.safe_load(raw_json)
                if not isinstance(lesson_data, dict):
                    raise ValueError("Parsed output is not a JSON/YAML mapping")
        except Exception as e:
            try:
                Path("debug_last_response.txt").write_text(raw_json, encoding="utf-8")
                print(" -> Dumped raw response to debug_last_response.txt")
            except Exception:
                pass
            print(f" -> Gemini API call failed ({e}). Falling back to offline generator.")
            lesson_data = generate_mock_lesson(topic, track, course_id, cdacc_code)
    else:
        print(" -> No GEMINI_API_KEY detected. Using offline generator with mock intelligence.")
        lesson_data = generate_mock_lesson(topic, track, course_id, cdacc_code)

    # Compute Quality Audit
    metrics = calculate_pedagogical_metrics(lesson_data)
    lesson_data["quality_audit"] = metrics
    lesson_data["status"] = "staged_for_educator_approval"

    # If caller supplied an exact lesson_id (batch mode), pin it so the
    # saved YAML stem matches what the skill-path YAML references.
    if lesson_id:
        lesson_data["id"] = lesson_id

    # Save to content/drafts/
    draft_path = DRAFTS_DIR / f"{lesson_data['id']}.yaml"
    draft_path.write_text(yaml.dump(lesson_data, sort_keys=False, allow_unicode=True), encoding="utf-8")

    print(f" [OK] Draft saved: {draft_path.relative_to(ROOT)}")
    print(f"   Quality Audit Scores:")
    print(f"     * Interactiveness:        {metrics['interactiveness']:>3}/100")
    print(f"     * Detail & Rigor:         {metrics['details']:>3}/100")
    print(f"     * Ease of Understanding:  {metrics['ease_of_understanding']:>3}/100")
    print(f"     * Multimedia Scaffolding: {metrics['multimedia']:>3}/100")
    print(f"     [*] Overall Pedagogical Index: {metrics['overall_score']:>3}/100")
    return lesson_data


def main():
    parser = argparse.ArgumentParser(description="AI Background Curriculum Researcher & Quality Scorer")
    parser.add_argument("--topic", type=str, default="Oxy-Fuel Cutting Torch Safety & Tip Cleaning", help="Topic to research")
    parser.add_argument("--course", type=str, default="welding-fabrication", help="Course ID")
    parser.add_argument("--track", type=str, default="trades", choices=["trades", "tvet", "cybersecurity"], help="Track")
    parser.add_argument("--cdacc", type=str, default="CU/WEL/CR/03/5", help="CDACC unit code")
    parser.add_argument("--interval", type=int, default=10, help="Seconds to wait between topics in batch mode")
    parser.add_argument("--batch", type=str, help="JSON file with list of topic dicts to research sequentially")
    parser.add_argument(
        "--skip-existing",
        action="store_true",
        dest="skip_existing",
        default=True,
        help="Skip topics whose lesson_id already has a draft or production YAML (default: True)",
    )
    parser.add_argument(
        "--priority",
        type=str,
        default="",
        help="Comma-separated priority levels to include, e.g. 'high' or 'high,medium'. Empty = all.",
    )
    args = parser.parse_args()

    api_key = load_env_key()
    if not api_key:
        print("\n[NOTE] No GEMINI_API_KEY found in environment or .env file.")
        print("To enable full Gemini 1.5 Flash generation (1,500 requests/day free):")
        print("  1. Get a free key at https://aistudio.google.com/")
        print("  2. Run: $env:GEMINI_API_KEY='your_key_here' (PowerShell) or add to .env\n")

    if args.batch:
        batch_file = Path(args.batch)
        if not batch_file.exists():
            print(f"Batch file not found: {batch_file}")
            sys.exit(1)
        topics = json.loads(batch_file.read_text(encoding="utf-8"))

        # Filter by priority if requested
        if args.priority:
            priorities = [p.strip() for p in args.priority.split(",")]
            topics = [t for t in topics if t.get("priority", "medium") in priorities]
            print(f"Priority filter '{args.priority}': {len(topics)} topics selected.")

        print(f"Processing batch of {len(topics)} topics (interval={args.interval}s)...")
        done = skipped = 0
        for idx, item in enumerate(topics, 1):
            lid = item.get("lesson_id", "")
            # Skip if draft or production lesson already exists
            if args.skip_existing and lid:
                draft_exists = (DRAFTS_DIR / f"{lid}.yaml").exists()
                prod_exists = (LESSONS_DIR / f"{lid}.yaml").exists()
                if draft_exists or prod_exists:
                    print(f"\n--- [{idx}/{len(topics)}] SKIP (already exists): {lid}")
                    skipped += 1
                    continue
            print(f"\n--- [{idx}/{len(topics)}] ---")
            research_topic(
                topic=item.get("topic", "Workshop Practice"),
                track=item.get("track", "trades"),
                course_id=item.get("course", "welding-fabrication"),
                cdacc_code=item.get("cdacc", "CU/WEL/CR/01/5"),
                api_key=api_key,
                lesson_id=lid or None,
            )
            done += 1
            if idx < len(topics):
                print(f"Sleeping {args.interval} seconds to pace API usage...")
                time.sleep(args.interval)
        print(f"\nBatch complete. Researched: {done}, Skipped: {skipped}.")
    else:
        research_topic(
            topic=args.topic,
            track=args.track,
            course_id=args.course,
            cdacc_code=args.cdacc,
            api_key=api_key,
        )


if __name__ == "__main__":
    main()
