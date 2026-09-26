from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request


def main() -> int:
    parser = argparse.ArgumentParser(description="Probe Empower /ready or /health")
    parser.add_argument("--url", default="http://127.0.0.1:8000/ready")
    args = parser.parse_args()
    try:
        with urllib.request.urlopen(args.url, timeout=8) as response:
            body = response.read().decode("utf-8", errors="replace")
            print(json.dumps({"ok": True, "status": response.status, "body": body[:400]}))
            return 0
    except urllib.error.HTTPError as exc:
        print(json.dumps({"ok": False, "status": exc.code, "reason": exc.reason}))
        return 1
    except Exception as exc:  # noqa: BLE001
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
