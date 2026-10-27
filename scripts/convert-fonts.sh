#!/usr/bin/env bash
# Converts fonts in a folder (subfolders too with -r), using fonttools.
# Every source file is converted directly to every output format (except its own), so
# WOFF/WOFF2 made from a TTF keep its TrueType outlines and hinting.
#
# Usage: scripts/convert-fonts.sh [options] [folder]   (folder defaults to the current directory)
#   --sources  LIST   comma-separated source formats: ttf,otf      (default: ttf,otf)
#   --outputs  LIST   comma-separated output formats: otf,woff,woff2 (default: otf,woff,woff2)
#   --out-dir  DIR    write outputs to DIR (created if needed) instead of next to their source
#   -r, --recursive   include subfolders
#   -f, --force       regenerate outputs that already exist
#
# When two sources share a basename (foo.ttf + foo.otf), the first one in --sources wins.
# TTF -> OTF converts the outlines to CFF (unhinted); variable fonts are not supported for it.
#
# Examples:
#   scripts/convert-fonts.sh                                   # ttf -> otf,woff,woff2 ; otf -> woff,woff2
#   scripts/convert-fonts.sh --outputs woff,woff2 --out-dir src/assets/fonts/inter/woff src/assets/fonts/inter/ttf
#   scripts/convert-fonts.sh -r --sources otf --outputs woff2 -f src/assets/fonts

set -euo pipefail

sources="ttf,otf"
outputs="otf,woff,woff2"
out_dir=""
force=0
depth=(-maxdepth 1)
dir="."

usage() { sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit "${1:-0}"; }

while [[ $# -gt 0 ]]; do
  case "$1" in
    --sources|--source) sources="${2:?--sources needs a value}"; shift 2 ;;
    --outputs|--output) outputs="${2:?--outputs needs a value}"; shift 2 ;;
    --out-dir) out_dir="${2:?--out-dir needs a value}"; shift 2 ;;
    -r|--recursive) depth=(); shift ;;
    -f|--force) force=1; shift ;;
    -h|--help) usage ;;
    -*) echo "Unknown option: $1" >&2; usage 1 >&2 ;;
    *) dir="$1"; shift ;;
  esac
done

[[ -d "$dir" ]] || { echo "Not a directory: $dir" >&2; exit 1; }

# Normalize lists: lowercase, commas -> spaces.
sources=$(echo "$sources" | tr '[:upper:],' '[:lower:] ')
outputs=$(echo "$outputs" | tr '[:upper:],' '[:lower:] ')

for s in $sources; do
  case "$s" in ttf|otf) ;; *) echo "Unsupported source format: $s (ttf, otf)" >&2; exit 1 ;; esac
done
for o in $outputs; do
  case "$o" in otf|woff|woff2) ;; *) echo "Unsupported output format: $o (otf, woff, woff2)" >&2; exit 1 ;; esac
done

# Find a Python that has fontTools: the one bundled with the `fonttools` command, else python3.
py=""
fonttools_bin=$(command -v fonttools || true)
for candidate in "${fonttools_bin:+$(head -1 "$fonttools_bin" | sed 's/^#! *//')}" python3; do
  # Unquoted on purpose: a shebang like "/usr/bin/env python3" is two words.
  if [[ -n "$candidate" ]] && $candidate -c 'import fontTools' 2>/dev/null; then
    py="$candidate"
    break
  fi
done
[[ -n "$py" ]] || { echo "Missing dependency: fonttools (brew install fonttools)" >&2; exit 1; }
if [[ " $outputs " == *" woff2 "* ]] && ! $py -c 'import brotli' 2>/dev/null; then
  echo "Missing dependency for woff2: brotli (pip install brotli, in fonttools' Python)" >&2
  exit 1
fi

[[ -n "$out_dir" ]] && mkdir -p "$out_dir"

convert() { # convert <src> <format> <dest>
  $py - "$@" <<'PY'
import sys
from fontTools.ttLib import TTFont

src, fmt, dest = sys.argv[1:]
font = TTFont(src)

if fmt == "otf":
    if "glyf" not in font:
        sys.exit(f"{src}: no TrueType outlines to convert")
    if "fvar" in font:
        sys.exit(f"{src}: variable fonts can't be converted to OTF")

    from fontTools.fontBuilder import FontBuilder
    from fontTools.pens.qu2cuPen import Qu2CuPen
    from fontTools.pens.recordingPen import DecomposingRecordingPen
    from fontTools.pens.t2CharStringPen import T2CharStringPen

    glyph_set = font.getGlyphSet()
    metrics = font["hmtx"].metrics
    char_strings = {}
    for name in font.getGlyphOrder():
        # Decompose components, convert quadratic curves to cubic, and reverse the
        # contour direction (TrueType is clockwise, CFF counter-clockwise).
        recording = DecomposingRecordingPen(glyph_set)
        glyph_set[name].draw(recording)
        pen = T2CharStringPen(metrics[name][0], glyph_set)
        recording.replay(Qu2CuPen(pen, max_err=1.0, all_cubic=True, reverse_direction=True))
        char_strings[name] = pen.getCharString()

    # Drop the TrueType-only tables (outlines, hinting) before building CFF.
    for tag in ("glyf", "loca", "fpgm", "prep", "cvt ", "gasp", "hdmx", "LTSH", "VDMX"):
        if tag in font:
            del font[tag]

    names = font["name"]
    ps_name = names.getDebugName(6) or names.getDebugName(4).replace(" ", "")
    font_info = {
        "FullName": names.getDebugName(4),
        "FamilyName": names.getDebugName(1),
        "version": f'{font["head"].fontRevision:.3f}',
    }
    FontBuilder(font=font).setupCFF(ps_name, font_info, char_strings, {})
    font["maxp"].tableVersion = 0x00005000
    font["post"].formatType = 3.0
else:
    font.flavor = fmt

font.save(dest)
PY
}

# Outputs written during this run ("dest<TAB>source path without extension" lines), so a
# later source doesn't overwrite them (even with -f). A sibling source (foo.otf after
# foo.ttf) is skipped silently; a different file with the same name (two folders writing
# into one --out-dir) gets a warning.
written=$'\n'

for s in $sources; do
  while IFS= read -r -d '' src; do
    stem="${src%.*}"
    base="$stem"
    [[ -n "$out_dir" ]] && base="$out_dir/$(basename "$stem")"
    for o in $outputs; do
      [[ "$o" == "$s" ]] && continue
      dest="$base.$o"
      if [[ "$written" == *$'\n'"$dest"$'\t'* ]]; then
        [[ "$written" == *$'\n'"$dest"$'\t'"$stem"$'\n'* ]] ||
          echo "skip $dest <- $src (name clash: already written in this run)" >&2
        continue
      fi
      [[ $force -eq 0 && -e "$dest" ]] && continue
      echo "$o <- $src"
      convert "$src" "$o" "$dest"
      written+="$dest"$'\t'"$stem"$'\n'
    done
  done < <(find "$dir" ${depth[@]+"${depth[@]}"} -type f -iname "*.$s" -print0)
done
