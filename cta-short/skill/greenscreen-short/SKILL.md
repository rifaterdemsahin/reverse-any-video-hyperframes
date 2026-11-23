---
name: greenscreen-short
description: Turn a green-screen take into a vertical short with chroma key, the speaker on a generated background, animated word-by-word captions (from DeepInfra Whisper), voice and ducked background music (DeepInfra ACE-Step). Use when the user asks to key, composite, caption or render a green-screen video or a short from a raw take on the NINJAV drive.
---

# Green-screen short

One take in, one 9:16 MP4 out. The steps and scripts are in `scripts/video/`. Every step has a check. Play the clip in VLC first, before any step.

## Before you start

1. **Find the take.** `ls -lt /Volumes/NINJAV` (the newest `NINJAV_S001_S001_T0NN.MOV`). If the listing fails with `Input/output error`, ask the user to replug the drive.
2. **Check the audio** with `scripts/video/inspect_audio.sh <clip>`. Note the channels that carry speech (2 and 3 on the camera takes so far).
3. **Check space:** `df -h /`. The final MP4 is about 30 MB for 30 seconds; the playback copies are large.
4. **Keys:** `DEEPINFRA_API_KEY` must be in the environment. Never write it into a file, a commit, a URL or a chat reply. If a key is pasted into chat, say so and ask for it to be rotated.

## Steps

1. **Pick the window.** Get the transcript with DeepInfra Whisper (`POST https://api.deepinfra.com/v1/inference/openai/whisper-large-v3`, multipart `audio`, `language=en`, `timestamp_granularities[]=segment`). Extract mono 16 kHz audio first: `-af "pan=mono|c0=0.5*c2+0.5*c3" -ar 16000`. Choose the last sentences by their segment times. Cost is about $0.001 per clip.
2. **Check the key colour.** Sample the screen at full resolution. The NINJAV green is about RGB (110, 200, 50), hex `0x6ec832`. Don't sample the walls or the lamp.
3. **Background.** Generate it with FLUX-2-pro: `scripts/generate_image.py "<prompt>" --model black-forest-labs/FLUX-2-pro --size 1024x1024 --out <path>`, about $0.015. Ask for "no people, no text".
4. **Music.** Generate with ACE-Step: `POST https://api.deepinfra.com/v1/inference/ACE-Step/acestep-v15-xl-sft` with JSON `{"prompt": "...", "duration": 35}`. The reply holds the MP3 as base64 in `audio`. Cost is about $0.035 for 35 seconds. Ask for "instrumental, no vocals".
5. **Captions.** `~/venvs/captions/bin/python scripts/video/make_captions.py <whisper.json> <outdir> --start S --end E --fix "OLD=NEW"`. It writes `captions.mov`, a transparent track. Use `--fix` only after checking the audio, and tell the user about each fix. Pillow needs a Python 3.10 venv (`~/venvs/captions`), because the system Python is 3.8.
6. **Render.** `scripts/video/greenscreen_short.sh <clip> <start> <dur> <bg.png> <captions.mov> <music.mp3> <out.mp4>`. It keys inside the screen area only, crops to the screen (x 540–1290, y 360–1080) and places it at the bottom of 1080×1920 over the background, then mixes voice (channels 2 and 3, +6 dB, compressed) with music ducked under it.
7. **Check.** Snapshot a few frames with `ffmpeg -ss <t> -frames:v 1`, read them, and check the captions against the transcript. Measure the audio with `volumedetect`. Play the final file in VLC (`open -a VLC <out.mp4>`).

## Cutting a short from several parts

The short can be built from several windows of the take (for example the hook, a bridge line and the call to action):

1. Find each sentence's start and end in the Whisper segments. Pad each window by 0.15 s before and 0.2–0.3 s after.
2. Render each window with its own captions (`make_captions.py --start --end`), a graphics layer (or a blank one), and `greenscreen_short.sh`.
3. Join them with `scripts/video/join_clips.sh <out.mp4> <w1> <w2> ...`. Cuts are hard. A video dissolve between two takes shows a ghosted double image, so don't use one.

Voice is set to +10 dB in `greenscreen_short.sh`. Raise or lower it there.

## Limits to report to the user

- **No RVM.** The matte is chroma key with despill, limited to the screen area. RVM needs PyTorch and model weights, which were too large for the disk when this was built. Say so when reporting.
- **No libass or drawtext** in this ffmpeg build. Captions are drawn with Pillow instead, and the highlight is per word, not a sweep.
- **Whisper timings are estimates.** The API returns segments; word times are spread by letter count.
- **Background** is square and scaled to 9:16, so it's soft. Ask for a vertical prompt next time.
- **Crop resolution:** the 750-px crop is scaled up to 1080 px, so it's softer than a camera close-up.
