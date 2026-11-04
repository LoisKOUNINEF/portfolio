# Convert assets

Two Bash scripts convert the site's assets into web formats:

| Script | Converts |
|---|---|
| `scripts/convert-images.sh` | PNG, JPG → JPG, WebP, AVIF |
| `scripts/convert-fonts.sh` | TTF, OTF → OTF, WOFF, WOFF2 |

Both work the same way:

- Each source file is converted **directly** to every requested output format (never through an intermediate format), so no quality is lost along the way.
- Outputs that already exist are **skipped**, so a second run only converts new files. Use `-f` to regenerate them.
- Source files are never modified or deleted.
- Only the given folder is scanned; `-r` includes its subfolders.
- Each conversion prints one line (`webp <- path/to/source.jpg`). Errors go to stderr, and the script stops at the first failure with a non-zero exit code.

They run on macOS and Linux (tested on macOS and Ubuntu 24.04), with Bash 3.2 or later.

## Installation

### macOS (Homebrew)

```bash
brew install webp libavif   # images: cwebp, avifenc (sips, for JPG, comes with macOS)
brew install fonttools      # fonts: fonttools + brotli (needed for WOFF2)
```

### Ubuntu / Debian (24.04 or later)

```bash
sudo apt install webp libavif-bin imagemagick   # images: cwebp, avifenc, convert (for JPG)
sudo apt install python3-fonttools python3-brotli   # fonts
```

The `python3-fonttools` package installs the library but no `fonttools` command; the script then uses `python3` directly, so nothing else is needed.

### Making the scripts executable

They are executable, and git keeps that bit once they're committed. If it gets lost (e.g. after copying them, or on a mount that doesn't allow running files), either restore it or call them through `bash`:

```bash
chmod +x scripts/*.sh
bash scripts/convert-images.sh --help
```

## Images: `convert-images.sh`

```
scripts/convert-images.sh [options] [folder]
```

### Arguments and options

| Option | Required | Default | Values | Description |
|---|---|---|---|---|
| `folder` | No | `.` (current directory) | Path to a folder | Folder to scan for source images. Outputs are written next to their source. |
| `--sources LIST` (alias `--source`) | No | `png,jpg` | Comma-separated: `png`, `jpg` | Source formats to convert. `jpg` also matches `.jpeg`. Case-insensitive (`.PNG` matches). |
| `--outputs LIST` (alias `--output`) | No | `jpg,webp,avif` | Comma-separated: `jpg`, `webp`, `avif` | Formats to generate from each source. A source is never converted to its own format. |
| `-r`, `--recursive` | No | Off | — | Also scan subfolders, at any depth. |
| `-f`, `--force` | No | Off | — | Regenerate outputs that already exist. |
| `-h`, `--help` | No | — | — | Print the usage and exit. |

Options and the folder can be given in any order. Unknown options and unsupported formats stop the script before anything is converted.

### Conversions

With the defaults:

| Source | Generates |
|---|---|
| `foo.png` | `foo.jpg`, `foo.webp`, `foo.avif` |
| `foo.jpg` / `foo.jpeg` | `foo.webp`, `foo.avif` |

### Encoders and quality

| Output | Encoder | Settings | Notes |
|---|---|---|---|
| JPG | `sips` (macOS), else ImageMagick `magick` (v7) or `convert` (v6) | Quality 85 | JPG has no transparency: transparent pixels are filled with **white**. |
| WebP | `cwebp` | `-q 80` | Keeps PNG transparency. |
| AVIF | `avifenc` | `-q 40` | Keeps PNG transparency. Needs libavif 1.0+. |

Only the encoders for the requested outputs need to be installed: `--outputs webp` works without `avifenc`.

### Name clashes

If `foo.png` and `foo.jpg` are in the same folder, both would produce `foo.webp` and `foo.avif`. The source format listed **first** in `--sources` wins (PNG by default), and the other is skipped for those outputs, even with `-f`.

### Examples

```bash
# Every image in src/assets/images and its subfolders, with the defaults
scripts/convert-images.sh -r src/assets/images

# Only the current directory
cd src/assets/images/projects && ../../../../scripts/convert-images.sh

# Transparent PNGs: WebP + AVIF only (no JPG, which would lose transparency)
scripts/convert-images.sh --sources png --outputs webp,avif src/assets/images/projects

# Regenerate every AVIF from the JPGs (e.g. after changing the quality)
scripts/convert-images.sh -r -f --sources jpg --outputs avif src/assets/images

# Prefer the JPG over a same-named PNG as the source
scripts/convert-images.sh --sources jpg,png src/assets/images
```

## Fonts: `convert-fonts.sh`

