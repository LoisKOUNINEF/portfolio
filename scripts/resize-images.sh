#!/usr/bin/env bash
# Writes smaller copies of images in a folder (subfolders too with -r), next to each source,
# for srcset: foo.jpg -> foo-640w.{jpg,webp,avif}, foo-1080w.{jpg,webp,avif}.
# Each width is resized once to a lossless PNG, then encoded to every output format.
#
# Usage: scripts/resize-images.sh [options] [folder]   (folder defaults to the current directory)
#   --widths   LIST   comma-separated widths in px            (default: 640,1080)
#   --sources  LIST   comma-separated source formats: png,jpg (default: jpg,png; jpg includes .jpeg)
#   --outputs  LIST   comma-separated output formats: jpg,webp,avif (default: jpg,webp,avif)
#   -r, --recursive   include subfolders
#   -f, --force       regenerate outputs that already exist
#
# Never upscales: when a source isn't wider than a width, that width's files are copies of the
# full-size foo.<format> (encoded from the source when that file doesn't exist).
# Files already named *-<n>w.* are never used as sources. When two sources share a basename
# (foo.jpg + foo.png), the first one in --sources wins.
#
# Examples:
#   scripts/resize-images.sh -r src/assets/images
#   scripts/resize-images.sh --widths 480,960 --outputs webp,avif src/assets/images/projects

set -euo pipefail

widths="640,1080"
sources="jpg,png"
outputs="jpg,webp,avif"
force=0
depth=(-maxdepth 1)
dir="."

usage() { sed -n '2,21p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --widths|--width) widths="${2:?--widths needs a value}"; shift 2 ;;
    --sources|--source) sources="${2:?--sources needs a value}"; shift 2 ;;
    --outputs|--output) outputs="${2:?--outputs needs a value}"; shift 2 ;;
    -r|--recursive) depth=(); shift ;;
    -f|--force) force=1; shift ;;
    -h|--help) usage ;;
    -*) echo "Unknown option: $1" >&2; usage 1 >&2 ;;
    *) dir="$1"; shift ;;
  esac
done

[[ -d "$dir" ]] || { echo "Not a directory: $dir" >&2; exit 1; }

# Normalize lists: lowercase, commas -> spaces, jpeg -> jpg.
normalize() {
  local f out=""
  for f in $(echo "$1" | tr '[:upper:],' '[:lower:] '); do
    [[ "$f" == jpeg ]] && f=jpg
    out+="$f "
  done
  echo "$out"
}
sources=$(normalize "$sources")
outputs=$(normalize "$outputs")
widths=$(echo "$widths" | tr ',' ' ')

for w in $widths; do
  [[ "$w" =~ ^[1-9][0-9]*$ ]] || { echo "Invalid width: $w (a positive integer, in px)" >&2; exit 1; }
done
for s in $sources; do
  case "$s" in png|jpg) ;; *) echo "Unsupported source format: $s (png, jpg)" >&2; exit 1 ;; esac
done

# Resizing and JPG encoding: sips (macOS), else ImageMagick 7 (magick) or 6 (convert).
img_tool=""
for t in sips magick convert; do
  command -v "$t" >/dev/null && { img_tool="$t"; break; }
done
[[ -n "$img_tool" ]] || { echo "Missing dependency for resizing: sips, magick or convert (ImageMagick)" >&2; exit 1; }

for o in $outputs; do
  case "$o" in
    jpg)  tool="$img_tool" ;;
    webp) tool=cwebp ;;
    avif) tool=avifenc ;;
    *) echo "Unsupported output format: $o (jpg, webp, avif)" >&2; exit 1 ;;
  esac
  command -v "$tool" >/dev/null || { echo "Missing dependency for $o: $tool" >&2; exit 1; }
done

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

source_width() { # source_width <src>
  if [[ "$img_tool" == sips ]]; then
    sips -g pixelWidth "$1" | awk '/pixelWidth/ { print $2 }'
  else
    "$img_tool" identify -format '%w' "$1" 2>/dev/null || identify -format '%w' "$1"
  fi
}

resize_to_png() { # resize_to_png <src> <width> <dest.png>; width is never above the source's
  if [[ "$img_tool" == sips ]]; then
    sips -s format png --resampleWidth "$2" "$1" --out "$3" >/dev/null
  else
    "$img_tool" "$1" -resize "$2x" "$3"
  fi
}

encode() { # encode <png> <format> <dest>
  case "$2" in
    jpg)
      if [[ "$img_tool" == sips ]]; then
        sips -s format jpeg -s formatOptions 85 "$1" --out "$3" >/dev/null
      else
        # Fill transparency with white, like sips does.
        "$img_tool" "$1" -background white -alpha remove -alpha off -quality 85 "$3"
      fi
      ;;
    webp) cwebp -quiet -q 80 "$1" -o "$3" ;;
    avif) avifenc -q 40 "$1" "$3" >/dev/null ;;
  esac
}

# Stems handled during this run, so a later source with the same basename is skipped.
done_stems=$'\n'

for s in $sources; do
  if [[ "$s" == jpg ]]; then
    pattern=(\( -iname '*.jpg' -o -iname '*.jpeg' \))
  else
    pattern=(-iname "*.$s")
  fi

  while IFS= read -r -d '' src; do
    base="${src%.*}"
    # Variants written by this script are not sources.
    [[ "$base" =~ -[0-9]+w$ ]] && continue
    [[ "$done_stems" == *$'\n'"$base"$'\n'* ]] && continue
    done_stems+="$base"$'\n'

    src_width=""
    for w in $widths; do
      png=""
      for o in $outputs; do
        dest="$base-${w}w.$o"
        [[ $force -eq 0 && -e "$dest" ]] && continue
        [[ -n "$src_width" ]] || src_width=$(source_width "$src")
        # Not narrower than the source: same pixels as the full-size file of that format,
        # so copy it rather than re-encode (which could only lose quality or add bytes).
        if (( w >= src_width )) && [[ -e "$base.$o" ]]; then
          echo "$o ${w}w <- $base.$o (copy: source is ${src_width}px wide)"
          cp "$base.$o" "$dest"
          continue
        fi
        if [[ -z "$png" ]]; then
          png="$tmp/resized.png"
          resize_to_png "$src" "$(( w < src_width ? w : src_width ))" "$png"
        fi
        echo "$o ${w}w <- $src"
        encode "$png" "$o" "$dest"
      done
    done
  done < <(find "$dir" ${depth[@]+"${depth[@]}"} -type f "${pattern[@]}" -print0)
done
