#!/usr/bin/env bash
# Converts images in a folder (subfolders too with -r), writing each output next to its source.
# Every source file is converted directly to every output format (except its own), so
# PNG transparency is kept in WebP/AVIF.
#
# Usage: scripts/convert-images.sh [options] [folder]   (folder defaults to the current directory)
#   --sources  LIST   comma-separated source formats: png,jpg   (default: png,jpg; jpg includes .jpeg)
#   --outputs  LIST   comma-separated output formats: jpg,webp,avif (default: jpg,webp,avif)
#   -r, --recursive   include subfolders
#   -f, --force       regenerate outputs that already exist
#
# When two sources share a basename (foo.png + foo.jpg), the first one in --sources wins.
#
# Examples:
#   scripts/convert-images.sh                                  # png -> jpg,webp,avif ; jpg -> webp,avif
#   scripts/convert-images.sh --sources png --outputs webp,avif
#   scripts/convert-images.sh --sources jpg --outputs avif -f src/assets/images/projects
#   scripts/convert-images.sh -r src/assets/images

set -euo pipefail

sources="png,jpg"
outputs="jpg,webp,avif"
force=0
depth=(-maxdepth 1)
dir="."

usage() { sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
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

for s in $sources; do
  case "$s" in png|jpg) ;; *) echo "Unsupported source format: $s (png, jpg)" >&2; exit 1 ;; esac
done
# JPG encoder: sips (macOS), else ImageMagick 7 (magick) or 6 (convert, e.g. Ubuntu's apt package).
jpg_tool=""
for t in sips magick convert; do
  command -v "$t" >/dev/null && { jpg_tool="$t"; break; }
done

for o in $outputs; do
  case "$o" in
    jpg)  tool="${jpg_tool:-sips, magick or convert (ImageMagick)}" ;;
    webp) tool=cwebp ;;
    avif) tool=avifenc ;;
    *) echo "Unsupported output format: $o (jpg, webp, avif)" >&2; exit 1 ;;
  esac
  command -v "${tool%% *}" >/dev/null || { echo "Missing dependency for $o: $tool" >&2; exit 1; }
done

# Outputs written during this run, so a later source doesn't overwrite them (even with -f).
written=$'\n'

# Not named `convert`: that would shadow ImageMagick 6's command.
convert_file() { # convert_file <src> <format> <dest>
  case "$2" in
    jpg)
      if [[ "$jpg_tool" == sips ]]; then
        sips -s format jpeg -s formatOptions 85 "$1" --out "$3" >/dev/null
      else
        # Fill transparency with white, like sips does.
        "$jpg_tool" "$1" -background white -alpha remove -alpha off -quality 85 "$3"
      fi
      ;;
    webp) cwebp -quiet -q 80 "$1" -o "$3" ;;
    avif) avifenc -q 40 "$1" "$3" >/dev/null ;;
  esac
}

for s in $sources; do
  if [[ "$s" == jpg ]]; then
    pattern=(\( -iname '*.jpg' -o -iname '*.jpeg' \))
  else
    pattern=(-iname "*.$s")
  fi

  while IFS= read -r -d '' src; do
    base="${src%.*}"
    for o in $outputs; do
      [[ "$o" == "$s" ]] && continue
      dest="$base.$o"
      [[ "$written" == *$'\n'"$dest"$'\n'* ]] && continue
      [[ $force -eq 0 && -e "$dest" ]] && continue
      echo "$o <- $src"
      convert_file "$src" "$o" "$dest"
      written+="$dest"$'\n'
    done
  done < <(find "$dir" ${depth[@]+"${depth[@]}"} -type f "${pattern[@]}" -print0)
done
