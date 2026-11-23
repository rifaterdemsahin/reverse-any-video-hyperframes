#!/usr/bin/env bash
# Render a vertical short from a green-screen take: key, background, animated captions, voice and music.
#
# Usage:
#   scripts/video/greenscreen_short.sh <clip> <start-sec> <duration-sec> <background.png> <captions.mov> <music.mp3> <out.mp4> <graphics.mov>
#
# Key: chroma key (0x6ec832, similarity 0.12, blend 0.04) with a green despill, limited to the screen area
#      (x 500-1420, y 300-1080 of the 1920x1080 frame), so paper, lamps and walls keep their colour.
# Layout: 1080x1920. The screen area (x 540-1290, y 360-1080) is cropped and placed at the bottom;
#         the background fills the rest, so the room behind the screen never shows.
# Zoom: the speaker is framed tighter (640 px square from the screen area), filling the bottom 1080 px.
# Graphics: <graphics.mov> (scripts/video/make_graphics.py) sits in the top 840 px, under the captions.
# Audio: the two speech channels (2 and 3, counted from 0) mixed to mono, +10 dB, compressed.
#        Music ducked under the voice (sidechain).
# Needs: ffmpeg with libx264 and aac. Captions come from scripts/video/make_captions.py.
set -euo pipefail
clip="${1:?clip}"; start="${2:?start}"; dur="${3:?duration}"; bg="${4:?background png}"
caps="${5:?captions mov}"; music="${6:?music mp3}"; out="${7:?output mp4}"; graphics="${8:?graphics mov}"

ffmpeg -hide_banner -loglevel error -y \
  -ss "$start" -t "$dur" -i "$clip" \
  -loop 1 -t "$dur" -i "$bg" \
  -i "$caps" \
  -i "$music" \
  -i "$graphics" \
  -filter_complex "
[0:v]format=yuv420p,chromakey=0x6ec832:0.12:0.04,despill=type=green:mix=0.5,format=yuva420p[k];
[k]split=2[kr][ka];
[ka]alphaextract[aa];
color=white:s=1920x1080,drawbox=x=500:y=300:w=920:h=780:color=black:t=fill,format=gray[m];
[aa][m]blend=all_mode=lighten[al];
[kr][al]alphamerge[ka2];
[ka2]crop=640:640:610:370,scale=1080:1080,format=yuva420p[fg];
[1:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,format=yuv420p[bgv];
[bgv][fg]overlay=0:main_h-overlay_h:shortest=1,format=yuv420p[base];
[base][4:v]overlay=0:0:shortest=1,format=yuv420p[vg];
[vg][2:v]overlay=shortest=1,format=yuv420p[v];
[0:a]pan=mono|c0=0.5*c2+0.5*c3,volume=10dB,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,asplit=2[vsc][vmix];
[3:a]atrim=0:$dur,asetpts=PTS-STARTPTS,volume=0.5,aformat=channel_layouts=stereo[mus];
[mus][vsc]sidechaincompress=threshold=0.03:ratio=6:attack=15:release=350[duck];
[vmix]aformat=channel_layouts=stereo[vm];
[vm][duck]amix=inputs=2:weights=1 0.7:normalize=0,alimiter=limit=0.95[a]
" \
  -map "[v]" -map "[a]" -t "$dur" \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 192k "$out"
echo "$out"