```
scripts/convert-fonts.sh [options] [folder]
```

### Arguments and options

| Option | Required | Default | Values | Description |
|---|---|---|---|---|
| `folder` | No | `.` (current directory) | Path to a folder | Folder to scan for source fonts. |
| `--sources LIST` (alias `--source`) | No | `ttf,otf` | Comma-separated: `ttf`, `otf` | Source formats to convert. Case-insensitive. |
| `--outputs LIST` (alias `--output`) | No | `otf,woff,woff2` | Comma-separated: `otf`, `woff`, `woff2` | Formats to generate from each source. A source is never converted to its own format. |
| `--out-dir DIR` | No | Next to each source | Path to a folder | Write all outputs to `DIR` (created if missing) instead of next to their source. |
| `-r`, `--recursive` | No | Off | — | Also scan subfolders, at any depth. |
| `-f`, `--force` | No | Off | — | Regenerate outputs that already exist. |
| `-h`, `--help` | No | — | — | Print the usage and exit. |

Options and the folder can be given in any order. Unknown options and unsupported formats stop the script before anything is converted.

### Conversions

With the defaults:

| Source | Generates |
|---|---|
| `foo.ttf` | `foo.otf`, `foo.woff`, `foo.woff2` |
| `foo.otf` | `foo.woff`, `foo.woff2` |

All conversions use fonttools.

| Output | How | Notes |
|---|---|---|
| WOFF | Compressed wrapper (zlib) around the source font | Lossless: same outlines, hinting and tables as the source. |
| WOFF2 | Compressed wrapper (Brotli) around the source font | Lossless. Needs `brotli`. The smallest format; the one to serve on the web. |
| OTF (from TTF) | Outlines converted from TrueType (quadratic) to CFF (cubic) curves | Shapes are kept (within 1 font unit), but **TrueType hinting is dropped** and the OTF is unhinted. Variable fonts are refused. |

Because each output is made from the source directly, WOFF/WOFF2 made from a TTF keep its hinting. A WOFF2 made from the TTF is also smaller than one made from the generated OTF (about 24 KB vs. 28 KB for Inter Regular).

### Name clashes

- If `foo.ttf` and `foo.otf` are in the same folder, the source format listed **first** in `--sources` wins (TTF by default), silently. In particular, an OTF generated from a TTF during a run is not converted again.
- With `--out-dir` and `-r`, two folders can contain fonts with the same file name. The first one found is converted, and the next is skipped with a `skip … (name clash …)` warning on stderr.

### Examples

```bash
# The project's layout: TTFs in <family>/ttf/, web fonts in <family>/woff/
scripts/convert-fonts.sh --outputs woff,woff2 \
  --out-dir src/assets/fonts/inter/woff src/assets/fonts/inter/ttf

# Every TTF/OTF under src/assets/fonts, outputs next to each source, with the defaults
scripts/convert-fonts.sh -r src/assets/fonts

# OTF versions only (e.g. for installing on a desktop)
scripts/convert-fonts.sh --sources ttf --outputs otf --out-dir ~/Desktop/inter-otf src/assets/fonts/inter/ttf

# Regenerate every WOFF2 from OTF sources
scripts/convert-fonts.sh -r -f --sources otf --outputs woff2 src/assets/fonts
```

## Troubleshooting

| Message | Cause | Fix |
|---|---|---|
| `Missing dependency for jpg: sips, magick or convert (ImageMagick)` | No JPG encoder found (Linux) | `sudo apt install imagemagick`, or leave `jpg` out of `--outputs` |
| `Missing dependency for webp: cwebp` | WebP tools not installed | `brew install webp` / `sudo apt install webp` |
| `Missing dependency for avif: avifenc` | libavif tools not installed | `brew install libavif` / `sudo apt install libavif-bin` |
| `avifenc` error about `-q` | libavif older than 1.0 | Unsupported distribution |
| `Missing dependency: fonttools` | fonttools not found by `fonttools` nor `python3` | `brew install fonttools` / `sudo apt install python3-fonttools` |
| `Missing dependency for woff2: brotli` | fonttools installed without Brotli | `sudo apt install python3-brotli`, or `pip install "fonttools[woff]"` |
| `No module named 'fontTools.pens.qu2cuPen'` | fonttools older than 4.39 (OTF output) | Unsupported distribution |
| `variable fonts can't be converted to OTF` | The TTF is a variable font | Leave `otf` out of `--outputs`; WOFF/WOFF2 work |
| `Not a directory: …` | The folder argument doesn't exist | Check the path (relative paths are from the current directory) |
| `Permission denied` | The script lost its executable bit | `chmod +x scripts/*.sh`, or run it with `bash` |
