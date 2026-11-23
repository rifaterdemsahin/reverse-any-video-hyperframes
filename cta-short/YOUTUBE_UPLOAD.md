# 1-Command YouTube Shorts CLI Upload Guide

This document explains how to enable and run **1-command automated YouTube Shorts uploads** for your channel (`UCSJyG3bTM7lnjMIZcV8C4OQ`) using the official **YouTube Data API v3** and OAuth 2.0.

## Current State & Blocker

| Check | Status | Details |
|---|---|---|
| Rendered Short (`v16`) | **READY** | `cta-short/Delivery-Pilot-Short-v16.mp4` (`1080×1920`, `47.0s`, `47.4 MB`) |
| Uploader Script & Skill | **READY** | `publish_short.sh` + `upload_youtube.py` (`--dry-run` verified) |
| YouTube Studio Upload | **NOT UPLOADED YET** | Blocked on missing Google OAuth credential (`~/.config/youtube-upload/client_secret.json`) |
| `~/.config/youtube-upload/` | **EMPTY** | Directory created (`chmod 700`), waiting for `client_secret.json` |
| `~/Downloads/client_secret*.json` | **NOT FOUND** | Needs to be downloaded once from Google Cloud Console |

**Why it is not visible in YouTube Studio yet:** YouTube requires an authenticated OAuth 2.0 client credential (`client_secret.json`) and your Google account consent before any CLI or agent can upload videos to channel `UCSJyG3bTM7lnjMIZcV8C4OQ`. Until `client_secret.json` is saved to `~/.config/youtube-upload/client_secret.json` (or you drag & drop the MP4 into YouTube Studio manually), no upload can be sent.

---

## Architecture Overview

| File | Purpose |
|---|---|
| `cta-short/scripts/video/upload_youtube.py` | Official YouTube Data API v3 resumable chunked uploader (`8 MB` chunks), validates `9:16` vertical & `≤ 60s` Shorts specs, verifies target channel ID `UCSJyG3bTM7lnjMIZcV8C4OQ`, and handles OAuth 2.0 token refresh. |
| `cta-short/scripts/video/publish_short.sh` | 1-command wrapper that auto-selects the newest `Delivery-Pilot-Short-v*.mp4`, checks `~/.config/youtube-upload/client_secret.json`, and runs `upload_youtube.py` via `uv run` (no manual virtualenv needed). |
| `cta-short/scripts/video/youtube_metadata.json` | Editable title, description, tags, and category (`28` = Science & Technology). |
| `cta-short/skill/youtube-short-upload/SKILL.md` | Agent skill definition so any future agent session knows how to upload Shorts safely. |
| `~/.config/youtube-upload/client_secret.json` | **Local-only** Google Cloud Desktop OAuth JSON (**never commit to git**). |
| `~/.config/youtube-upload/token.json` | **Local-only** cached OAuth refresh token auto-created on first login (**never commit to git**). |

---

## One-Time Setup (5 Minutes)

