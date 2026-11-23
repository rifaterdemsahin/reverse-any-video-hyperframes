#!/usr/bin/env bash
# Join rendered windows into one short. Video cuts are hard (no dissolve: a dissolve between two takes
# shows a ghosted double image). Audio gets a 0.08 s acrossfade so the cut doesn't click.
# Usage: scripts/video/join_clips.sh <out.mp4> <a.mp4> <b.mp4> [c.mp4 ...]
set -euo pipefail
out="${1:?out}"; shift
[ "$#" -ge 2 ] || { echo "need at least two clips" >&2; exit 1; }
fd=0.08
inputs=(); for f in "$@"; do inputs+=(-i "$f"); done
n=$#
vlist=""; for ((i = 0; i < n; i++)); do vlist+="[$i:v]"; done
af=""; prev="[0:a]"
for ((i = 1; i < n; i++)); do
  af+="${prev}[$i:a]acrossfade=d=$fd[a$i];"; prev="[a$i]"
done
ffmpeg -hide_banner -loglevel error -y "${inputs[@]}" \
  -filter_complex "${vlist}concat=n=$n:v=1:a=0[v];${af%;}" -map "[v]" -map "$prev" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k "$out"
echo "$out"
