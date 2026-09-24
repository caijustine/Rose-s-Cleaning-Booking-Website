#!/bin/sh
# One-time image optimizer: turns the original photos in images/ into
# web-sized WebP files in src/assets/img/ (800px and 1600px wide).
# Requires cwebp (brew install webp). Re-run after adding new photos.
set -e
cd "$(dirname "$0")/.."
out=src/assets/img
mkdir -p "$out"
for f in images/IMG_*.JPG; do
  name=$(basename "$f" .JPG | tr '[:upper:]' '[:lower:]' | tr '_' '-')
  for w in 800 1600; do
    cwebp -quiet -q 78 -resize "$w" 0 -metadata none "$f" -o "$out/$name-$w.webp"
  done
done
# Owner portrait: cropped to a 4:5 head-and-shoulders frame
sips --cropToHeightWidth 1450 1160 --cropOffset 60 360 images/owner-rose.jpg --out /tmp/owner-rose-crop.jpg >/dev/null
for w in 800 1600; do
  cwebp -quiet -q 82 -resize "$w" 0 -metadata none /tmp/owner-rose-crop.jpg -o "$out/owner-rose-$w.webp"
done
# Social share image (1200x630 JPG, cropped from the kitchen photo)
sips -s format jpeg -s formatOptions 82 --resampleWidth 1200 images/IMG_0617.JPG --out "$out/og-image.jpg" >/dev/null
sips --cropToHeightWidth 630 1200 "$out/og-image.jpg" >/dev/null
cwebp -quiet -q 85 -resize 600 0 images/rose-illustration.png -o "$out/rose-illustration.webp"
cp favicon.png "$out/../favicon.png"