### Step 1 — Enable YouTube Data API v3
1. Open [Google Cloud Console — YouTube Data API v3](https://console.cloud.google.com/apis/library/youtube.googleapis.com) in Google Chrome.
2. Select (or create) a Google Cloud project (e.g., `delivery-pilot-youtube`).
3. Click **Enable**.

### Step 2 — Configure OAuth Audience (Test Users) & Data Access (Scopes)
In Google Cloud's **Google Auth Platform** sidebar, **Test Users** and **Scopes** live on two separate tabs (not under **Clients**):
1. **Audience (Test users)** — open `https://console.cloud.google.com/auth/audience?project=delivery-pilot-chat`:
   - Choose **External** → under **Test users**, click **+ Add users** → add the exact Google email that owns Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ` → **Save**.
   > **Important:** Without adding the Brand Channel owner email as a Test User while the app is in Testing mode, Google returns `Error 403: access_denied`.
2. **Data Access (Scopes)** — open `https://console.cloud.google.com/auth/scopes?project=delivery-pilot-chat`:
   - Click **Add or remove scopes**, filter for `youtube`, check `https://www.googleapis.com/auth/youtube.upload` and `https://www.googleapis.com/auth/youtube.readonly` → **Update → Save**.

### Step 3 — Create Desktop OAuth Client ID
1. Go to **APIs & Services → Credentials**.
2. Click **+ Create Credentials → OAuth client ID**.
3. Set **Application type** to **Desktop app** (name: `Delivery Pilot CLI`).
4. Click **Create** → **Download JSON**.

### Step 4 — Install the Credentials Locally
Move the downloaded JSON file into `~/.config/youtube-upload/client_secret.json` with strict permissions:

```bash
mkdir -p ~/.config/youtube-upload
chmod 700 ~/.config/youtube-upload
mv ~/Downloads/client_secret_*.json ~/.config/youtube-upload/client_secret.json
chmod 600 ~/.config/youtube-upload/client_secret.json
```

---

## How to Upload (1-Command CLI)

### Option A — Wrapper Script (Auto-picks Latest Render, Private Mode)
```bash
cta-short/scripts/video/publish_short.sh
```
- Defaults to `--privacy private` on Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ` so you can review privately in YouTube Studio before publishing.
- Pass `unlisted` or `public` to override:
  ```bash
  cta-short/scripts/video/publish_short.sh cta-short/Delivery-Pilot-Short-v16.mp4 unlisted
  ```
- Dry-run check (validates video specs & metadata without uploading):
  ```bash
  cta-short/scripts/video/publish_short.sh --dry-run
  ```

### Option B — Direct `uv run` Command
```bash
uv run --with google-api-python-client --with google-auth-oauthlib \
  cta-short/scripts/video/upload_youtube.py \
  cta-short/Delivery-Pilot-Short-v16.mp4 \
  --meta cta-short/scripts/video/youtube_metadata.json \
  --channel-id UCSJyG3bTM7lnjMIZcV8C4OQ \
  --privacy private
```

### Option C — npm Script (from `cta-short/`)
```bash
cd cta-short
npm run upload:youtube
```

---

## First-Run OAuth Flow

1. The first time you run the command, Google Chrome opens a local Google sign-in window.
2. Select the Google account that owns channel **`UCSJyG3bTM7lnjMIZcV8C4OQ`**.
3. If Google shows *"Google hasn't verified this app"*, click **Advanced → Go to Delivery Pilot Uploader (unsafe)** (safe because it is your own private Google Cloud project).
4. Approve permissions. The script saves your refresh token to `~/.config/youtube-upload/token.json` (`chmod 600`) and verifies your channel ID before uploading.
5. Every future upload runs completely headlessly with **zero browser prompts**.

---

## Fixing `Error 403: access_denied` (Testing Mode)

If Google shows *"Access blocked: OAuth consent screen has not completed the Google verification process (Error 403: access_denied)"*:

1. Open [Google Cloud Console → Google Auth Platform → Audience](https://console.cloud.google.com/auth/audience) (signed into the account that created the OAuth Client ID).
2. Scroll to **Test users** → click **+ Add users**.
3. Add the exact Google email for **Erdem** (owner of Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ`) → click **Save**.
4. Re-run immediately (no need to re-download `client_secret.json`):
   ```bash
   rm -f ~/.config/youtube-upload/token.json && cta-short/scripts/video/publish_short.sh
   ```
5. Click **Continue** on the unverified-app notice, then pick Brand Channel **`UCSJyG3bTM7lnjMIZcV8C4OQ`**.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `Error 403: access_denied` | Add your Google email under **OAuth consent screen → Test users** in Google Cloud Console. |
| `Authenticated channel mismatch` | You signed into a different Google account/brand channel. Delete `~/.config/youtube-upload/token.json` and re-run to pick the right channel. |
| `quotaExceeded` | Default YouTube Data API v3 quota is `10,000` units/day (~6 video uploads/day at `1,600` units each). Quota resets at midnight Pacific Time. |
| Video not marked as a Short | Confirm video is vertical (`1080×1920`), `≤ 60s`, and `#Shorts` is in the title/description (`upload_youtube.py` checks all three automatically). |

---

## Security Rules

- **Never** commit `client_secret.json` or `token.json` into git.
- Keep both files in `~/.config/youtube-upload/` with `chmod 600`.
- If a secret is ever exposed, revoke it immediately in Google Cloud Console → **Credentials** and download a fresh one.
