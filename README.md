# Reverse Any Video — HyperFrames Tech Promo (60s, 1080p, 60fps)

A high-retention, 60-second 16:9 tech promo video built natively with **HeyGen HyperFrames** standards, deterministic GSAP kinetic animations, multi-track audio ducking, and frame-accurate timeline synchronization.

---

## 📊 Video Analysis & Source Metadata

- **Job:** `639a35317eea`
- **Source:** [YouTube Reference](https://www.youtube.com/watch?v=KnqTiAXUH7M) (analysed for structure and timing)
- **Included Assets:**
  - `metrics.json`: Length, pace, cut rate, shot length, and hook timing.
  - `hyperframes_prompt.md`: Style guidelines, pacing metrics, and scene prompts.
  - `hyperframes_template.json`: Scene plan with placeholders and timeline tracks.
  - `AGENTS.md`: Agent automation guidelines.

---

## 🎬 Master Promo Video Specifications

- **Format:** 16:9 Landscape (1920×1080)
- **Frame Rate:** 60 FPS deterministic render
- **Duration:** 60.0 Seconds (6 scenes)
- **Aesthetic:** Dark-Mode SaaS / Creator UI (`#0B0F17` deep slate canvas, subtle grid lines, glassmorphism cards, drop shadows)
- **Accent Palette:**
  - Electric Cyan (`#06B6D4`): Primary highlights, tech transfers, and primary CTA
  - Emerald Green (`#10B981`): Positive verified states, AI-ready blueprint checkmarks
  - Crimson Red (`#EF4444`): Friction / error states, chaotic unsimplified logs
- **Audio Design:** Voiceover track ducking an upbeat modern 128 BPM electronic synth beat, with synchronized SFX on key visual hits.

---

## 📁 Repository Structure

```
reverse-any-video-hyperframes/
├── index.html                   # Master HyperFrames composition (1920x1080, 60fps, 60s)
├── plan.json                    # Structured production plan, beats, timing, and color tokens
├── compositions/
│   ├── scene-1.html             # [0:00 – 0:08] Hook & The Promise
│   ├── scene-2.html             # [0:08 – 0:18] The Old Way vs. The New Way
│   ├── scene-3.html             # [0:18 – 0:28] Verified Output & Stamp
│   ├── scene-4.html             # [0:28 – 0:40] The Hyperframes Magic Timeline Drop
│   ├── scene-5.html             # [0:40 – 0:52] Simple Credit Pricing ($1 = 10 Credits)
│   └── scene-6.html             # [0:52 – 1:00] Call To Action & Skool Community
├── assets/
│   ├── audio/
│   │   ├── voiceover.mp3        # Master voiceover track (Daniel en_GB, timed to 60s)
│   │   ├── bg_music.mp3         # Upbeat modern electronic beat (128 BPM)
│   │   └── sfx/                 # Bundled crisp sound effects (whoosh, error, chime, stamp, impact, ping, click)
│   ├── fonts/                   # Inter & JetBrains Mono WOFF2 fonts
│   ├── vendor/                  # GSAP 3.12.5 local runtime
│   ├── overlays/                # High-res Pango markup cards for each scene
│   └── videos/                  # 1080p 60fps background video tracks for each scene
├── scripts/
│   ├── generate_audio.mjs       # Synthesizes speech, electronic beat, and ducked audio graph
│   ├── generate_videos.mjs      # Generates 1080p 60fps procedural video tracks
│   ├── generate_overlays.mjs    # Generates high-resolution typography cards via Pango
│   └── render_video.mjs         # Master compiler assembling scenes, overlays, and audio to MP4
└── output/
    └── reverse_any_video_promo.mp4 # Final compiled 1080p 60fps promo video
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

## 🔄 Swappable vs. Locked Layers

When you record your personal A-roll or voiceover, you can swap them in without modifying the code:

| Layer | File Location | How to Swap |
|---|---|---|
| **Voiceover Audio** | `assets/audio/voiceover.mp3` | Drop your recorded `.mp3` or `.wav` file into `assets/audio/voiceover.mp3`. |
| **Background Music** | `assets/audio/bg_music.mp3` | Replace with any upbeat 128 BPM electronic track. |
| **A-Roll Hook** | `assets/videos/aroll_hook.mp4` | Replace with your video of you introducing the hook (8 seconds). |
| **A-Roll Review** | `assets/videos/aroll_review.mp4` | Replace with your video inspecting the blueprint (5 seconds). |
| **A-Roll Pricing** | `assets/videos/aroll_pricing.mp4` | Replace with your video presenting the $1 pricing (12 seconds). |
| **A-Roll CTA** | `assets/videos/aroll_cta.mp4` | Replace with your video pointing down to the description (8 seconds). |
| **Kinetic Overlays & Logic** | `compositions/scene-*.html` | **Locked:** Timing and GSAP animations are calibrated to frame accuracy. |

---

## 🚀 How to Run & Preview

### 1. Standalone Live Browser Preview
Open `index.html` in any modern web browser or run:
```bash
open index.html
```

### 2. Preview in HyperFrames Studio
```bash
open -a HyperFrames .
# or
npx hyperframes preview
```

### 3. Re-compile Video to MP4
```bash
node scripts/render_video.mjs
```
The rendered video will be saved to `output/reverse_any_video_promo.mp4`.
