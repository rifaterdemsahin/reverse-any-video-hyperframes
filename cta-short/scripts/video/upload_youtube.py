#!/usr/bin/env python3
"""Upload a 9:16 vertical short to YouTube via YouTube Data API v3 (OAuth 2.0).

Usage:
  uv run --with google-api-python-client --with google-auth-oauthlib \
    cta-short/scripts/video/upload_youtube.py \
    cta-short/Delivery-Pilot-Short-v16.mp4 \
    --meta cta-short/scripts/video/youtube_metadata.json \
    --channel-id UCSJyG3bTM7lnjMIZcV8C4OQ \
    --privacy unlisted
"""
from __future__ import annotations

import argparse
import json
import os
import pathlib
import subprocess
import sys

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
]

DEFAULT_CONFIG_DIR = pathlib.Path.home() / ".config" / "youtube-upload"
DEFAULT_CLIENT_SECRET = DEFAULT_CONFIG_DIR / "client_secret.json"
DEFAULT_TOKEN_PATH = DEFAULT_CONFIG_DIR / "token.json"
DEFAULT_CHANNEL_ID = "UCSJyG3bTM7lnjMIZcV8C4OQ"


def probe_video(video_path: pathlib.Path) -> tuple[int, int, float]:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=width,height:format=duration",
            "-of",
            "json",
            str(video_path),
        ],
        text=True,
    )
    data = json.loads(out)
    stream = data["streams"][0]
    width = int(stream["width"])
    height = int(stream["height"])
    duration = float(data["format"]["duration"])
    return width, height, duration


def get_authenticated_service(client_secret: pathlib.Path, token_path: pathlib.Path):
    from google.auth.transport.requests import Request
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from googleapiclient.discovery import build

    if not client_secret.exists():
        print(
            f"ERROR: Missing OAuth client secrets file at: {client_secret}\n"
            "Setup steps:\n"
            "  1. Enable YouTube Data API v3 in Google Cloud Console\n"
            "  2. Create OAuth 2.0 Client ID (Desktop app) and download JSON\n"
            f"  3. Save it to {client_secret}\n"
            "  4. Re-run this script.",
            file=sys.stderr,
        )
        sys.exit(2)

    creds = None
    if token_path.exists():
        creds = Credentials.from_authorized_user_file(str(token_path), SCOPES)

    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(str(client_secret), SCOPES)
            creds = flow.run_local_server(port=0, prompt="select_account consent")
        token_path.parent.mkdir(parents=True, exist_ok=True)
        token_path.write_text(creds.to_json(), encoding="utf-8")
        os.chmod(token_path, 0o600)

    return build("youtube", "v3", credentials=creds)


def verify_channel(youtube, expected_channel_id: str) -> str:
    resp = youtube.channels().list(part="id,snippet", mine=True).execute()
    items = resp.get("items", [])
    if not items:
        raise RuntimeError("No YouTube channel found for the authenticated Google account.")
    actual_id = items[0]["id"]
    title = items[0]["snippet"]["title"]
    if expected_channel_id and actual_id != expected_channel_id:
        raise RuntimeError(
            f"Authenticated channel mismatch: got {actual_id} ({title}), "
            f"expected {expected_channel_id}. Delete {DEFAULT_TOKEN_PATH} and re-auth with the right account."
        )
    print(f"Verified channel: {title} ({actual_id})")
    return actual_id


def upload_short(
    video_path: pathlib.Path,
    title: str,
    description: str,
    tags: list[str],
    category_id: str,
    privacy: str,
    made_for_kids: bool,
    channel_id: str,
    client_secret: pathlib.Path,
    token_path: pathlib.Path,
    dry_run: bool,
) -> str | None:
    if not video_path.exists():
        raise FileNotFoundError(f"Video not found: {video_path}")

    width, height, duration = probe_video(video_path)
    print(f"Video: {video_path.name} ({width}x{height}, {duration:.2f}s, {video_path.stat().st_size / 1e6:.1f} MB)")
    if height <= width:
        print("WARNING: Video is not vertical (height <= width); YouTube may not classify it as a Short.")
    if duration > 60.0:
        print("WARNING: Video exceeds 60s; YouTube Shorts require <= 60s.")

    if "#shorts" not in title.lower() and "#shorts" not in description.lower():
        description = (description.rstrip() + "\n\n#Shorts").strip()

    body = {
        "snippet": {
            "title": title[:100],
            "description": description[:5000],
            "tags": tags,
            "categoryId": category_id,
        },
        "status": {
            "privacyStatus": privacy,
            "selfDeclaredMadeForKids": made_for_kids,
        },
    }

    if dry_run:
        print("DRY RUN — payload validated:")
        print(json.dumps(body, indent=2))
        print(f"Target channel: https://studio.youtube.com/channel/{channel_id}")
        print(f"Client secret exists: {client_secret.exists()} ({client_secret})")
        return None

    from googleapiclient.http import MediaFileUpload

    youtube = get_authenticated_service(client_secret, token_path)
    verify_channel(youtube, channel_id)

    media = MediaFileUpload(
        str(video_path),
        mimetype="video/mp4",
        chunksize=8 * 1024 * 1024,
        resumable=True,
    )
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"Uploading... {int(status.progress() * 100)}%")

    video_id = response["id"]
    print(f"Upload complete! Video ID: {video_id}")
    print(f"Watch URL:  https://youtube.com/shorts/{video_id}")
    print(f"Studio URL: https://studio.youtube.com/video/{video_id}/edit")
    return video_id


def main() -> None:
    parser = argparse.ArgumentParser(description="Upload a YouTube Short via YouTube Data API v3.")
    parser.add_argument("video", type=pathlib.Path, help="Path to MP4 file")
    parser.add_argument("--meta", type=pathlib.Path, help="Optional JSON file with title, description, tags")
    parser.add_argument("--title", help="Video title (max 100 chars)")
    parser.add_argument("--description", help="Video description")
    parser.add_argument("--tags", help="Comma-separated tags")
    parser.add_argument("--category-id", default="28", help="YouTube category ID (default: 28 = Science & Tech)")
    parser.add_argument("--privacy", choices=["public", "unlisted", "private"], default="unlisted")
    parser.add_argument("--made-for-kids", action="store_true", default=False)
    parser.add_argument("--channel-id", default=DEFAULT_CHANNEL_ID)
    parser.add_argument("--client-secret", type=pathlib.Path, default=DEFAULT_CLIENT_SECRET)
    parser.add_argument("--token", type=pathlib.Path, default=DEFAULT_TOKEN_PATH)
    parser.add_argument("--dry-run", action="store_true", help="Validate video and payload without uploading")
    args = parser.parse_args()

    meta = {}
    if args.meta:
        meta = json.loads(args.meta.read_text(encoding="utf-8"))

    title = args.title or meta.get("title") or args.video.stem
    description = args.description or meta.get("description") or ""
    tags = [t.strip() for t in args.tags.split(",") if t.strip()] if args.tags else meta.get("tags", [])
    category_id = str(meta.get("categoryId", args.category_id))

    upload_short(
        video_path=args.video,
        title=title,
        description=description,
        tags=tags,
        category_id=category_id,
        privacy=args.privacy,
        made_for_kids=args.made_for_kids,
        channel_id=args.channel_id,
        client_secret=args.client_secret,
        token_path=args.token,
        dry_run=args.dry_run,
    )


if __name__ == "__main__":
    main()
