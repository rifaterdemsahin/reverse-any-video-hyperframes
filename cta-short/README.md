# CTA short: Delivery Pilot (v7)

A 9:16 vertical short (47.6 s) for Delivery Pilot. Three parts, joined with hard cuts:
hook, bridge, and call to action (CTA). Built with ffmpeg scripts and laid out as a
HyperFrames project.

**Final file (v16, latest):** `Delivery-Pilot-Short-v16.mp4` (original baseline: `Delivery-Pilot-Short-v7.mp4`)

> **First Project Auto-Uploaded to YouTube with Code:**
> `Delivery-Pilot-Short-v16.mp4` was auto-uploaded directly to Brand Channel `UCSJyG3bTM7lnjMIZcV8C4OQ` via `scripts/video/publish_short.sh` (`Video ID: 6aq1oz-cKhQ`). See `YOUTUBE_UPLOAD.md` and `skill/youtube-short-upload/SKILL.md`.

## What is in this folder

| Path | What it is |
|---|---|
| `Delivery-Pilot-Short-v7.mp4` | The final short. The HyperFrames composition plays it. |
| `index.html`, `hyperframes.json`, `package.json`, `meta.json` | HyperFrames project (open in Studio). |
| `AGENTS.md`, `CLAUDE.md` | Notes for agents working in this HyperFrames project. |
| `build/cuts/w1-hook.mp4`, `w2-bridge.mp4`, `w3-cta.mp4` | The three rendered windows (8.6 s, 7.7 s, 31.2 s). v7 is these joined in order. |
| `build/t020-whisper.json` | Transcript of the take (DeepInfra Whisper). Needed to make captions. |
| `build/music-bed.mp3` | Background music (ACE-Step, instrumental). |
| `build/bg-studio.png` | Background image (FLUX-2-pro). |
| `scripts/video/` | The render scripts (see below). |
| `skill/greenscreen-short/SKILL.md` | The step-by-step recipe the scripts follow. |

## Not in this folder

- **The raw take** `NINJAV_S001_S001_T020.MOV` (about 945 MB, on the NINJAV drive). It is too large
  for GitHub. Copy it to the new computer from the drive before re-keying or re-rendering the
  windows. You do not need it to play or re-join v7.
- **Caches and preview renders** from Hyperframes Studio. Studio rebuilds them.

## Set up on a new computer

1. Install `ffmpeg` (with libx264 and aac) and Node.js.
2. Make the caption venv (Pillow needs Python 3.10 or later):
   `python3.10 -m venv ~/venvs/captions && ~/venvs/captions/bin/pip install pillow`
3. For new AI images, music or transcripts, set `DEEPINFRA_API_KEY` in your shell. Never write
   the key into a file or commit it.
4. Preview the HyperFrames project: `npm run dev` (runs `hyperframes preview`), then open the
   local address it prints.

## Re-make v7 from the three windows (no raw take needed)

```bash
scripts/video/join_clips.sh Delivery-Pilot-Short-v7.mp4 \
  build/cuts/w1-hook.mp4 build/cuts/w2-bridge.mp4 build/cuts/w3-cta.mp4
```

Cuts are hard. Audio gets an 0.08 s crossfade so the cut does not click. Playback can differ
slightly from the original file, but the length matches (47.56 s).

## Change the CTA graphics

1. Edit `scripts/video/graphics_cta.json` (times are seconds from the start of the CTA clip, which
   begins at 139.0 s of the take).
2. Build the graphics layer:
   `~/venvs/captions/bin/python scripts/video/make_graphics.py scripts/video/graphics_cta.json graphics.mov --duration 31.2`
3. Re-render the CTA window with `scripts/video/greenscreen_short.sh` (needs the raw take), then
   re-join with `join_clips.sh`.

## Change the captions

`~/venvs/captions/bin/python scripts/video/make_captions.py build/t020-whisper.json <outdir> --start S --end E`
writes `captions.mov`. Use `--fix "OLD=NEW"` only after you have checked the audio.
The exact `--fix` strings used for v7 were not saved in the repo. The two spelling fixes are
listed as "still to check" in the reference notes, so check the captions against the audio.

## Known limits

- No RVM matte. The green screen uses chroma key with despill, limited to the screen area.
- Background is square and scaled to 9:16, so it is soft.
- The 750 px crop of the speaker is scaled up to 1080 px, so it is softer than a camera close-up.
- Voice level is around -28 dBFS on average. Check it in VLC.
- The cut windows' exact start and end times are not saved in the repo. Get them from
  `build/t020-whisper.json`.

## Costs (rough)

About $0.05 in total: background about $0.015, music about $0.035, transcript about $0.001.
