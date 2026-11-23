#!/usr/bin/env bash
# 1-command YouTube Shorts publisher for Delivery Pilot (channel UCSJyG3bTM7lnjMIZcV8C4OQ).
#
# Usage:
#   cta-short/scripts/video/publish_short.sh [video.mp4] [unlisted|private|public] [--dry-run]
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CONFIG_DIR="${HOME}/.config/youtube-upload"
CLIENT_SECRET="${CONFIG_DIR}/client_secret.json"
CHANNEL_ID="UCSJyG3bTM7lnjMIZcV8C4OQ"
META_FILE="${SCRIPT_DIR}/youtube_metadata.json"

# Pick latest Delivery-Pilot-Short-v*.mp4 if no file is passed
if [[ $# -ge 1 && "$1" != --* && "$1" != "unlisted" && "$1" != "private" && "$1" != "public" ]]; then
  VIDEO="$1"
  shift
else
  VIDEO="$(ls -1 "${PROJECT_DIR}"/Delivery-Pilot-Short-v*.mp4 2>/dev/null | sort -V | tail -n 1 || true)"
fi

if [[ -z "${VIDEO}" || ! -f "${VIDEO}" ]]; then
  echo "ERROR: Could not find rendered Short MP4 in ${PROJECT_DIR}" >&2
  exit 1
fi

PRIVACY="unlisted"
EXTRA_ARGS=()
for arg in "$@"; do
  case "$arg" in
    unlisted|private|public) PRIVACY="$arg" ;;
    *) EXTRA_ARGS+=("$arg") ;;
  esac
done

mkdir -p "${CONFIG_DIR}"
chmod 700 "${CONFIG_DIR}"

# Helpful check if client_secret.json hasn't been placed yet
if [[ ! -f "${CLIENT_SECRET}" ]] && [[ ! " ${EXTRA_ARGS[*]} " =~ " --dry-run " ]]; then
  DOWNLOAD_MATCH="$(ls -1t "${HOME}"/Downloads/client_secret_*.json 2>/dev/null | head -n 1 || true)"
  if [[ -n "${DOWNLOAD_MATCH}" ]]; then
    echo "Found OAuth secret in Downloads: ${DOWNLOAD_MATCH}"
    echo "Move it with:"
    echo "  mv \"${DOWNLOAD_MATCH}\" \"${CLIENT_SECRET}\" && chmod 600 \"${CLIENT_SECRET}\""
  else
    echo "Missing OAuth client secret: ${CLIENT_SECRET}"
    echo "Follow cta-short/YOUTUBE_UPLOAD.md to download your Desktop OAuth JSON from Google Cloud Console."
  fi
  exit 2
fi

echo "Publishing: ${VIDEO}"
echo "Channel:    https://studio.youtube.com/channel/${CHANNEL_ID}"
echo "Privacy:    ${PRIVACY}"

exec uv run --with google-api-python-client --with google-auth-oauthlib \
  "${SCRIPT_DIR}/upload_youtube.py" \
  "${VIDEO}" \
  --meta "${META_FILE}" \
  --channel-id "${CHANNEL_ID}" \
  --privacy "${PRIVACY}" \
  "${EXTRA_ARGS[@]}"
