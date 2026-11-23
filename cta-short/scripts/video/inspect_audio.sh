#!/usr/bin/env bash
# Stage 2: audio check. Lists the streams and the level of each channel of a clip.
# Usage: scripts/video/inspect_audio.sh /Volumes/NINJAV/NINJAV_S001_S001_T020.MOV
# Channels that read near -90 dB are silent; the channels that carry speech show a real level.
set -euo pipefail
f="${1:?usage: inspect_audio.sh <clip>}"
ffprobe -v error -show_entries stream=index,codec_type,codec_name,channels,sample_rate -show_entries format=duration -of compact "$f"
channels=$(ffprobe -v error -select_streams a:0 -show_entries stream=channels -of csv=p=0 "$f")
for ((c = 0; c < channels; c++)); do
  printf 'channel %d: ' "$c"
  ffmpeg -hide_banner -nostats -i "$f" -vn -af "pan=mono|c0=c$c,volumedetect" -f null - 2>&1 | grep -E 'mean_volume' | sed 's/.*mean_volume/mean_volume/'
done
