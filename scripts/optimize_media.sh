#!/usr/bin/env bash
# Generates web-ready media from the originals in assets/.
# Originals are only read, never modified. Output goes to public/media/.
#
# Per reel video:
#   <name>-card.mp4      640px wide, muted, H.264 crf 26, faststart (grid cards)
#   <name>-1080.mp4      up to 1080px wide, with audio, H.264 crf 24, faststart (lightbox)
#   <name>-poster.jpg    poster frame, 640px wide
# Per still source:
#   still-<name>.jpg     frame grab used for photo placeholders
# Logos:
#   logos/<name>.png     copied from assets/logos/wall
#
# Usage: scripts/optimize_media.sh [--force]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/assets/videos"
OUT="$ROOT/public/media"
FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

command -v ffmpeg >/dev/null || { echo "ffmpeg is required" >&2; exit 1; }

mkdir -p "$OUT" "$OUT/logos"

# Videos shown as reels (portrait 9:16).
REELS=(IMG_7724 IMG_7725 IMG_7728 IMG_7729 IMG_7730 IMG_7733)

# Frame grabs for photo placeholders: "<video>:<seconds>:<output name>"
STILLS=(
  "IMG_7731:1.0:set-1"
  "IMG_7731:6.0:set-2"
  "IMG_7725:9.0:set-3"
  "IMG_7730:7.0:set-4"
  "IMG_7729:2.0:service-reels"
  "IMG_7731:3.5:service-ugc"
  "IMG_7733:3.0:service-shoots"
)

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
      -vf "$(vf_916 640)" -q:v 4 "$poster"
  fi
done

for spec in "${STILLS[@]}"; do
  IFS=: read -r vid t outname <<<"$spec"
  out="$OUT/still-$outname.jpg"
  if need "$out"; then
    echo "still   $outname"
    ffmpeg -hide_banner -loglevel error -y -ss "$t" -i "$SRC/$vid.mp4" -frames:v 1 \
      -vf "scale='min(1200,iw)':-2:flags=lanczos" -q:v 4 "$out"
  fi
done

cp "$ROOT"/assets/logos/wall/*.png "$OUT/logos/"
cp "$ROOT/assets/igloo-ads-pfp-1080.png" "$OUT/igloo-ads-pfp-1080.png"

echo "done"
ls -lh "$OUT"
