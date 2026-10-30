"""Object storage for uploaded files: S3 in the cloud, a local folder in development.

Pods are interchangeable, so nothing uploaded may live on a pod's disk in production.
"""

from __future__ import annotations

import asyncio
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.config import settings


@lru_cache(maxsize=1)
def _s3_client() -> Any:
    import boto3  # imported lazily so local development doesn't need AWS credentials

    return boto3.client("s3", region_name=settings.AWS_REGION or None)


def _local_path(key: str) -> Path:
    root = Path(settings.UPLOAD_DIR).resolve()
    path = (root / key).resolve()
    if root not in path.parents:
        raise ValueError("Storage key escapes the upload directory")
    return path


def _put_sync(key: str, data: bytes, content_type: str) -> None:
    if settings.STORAGE_BACKEND == "s3":
        _s3_client().put_object(
            Bucket=settings.UPLOADS_BUCKET,
            Key=key,
            Body=data,
            ContentType=content_type,
            ServerSideEncryption="AES256",
        )
        return
    path = _local_path(key)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


async def put_object(key: str, data: bytes, content_type: str = "application/octet-stream") -> str:
    """Store bytes under `key` and return the key."""
    await asyncio.to_thread(_put_sync, key, data, content_type)
    return key
