---
name: youtube-short-upload
description: Upload a rendered 9:16 vertical HyperFrames short to YouTube Shorts via the YouTube Data API v3 with OAuth 2.0, channel verification (UCSJyG3bTM7lnjMIZcV8C4OQ), resumable chunked upload, and pre-upload validation. Use when the user asks to upload or publish a rendered Short MP4 to YouTube.
---

# YouTube Short Upload Skill

Uploads a rendered 9:16 MP4 short to YouTube Studio (`https://studio.youtube.com/channel/UCSJyG3bTM7lnjMIZcV8C4OQ`) using the official YouTube Data API v3 (`upload_youtube.py`).

## One-Time OAuth Setup (Never Commit Credentials)

1. Go to [Google Cloud Console → APIs & Services](https://console.cloud.google.com/apis/library/youtube.googleapis.com) and enable **YouTube Data API v3**.
2. Go to **Credentials → Create Credentials → OAuth client ID → Desktop app**.
3. Download the JSON file and save it locally (outside git):
   ```bash
   mkdir -p ~/.config/youtube-upload
   mv ~/Downloads/client_secret_*.json ~/.config/youtube-upload/client_secret.json
   chmod 600 ~/.config/youtube-upload/client_secret.json
   ```
4. Never commit `client_secret.json` or `token.json` to any repository.

## Upload Command (Default: Private on Brand Channel)

Run with the 1-command wrapper (defaults to `--privacy private` and verifies Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ`):

```bash
cta-short/scripts/video/publish_short.sh
```

Or run directly with `uv run`:

```bash
uv run --with google-api-python-client --with google-auth-oauthlib \
  cta-short/scripts/video/upload_youtube.py \
  cta-short/Delivery-Pilot-Short-v16.mp4 \
  --meta cta-short/scripts/video/youtube_metadata.json \
  --channel-id UCSJyG3bTM7lnjMIZcV8C4OQ \
  --privacy private
```

### Brand Channel Spec & Auth Rules

- **Target Channel**: Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ` (`https://studio.youtube.com/channel/UCSJyG3bTM7lnjMIZcV8C4OQ`).
- **Default Privacy**: `private` (safe for private review in YouTube Studio before publishing).
- **Brand Account Selection**: `upload_youtube.py` uses `prompt="select_account consent"`. After picking your Google email, Google displays a second **"Choose an account or a brand account"** screen — you **must** click the Brand Channel (`UCSJyG3bTM7lnjMIZcV8C4OQ`), NOT the personal/admin channel (`Pexabo LTD Admin`).
- **Channel Safety Lock**: `verify_channel()` queries `channels.list(mine=True)` and aborts immediately if the token resolves to any other channel ID.

### Options

- `--privacy`: `private` (default), `unlisted`, or `public`.
- `--channel-id`: Verifies the authenticated YouTube channel matches `UCSJyG3bTM7lnjMIZcV8C4OQ` before uploading.
- `--dry-run`: Validates video dimensions/duration (`9:16`, `<= 60s`), metadata, and credentials without uploading.
- `--title`, `--description`, `--tags`: Override fields from `--meta`.

## Pre-Upload Checklist

1. Confirm video is vertical (`1080x1920`, aspect ratio `9:16`) and `<= 60s` so YouTube classifies it as a **Short**.
2. Confirm `#Shorts` is present in the title or description.
3. On first run, approve the Google OAuth prompt in **Google Chrome**; subsequent runs reuse `~/.config/youtube-upload/token.json` automatically.
4. After upload, open the returned Studio URL (`https://studio.youtube.com/video/<VIDEO_ID>/edit`) in Google Chrome to verify thumbnails, captions, and publish visibility.
