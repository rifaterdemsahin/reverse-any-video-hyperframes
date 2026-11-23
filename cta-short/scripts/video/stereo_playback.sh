#!/usr/bin/env bash
# Stage 3: playback copy. Moves the channels that carry speech into the left and right speakers,
# so a normal stereo player (VLC, QuickTime) plays them. The video is copied, not re-encoded.
# Usage: scripts/video/stereo_playback.sh <clip> <out.mov> [left-channel] [right-channel]
# Defaults are channels 2 and 3 (the third and fourth, counted from 0). Check with inspect_audio.sh first.
set -euo pipefail
src="${1:?usage: stereo_playback.sh <clip> <out.mov> [left] [right]}"
out="${2:?usage: stereo_playback.sh <clip> <out.mov> [left] [right]}"
left="${3:-2}"; right="${4:-3}"
# Guard: the system disk must have room for a copy of the video (about the size of the source).
need_kb=$(( $(stat -f%z "$src") / 1024 ))
free_kb=$(df -k "$(dirname "$out")" | awk 'NR==2 {print $4}')
if [ "$free_kb" -lt "$need_kb" ]; then
  echo "not enough free space: need about $((need_kb / 1024)) MB, have $((free_kb / 1024)) MB" >&2
  exit 1
fi
ffmpeg -hide_banner -loglevel error -y -i "$src" -map 0:v -c:v copy -map 0:a \
  -af "pan=stereo|c0=c$left|c1=c$right" -c:a pcm_s16le "$out"
echo "$out"
