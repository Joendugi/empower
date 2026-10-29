from __future__ import annotations

"""
CyberLearn Open edX Tutor Plugin
================================
Bridges Open edX LMS / Studio with CyberLearn Kenya and the CTFd challenge sidecar.
Provides:
  - LTI 1.3 Advantage configuration defaults for Open edX.
  - CTFd container definitions and redis backing services.
  - Network bridging between Tutor Open edX LMS, CTFd, and CyberLearn API.
  - Automatic lineitem grade passback configuration.
"""

import os
from typing import Any

# Plugin configuration constants
CYBERLEARN_DEFAULT_HOST = "cyberlearn.local"
CYBERLEARN_API_DEFAULT_HOST = "api.cyberlearn.local"
CTFD_DEFAULT_HOST = "ctfd.local"
CTFD_DEFAULT_PORT = 8000

# Tutor hooks integration
try:
    from tutor import hooks

    # Define configuration defaults for the plugin
    hooks.Filters.CONFIG_DEFAULTS.add_items(
        [
            ("CYBERLEARN_HOST", CYBERLEARN_DEFAULT_HOST),
            ("CYBERLEARN_API_HOST", CYBERLEARN_API_DEFAULT_HOST),
            ("CYBERLEARN_API_PORT", 8000),
            ("CYBERLEARN_LTI_CLIENT_ID", "openedx-tutor-client"),
            ("CYBERLEARN_LTI_KEY_ID", "empower-lti-key-1"),
            ("CTFD_HOST", CTFD_DEFAULT_HOST),
            ("CTFD_PORT", CTFD_DEFAULT_PORT),
            ("CTFD_SECRET_KEY", "ctfd_secret_cyberlearn_2031"),
            ("CTFD_WEBHOOK_SECRET", "ctfd_whsec_dev_2031"),
        ]
    )

    # Patch Open edX LMS Django common settings to enable LTI 1.3 Advantage
    LMS_SETTINGS_PATCH = """
# CyberLearn & LTI 1.3 Advantage Configuration
FEATURES["ENABLE_LTI_1P3"] = True
FEATURES["ENABLE_LTI_1P3_DEEP_LINKING"] = True

LTI_1P3_TOOL_CONFIGS = getattr(settings, "LTI_1P3_TOOL_CONFIGS", {})
LTI_1P3_TOOL_CONFIGS["cyberlearn"] = {
    "client_id": "{{ CYBERLEARN_LTI_CLIENT_ID }}",
    "issuer": "http://{{ LMS_HOST }}",
    "auth_login_url": "http://{{ CYBERLEARN_API_HOST }}:{{ CYBERLEARN_API_PORT }}/lti/login",
    "auth_token_url": "http://{{ LMS_HOST }}/oauth2/access_token",
    "key_set_url": "http://{{ CYBERLEARN_API_HOST }}:{{ CYBERLEARN_API_PORT }}/.well-known/jwks.json",
    "deep_link_url": "http://{{ CYBERLEARN_API_HOST }}:{{ CYBERLEARN_API_PORT }}/lti/deep-link",
}
"""
    hooks.Filters.ENV_PATCHES.add_item(("openedx-lms-common-settings", LMS_SETTINGS_PATCH))

    # Patch Docker Compose to include CTFd sidecar and Redis container
    COMPOSE_SERVICES_PATCH = """
  ctfd:
    image: ctfd/ctfd:3.7.0
    restart: always
    environment:
      - UPLOAD_FOLDER=/var/uploads
      - DATABASE_URL=sqlite:////var/data/ctfd.db
      - REDIS_URL=redis://ctfd-redis:6379
      - SECRET_KEY={{ CTFD_SECRET_KEY }}
      - REVERSE_PROXY=true
    volumes:
      - ../data/ctfd/data:/var/data
      - ../data/ctfd/uploads:/var/uploads
    networks:
      - default
    ports:
      - "{{ CTFD_PORT }}:8000"
    depends_on:
      - ctfd-redis

  ctfd-redis:
    image: redis:7-alpine
    restart: always
    volumes:
      - ../data/ctfd/redis:/data
    networks:
      - default
"""
    hooks.Filters.ENV_PATCHES.add_item(("local-docker-compose-services", COMPOSE_SERVICES_PATCH))

except ImportError:
    # When tutor is not installed directly in this python env, export helper classes
    pass


def get_plugin_manifest() -> dict[str, Any]:
    """Return plugin information for verification and inspection."""
    return {
        "name": "cyberlearn",
        "version": "0.1.0",
        "description": "CyberLearn Kenya & CTFd LTI 1.3 bridge for Open edX Tutor",
        "defaults": {
            "CYBERLEARN_HOST": CYBERLEARN_DEFAULT_HOST,
            "CYBERLEARN_API_HOST": CYBERLEARN_API_DEFAULT_HOST,
            "CTFD_HOST": CTFD_DEFAULT_HOST,
            "CTFD_PORT": CTFD_DEFAULT_PORT,
        },
    }
