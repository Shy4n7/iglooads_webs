#!/usr/bin/env bash
# Generates web-ready media from the originals in assets/.
# Originals are only read, never modified. Output goes to public/media/.
#
# Per reel video:
#   <name>-card.mp4      640px wide, muted, H.264 crf 26, faststart (grid cards)
#   <name>-1080.mp4      up to 1080px wide, with audio, H.264 crf 24, faststart (lightbox)
#   <name>-poster.jpg    poster frame, 480px wide
# Per stock photo in assets/stock/ (Unsplash License, see assets/stock/CREDITS.md):
#   service-<name>.jpg   900px wide, black and white, used on the What we do cards
# Brand:
#   igloo-ads-pfp-1080.png  Open Graph image (copy)
#   icon-192.png            favicon / touch icon
# Logos are imported straight from assets/logos/wall by next/image.
#
# Usage: scripts/optimize_media.sh [--force]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/assets/videos"
OUT="$ROOT/public/media"
FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

mkdir -p "$OUT"

# Videos shown as reels (portrait 9:16).
REELS=(IMG_7724 IMG_7725 IMG_7728 IMG_7729 IMG_7730 IMG_7733)

need() { [[ $FORCE == 1 || ! -s "$1" ]]; }

# Center crop to 9:16, then scale to a width (never upscale).
vf_916() {
  local w="$1"
  echo "crop='min(iw,ih*9/16)':'min(ih,iw*16/9)',scale='min($w,iw)':-2:flags=lanczos,format=yuv420p"
}

for name in "${REELS[@]}"; do
  in="$SRC/$name.mp4"
  [[ -f "$in" ]] || { echo "missing $in" >&2; exit 1; }

  card="$OUT/$name-card.mp4"
  if need "$card"; then
    echo "card    $name"
    ffmpeg -hide_banner -loglevel error -y -i "$in" -map 0:v:0 \
      -vf "$(vf_916 640),fps=30" -c:v libx264 -preset slow -crf 26 -profile:v high \
      -an -movflags +faststart "$card"
  fi

  hi="$OUT/$name-1080.mp4"
  if need "$hi"; then
    echo "1080    $name"
    ffmpeg -hide_banner -loglevel error -y -i "$in" -map 0:v:0 -map 0:a:0? \
      -vf "$(vf_916 1080),fps=30" -c:v libx264 -preset slow -crf 24 -profile:v high \
      -c:a aac -b:a 128k -ac 2 -movflags +faststart "$hi"
  fi

  poster="$OUT/$name-poster.jpg"
  if need "$poster"; then
    echo "poster  $name"
    ffmpeg -hide_banner -loglevel error -y -ss 0.3 -i "$in" -frames:v 1 \
      -vf "$(vf_916 480)" -q:v 6 "$poster"
  fi
done

for photo in "$ROOT"/assets/stock/*.jpg; do
  name="$(basename "$photo" .jpg)"
  out="$OUT/service-$name.jpg"
  if need "$out"; then
    echo "stock   $name"
    ffmpeg -hide_banner -loglevel error -y -i "$photo" \
      -vf "scale='min(900,iw)':-2:flags=lanczos,hue=s=0,eq=contrast=1.08" -q:v 4 "$out"
  fi
done

cp "$ROOT/assets/igloo-ads-pfp-1080.png" "$OUT/igloo-ads-pfp-1080.png"
if need "$OUT/icon-192.png"; then
  ffmpeg -hide_banner -loglevel error -y -i "$ROOT/assets/igloo-ads-pfp-1080.png" \
    -vf "scale=192:192:flags=lanczos" "$OUT/icon-192.png"
fi

echo "done"
ls -lh "$OUT"
