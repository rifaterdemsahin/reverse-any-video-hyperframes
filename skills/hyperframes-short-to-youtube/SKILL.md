---
name: hyperframes-short-to-youtube
description: End-to-end playbook to build, visually polish, neurally master audio, deploy on Fly.io, and auto-publish a 9:16 vertical HyperFrames short to a YouTube Brand Channel via code. Captures every architecture pattern, command, and pitfall solved across the full 33-commit lifecycle (7444f76 -> 4d80f47) of reverse-any-video-hyperframes.
---

# HyperFrames Short-to-YouTube End-to-End Skill

This skill codifies the complete production pipeline built and validated across **33 commits** (`7444f76` → `4d80f47`) in `reverse-any-video-hyperframes`, culminating in the **first project auto-uploaded to YouTube with code** (`Delivery-Pilot-Short-v16.mp4` → Video ID `6aq1oz-cKhQ` on Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ`).

---

## 1. Full Project Evolution Analysis (Initial Commit → v16 + Auto-Upload)

| Phase | Commits | Versions | What Was Built & Key Breakthroughs |
|---|---|---|---|
| **1. Seed & 60s Promo Foundation** | `7444f76` → `5cc54e6` | 60s 16:9 Promo | Reverse-engineered reference metrics (`seed/metrics.json`), synthesized AI voiceover (DeepInfra Kokoro-82M) and visual plates (FLUX-1), built 6-scene HyperFrames compositions, Node/Python range-streaming servers (`server.mjs`, `server.py`), Fly.io deployment (`Dockerfile`, `fly.toml`), Master Hub (`/nav`), and cost log (`cost.md`). |
| **2. Vertical 9:16 Short & Visual Polish** | `17cbba1` → `6c840ad` | `v7` → `v10` | Upgraded static green-screen short (`v7`) into a full-length (`47.56s`) HyperFrames composition: 8 moving Ken Burns B-roll clips, drifting tech grid + glow orbs + top progress bar, 8 WCAG-AA glassmorphic components (`v8`), split captions/speaker viewports for `1.16×` speaker zoom without zooming captions (`v9`), uniform navy T-shirt stain blending, dual-feathered seam removal above head, and enlarged screen-printed `DeliveryPilot` chest graphic (`v10`). |
| **3. Audio Rescue & AI Neural Mastering** | `7fcc230` → `0aa548f` | `v11` → `v14` | Diagnosed and eliminated 32 noise-gate (`agate`) cutouts (`v11`), built exact phase-aligned stereo-side music cancellation against `music-bed.mp3` (`239`-sample lag, `r = 0.93`, `-17 dB` music reduction with zero voice cuts, `v12`), and ran **DeepFilterNet3** 48 kHz neural speech enhancement via `uvx` + `-14 LUFS` mastering (`v14`). |
| **4. Pacing, Transitions & Review Pages** | `1302b1f` → `9e119a0` | `v13` → `v16` | Inserted lip-sync-locked `0.65s` breathing pause at `00:16.36` (`v13`), cut weak trailing line & pushed in on CTA (`v14`), faded out speaker completely before final second (`45.05s → 45.8s`) into centered CTA end card (`v15`), replaced pause with a `13.8s → 17.3s` animated `template.ai.json` fade-in/out showcase (`v16`). Added `.dockerignore` and interactive pages (`updates.html`, `audio-guide.html`). |
| **5. Automated YouTube Brand Channel Publishing** | `9e119a0` → `4d80f47` | CLI + Skill | Built `upload_youtube.py` + `publish_short.sh` + `youtube-short-upload` skill using YouTube Data API v3 + OAuth 2.0, fixed macOS `sort -V` versioning, enforced Brand Channel lock (`UCSJyG3bTM7lnjMIZcV8C4OQ`), defaulted to `private`, solved all 4 OAuth pitfalls, documented API pinned-comment limits, and auto-uploaded `v16` (`6aq1oz-cKhQ`). |

---

## 2. Reusable Workflow (Step-by-Step)

### Step A — Preview & Validate HyperFrames Safely
- Always launch persistent Studio preview on a port **above 30,000** (e.g., `30082`) using `--background`:
  ```bash
  hyperframes preview --background --port=30082 --no-open cta-short
  hyperframes preview --status cta-short
  open -a "Google Chrome" "http://localhost:30082/#project/cta-short"
  ```
- **HyperFrames Contract Rules (Avoid StaticGuard Errors):**
  - **Never** nest a `<video data-start="...">` inside a wrapper `<div>` that also has `data-start`. Put `data-start`, `data-duration`, `data-track-index` directly on each `<video>` inside a **non-timed** container.
  - Keep all reading text `>= 28px` on `1080×1920` (passes mobile Craft check), and add `data-layout-allow-overflow` on intentional Ken Burns / glow-orb / sheen overflow elements.
  - Never animate GSAP `x`/`y` on an element centered with CSS `transform: translate(-50%, -50%)` (GSAP overwrites `translate`). Use fixed `left` + `width` + `justify-content: center` instead.
- Always run `hyperframes check <dir>` and visually inspect `hyperframes snapshot <dir> --at <timestamps>` before rendering.

### Step B — Split Captions & Zoomed Speaker Seamlessly
When zooming a talking-head video that already has burned-in captions:
1. Render two muted `<video>` layers from the same source inside **non-timed** viewports:
   - `.captions-viewport`: clips the caption band unzoomed with a soft bottom mask (`linear-gradient(to bottom, #000 76%, transparent 100%)`).
   - `.speaker-viewport`: clips the speaker below the captions with a soft top mask (`linear-gradient(to bottom, transparent 0%, #000 6%, #000 100%)`) and scales the speaker (`scale(1.16)`).
2. Always verify head/hair clearance and caption top clearance on snapshots so neither viewport clips text or hair.

### Step C — Audio Engineering & Neural Speech Enhancement
- **Never use an aggressive `agate` noise gate before compression** on quiet input (`-27 dBFS`); it slams shut on soft syllables and causes audible audio cuts (verify with `ffmpeg -af silencedetect=n=-40dB:d=0.15`).
- **If the original stereo music bed is available and speech is mono (`L == R`)**:
  - Compute stereo side difference `A_L - A_R` (voice cancels to `0`), cross-correlate against `M_L - M_R` to find exact codec priming lag (e.g., `239` samples), solve smooth gain `g(t)` via least squares, and subtract `0.90 * g(t) * M_mid(t)` from `A_mid(t)` for `-17 dB` music reduction with zero voice artifacts.
- **Neural Speech Enhancement (DeepFilterNet3 via `uvx`, 48 kHz):**
  ```bash
  uvx --python 3.11 --from deepfilternet \
    --with "torch<2.2" --with "torchaudio<2.2" --with "numpy<2" --with soundfile \
    deepFilter --output-dir /tmp/ai_voice input_48k.wav
  ```
  Then master smoothly to YouTube Shorts loudness (`-14 LUFS`, `-1.0 dB` true peak):
  ```bash
  ffmpeg -y -i /tmp/ai_voice/input_48k_DeepFilterNet3.wav \
    -af "highpass=f=80,equalizer=f=2400:t=q:w=1.1:g=2.0,loudnorm=I=-14:TP=-1.0:LRA=7,pan=stereo|c0=c0|c1=c0" \
    -ar 48000 -c:a aac -b:a 192k audio_mastered.m4a
  ```

### Step D — Pacing Cuts, Transitions & Clean End Cards
- When inserting a breathing gap between cuts, pad **both** video (`tpad=stop_mode=clone:stop_duration=0.65`) and audio (`apad=pad_dur=0.65`) to identical `ffprobe` durations, and cover the frozen frame with a full-frame motion-graphic showcase (fade-in → center glide → fade-out).
- For clean Shorts endings, fade out captions and speaker `~1.0s` before the end so the final second is a centered, unobstructed CTA end card.

### Step E — Render, Git Hygiene & Fly.io Deployment
- Render at native source FPS (`-f 25`) to prevent frame judder:
  ```bash
  hyperframes render cta-short -o cta-short/Delivery-Pilot-Short-vNN.mp4 -f 25
  ```
- Keep `.gitignore` and `.dockerignore` excluding `.git/`, `**/.hyperframes/`, `**/.thumbnails/`, `**/.transcode-cache/`, `**/.waveform-cache/`, and `**/*.hf-transaction-*` so commits stay clean and Fly.io Depot deploys stay fast.
- Update the interactive review page (`cta-short/updates.html`), commit, push to `origin/main`, run `fly deploy --yes`, and open the live URL in **Google Chrome**.

### Step F — Automated YouTube Shorts Upload (Brand Channel, Private)
1. **One-time Google Cloud Setup** (project `delivery-pilot-chat` / `98861509004`):
   - Enable **YouTube Data API v3**.
   - **Audience (Test users)** (`/auth/audience`): add the Brand Channel owner's Google email → **Save** (prevents `Error 403: access_denied`).
   - **Data Access (Scopes)** (`/auth/scopes`): add `youtube.upload`, `youtube.readonly` (and `youtube.force-ssl` if posting comments).
   - **Clients** (`/auth/clients`): create **Desktop app** OAuth Client ID → download JSON → save to `~/.config/youtube-upload/client_secret.json` (`chmod 600`, never commit).
2. **1-Command Publish (`private` default + Brand Channel lock):**
   ```bash
   cta-short/scripts/video/publish_short.sh
   ```
   - Uses `sort -V` (not BSD `ls -1v`, which mis-sorts `v16` below `v9` on macOS).
   - Uses `prompt="select_account consent"` so Google displays the Brand Channel picker instead of silently grabbing a default Workspace account.
   - Verifies `channels.list(mine=True)` matches `UCSJyG3bTM7lnjMIZcV8C4OQ` before uploading.
   - On first run, click **Continue** on Google's expected *"Google hasn't verified this app (testing)"* screen; refresh token caches to `~/.config/youtube-upload/token.json` for zero-prompt future runs.
3. **YouTube API Comment Pinning Limit:**
   - `commentThreads.insert` can post comments only on `unlisted`/`public` videos (blocked on `private`), and **YouTube Data API v3 has no endpoint to pin a comment** — pinning is always a 1-click `⋮ → Pin` action in YouTube Studio.

---

## 3. Verification Checklist Before Marking Done

- [ ] `hyperframes check` passes (`0` errors, WCAG AA contrast 100%).
- [ ] Key transition, subtitle, and end-card frames inspected via `hyperframes snapshot`.
- [ ] Audio verified via `volumedetect` (`-14` to `-18 dB` mean, peak `< -0.5 dB`) and `silencedetect` (no artificial gating dropouts).
- [ ] `publish_short.sh --dry-run` selects the latest version (`sort -V`) and validates `1080×1920`, `<= 60s`, `#Shorts`.
- [ ] Changes committed, pushed to `origin/main`, deployed via `fly deploy --yes`, and opened in **Google Chrome**.
