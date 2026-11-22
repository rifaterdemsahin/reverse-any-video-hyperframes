# Reverse Any Video — HyperFrames Tech Promo (60s, 1080p, 60fps)

[![Fly.io Status](https://img.shields.io/badge/Fly.io-Live-00D1B2?style=flat&logo=flydotio)](https://reverse-any-video-hyperframes.fly.dev/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/rifaterdemsahin/reverse-any-video-hyperframes)
[![Resolution](https://img.shields.io/badge/Format-1080p%2060fps-06B6D4?style=flat)](#)
[![Audio](https://img.shields.io/badge/AI%20Voice-DeepInfra%20Kokoro-10B981?style=flat)](#)

A high-retention, 60-second 16:9 tech promo video built natively with **HeyGen HyperFrames** standards, studio-grade AI voiceover (DeepInfra Kokoro-82M), deterministic GSAP kinetic animations, multi-track audio ducking, and frame-accurate timeline synchronization.

---

## 🚀 Live Deployment & Watch Links

- 🌐 **Watch Rendered Video:** [https://reverse-any-video-hyperframes.fly.dev/watch](https://reverse-any-video-hyperframes.fly.dev/watch)
- ⚡ **Interactive HyperFrames Stage:** [https://reverse-any-video-hyperframes.fly.dev/](https://reverse-any-video-hyperframes.fly.dev/)
- ⬇️ **Direct MP4 Download:** [https://reverse-any-video-hyperframes.fly.dev/output/reverse_any_video_promo.mp4](https://reverse-any-video-hyperframes.fly.dev/output/reverse_any_video_promo.mp4)
- 📐 **Production Plan JSON:** [https://reverse-any-video-hyperframes.fly.dev/plan.json](https://reverse-any-video-hyperframes.fly.dev/plan.json)
- 🩺 **Health Check:** [https://reverse-any-video-hyperframes.fly.dev/health](https://reverse-any-video-hyperframes.fly.dev/health)

---

## 📁 Repository & Directory Layout

```
reverse-any-video-hyperframes/
├── seed/                        # 🌱 Seed analysis & initial creative prompts
│   ├── initial_prompt.md        # Original 60s tech promo prompt & scene-by-scene script
│   ├── metrics.json             # Reference video measured metrics (Job 639a35317eea)
│   ├── hyperframes_prompt.md    # Generative prompt for 8-scene 306s explainer format
│   ├── hyperframes_template.json# Template JSON with timeline markers & placeholders
│   ├── AGENTS.md                # AI agent execution rules & schema definitions
│   └── README.md                # Provenance and analysis documentation
├── compositions/                # 🎬 HyperFrames scene sub-compositions
│   ├── scene-1.html             # [0:00 – 0:08] Hook & The Promise (100% -> 108% punch-in)
│   ├── scene-2.html             # [0:08 – 0:18] The Old Way vs. The New Way (50/50 vertical wipe)
│   ├── scene-3.html             # [0:18 – 0:28] Verified Output (3D tilted app & stamp badge)
│   ├── scene-4.html             # [0:28 – 0:40] Hyperframes Magic (Timeline drop & snap)
│   ├── scene-5.html             # [0:40 – 0:52] Simple Credit Pricing ($1 = 10 Credits, 3D coin)
│   └── scene-6.html             # [0:52 – 1:00] Call To Action & Skool Community
├── assets/
│   ├── audio/
│   │   ├── voiceover.mp3        # Master AI voiceover (DeepInfra Kokoro-82M, timed to 60s)
│   │   ├── bg_music.mp3         # Upbeat modern electronic beat (128 BPM)
│   │   └── sfx/                 # Bundled crisp sound effects (whoosh, error, chime, stamp, impact, ping, click)
│   ├── fonts/                   # Inter & JetBrains Mono WOFF2 fonts
│   ├── vendor/                  # GSAP 3.12.5 local runtime
│   ├── overlays/                # High-res Pango markup cards for each scene
│   └── videos/                  # 1080p 60fps background video tracks for each scene
├── scripts/
│   ├── generate_deepinfra_voiceover.mjs # Studio AI speech synthesis via DeepInfra Kokoro-82M
│   ├── generate_audio.mjs       # Speech & electronic beat generator fallback
│   ├── generate_videos.mjs      # Generates 1080p 60fps procedural video tracks
│   ├── generate_overlays.mjs    # Generates high-resolution typography cards via Pango
│   └── render_video.mjs         # Master compiler assembling scenes, overlays, and audio to MP4
├── output/
│   └── reverse_any_video_promo.mp4 # Final compiled 1080p 60fps promo video
├── index.html                   # Master HyperFrames composition with interactive scrubber
├── plan.json                    # Structured production plan, beats, timing, and color tokens
├── server.mjs                   # Production HTTP streaming server
├── Dockerfile                   # Fly.io deployment container definition
└── fly.toml                     # Fly.io application deployment configuration
```

---

## ⏱️ Timeline & Scene Breakdown

| Timestamp | Scene | Visual Action & Layers | Kinetic Typography & Badges | SFX Cue |
|---|---|---|---|---|
| **0:00 – 0:08** | **Scene 1: Hook & The Promise** | Full-screen A-roll (`aroll_hook.mp4`) with 100% -> 108% punch-in zoom. Split-screen comparison card swooshes in on the right half at 0:02 showing viral edit vs raw footage snapping to blueprint via cyan transfer lines. | Title: `REVERSE-ENGINEER ANY EDIT`<br/>Subtitle pill: `Target Video → Perfect Blueprint` | **0:02** Digital whoosh |
| **0:08 – 0:18** | **Scene 2: The Old Way vs The New Way** | 50/50 vertical split-screen wipe. Left panel (0:08–0:13) shows chaotic red-tinted terminal logs. Right panel (0:13–0:18) wipes in with emerald clean AI blueprint card and checkmarks. | Left: `The Old Way: Raw & Unsimplified`<br/>Right: `The New Way: AI-Ready Format` | **0:08** Error thud<br/>**0:13** Confirmation chime |
| **0:18 – 0:28** | **Scene 3: Verified Output** | 0:18–0:23: 3D perspective tilted web app screen capture (`app_upload_demo.mp4`) with file drag-and-drop & glowing progress bar.<br/>0:23–0:28: Split cut to A-roll review (`aroll_review.mp4`). | Status pills: `Extracting Cuts...`, `Extracting Colors...`, `Extracting Pacing...`<br/>Stamp badge: `Checked & Used By Me` | **0:24** Lock-in stamp sound |
| **0:28 – 0:40** | **Scene 4: The Hyperframes Magic** | Glowing AI-ready file icon drops onto multi-track Hyperframes timeline (`hyperframes_build_demo.mp4`). Cyan/purple particle burst on impact, followed by speed-ramped clip snapping. | Top pill: `AI-Ready Output → Hyperframes`<br/>Lower third: `Build Videos Much Faster` | **0:28** Sub-bass impact drop & mechanical snaps |
| **0:40 – 0:52** | **Scene 5: Simple Credit Pricing** | Full-screen A-roll (`aroll_pricing.mp4`). At 0:43, a 3D gold/cyan coin drops with physics bounce into a glassmorphism pricing card on the right third. | Display text: `$1 = 10 Video Credits`<br/>Badge: `NO SUBSCRIPTIONS` | **0:43** Metallic coin clink |
| **0:52 – 1:00** | **Scene 6: Call To Action & Skool** | A-roll (`aroll_cta.mp4`) framed high for clean lower-third. At 0:53, two interactive CTA buttons animate in with simulated cursor glide and click glow. | Primary Cyan: `Get Your Credits Now ↓`<br/>Secondary Card: `Join the Skool Community` | **0:53** Button click; music swells and cuts out at 1:00 |

---

## 🎙️ AI Voiceover Synthesis (DeepInfra Kokoro-82M)

The voiceover track is generated with **DeepInfra**'s `hexgrad/Kokoro-82M` text-to-speech engine:
- **Voice Model:** `hexgrad/Kokoro-82M`
- **Voice Character:** `am_adam` (crisp American tech narrator)
- **Tempo Calibration:** Calibrated to 175–216 WPM to align with scene pacing.

To re-generate the voiceover:
```bash
node scripts/generate_deepinfra_voiceover.mjs
```

---

## 🛠️ How to Preview, Build & Deploy

### 1. Standalone Live Browser Preview
Open `index.html` in your browser or run:
```bash
open index.html
```

### 2. Render Video with FFmpeg
To re-render the finalized 1080p 60fps video with all audio ducking & SFX:
```bash
node scripts/render_video.mjs
```

### 3. Deploy to Fly.io
```bash
fly deploy --remote-only
```
