#!/usr/bin/env bash
# render.sh — Render a dual-themed HTML template to a transparent PNG.
#
# Usage:
#   render.sh <template.html> <out.png> [theme] [width] [height] [dpr]
#
# Args:
#   template.html  Absolute path to a dual-themed HTML template.
#   out.png        Absolute path for the output PNG.
#   theme          'light' (default) or 'dark'. Appended to URL as ?theme=...
#   width          Viewport width in CSS px (default 1500).
#   height         Viewport height in CSS px (default 900). Tune to crop bottom whitespace.
#   dpr            Device pixel ratio (default 2). Set to 1 only if you have a specific reason.
#
# Notes:
#   - Defaults to dpr=2 so output PNG is retina-sharp. A 1500×900 viewport → 3000×1800 PNG.
#     This costs ~3× file size but eliminates the bilinear-upscale blur that happens when a 1×
#     PNG is displayed on a retina screen. The blog reader almost always has a retina display.
#   - Uses Chrome's --default-background-color=00000000 to produce a true alpha-channel PNG.
#   - Loads the template via file:// — no dev server needed.
#   - The template must read the ?theme= query param and set <html data-theme="...">.

set -euo pipefail

TEMPLATE="${1:?missing template path}"
OUT="${2:?missing output path}"
THEME="${3:-light}"
WIDTH="${4:-1500}"
HEIGHT="${5:-900}"
DPR="${6:-2}"

if [[ ! -f "$TEMPLATE" ]]; then
  echo "Template not found: $TEMPLATE" >&2
  exit 1
fi

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [[ ! -x "$CHROME" ]]; then
  # Try common alternatives
  for cand in \
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary" \
    "/Applications/Chromium.app/Contents/MacOS/Chromium" \
    "$(command -v google-chrome 2>/dev/null)" \
    "$(command -v chromium 2>/dev/null)"; do
    if [[ -x "$cand" ]]; then CHROME="$cand"; break; fi
  done
fi

URL="file://${TEMPLATE}?theme=${THEME}"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --default-background-color=00000000 \
  --hide-scrollbars \
  --force-device-scale-factor="${DPR}" \
  --window-size="${WIDTH},${HEIGHT}" \
  --screenshot="$OUT" \
  "$URL" 2>&1 | tail -1
