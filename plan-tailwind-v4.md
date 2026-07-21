# Plan: Tailwind CSS v4 (npm package, CLI approach)

## Context

The project uses a custom Node.js build pipeline. `sass.js` compiles all SCSS into `dist-build/src/main.css` in two phases: global styles first (`writeFileSync`), then feature component/view SCSS appended (`appendFileSync`).

**Goal**: add a `tailwind.js` step in `tools/builder/core/` that runs *after* `sass.js`, generates Tailwind v4 utilities for classes found in source files, and prepends the output to the same `main.css`.

**Single dependency**: The `tailwindcss` npm package ships its own CLI binary — no `postcss` or `@tailwindcss/postcss` needed. We shell out to `node_modules/.bin/tailwindcss` exactly like the v3 standalone binary plan, but versioned through `package.json` instead of a downloaded binary.

**Why SASS wins automatically**: Tailwind v4 emits all styles inside CSS `@layer` blocks. CSS layers always lose to unlayered CSS in the cascade, regardless of file order. Existing SCSS is unlayered, so **SASS overrides Tailwind for any collision**. Only Tailwind classes with the `!` prefix (e.g. `!bg-red-500`, which emits `!important`) can beat SCSS — the intended escape hatch.

---

## New npm package

```
tailwindcss  ^4.x  (core engine + bundled CLI)
```

```bash
npm install -D tailwindcss
```

---

## Critical files

| File | Action |
|---|---|
| `src/styles/tailwind.css` | **Create** — Tailwind CSS entry (plain CSS, not SCSS) |
| `tools/builder/core/tailwind.js` | **Create** — new build step |
| `tools/builder/builder.js` | **Modify** — insert `tailwind.js` after `sass.js` |
| `package.json` | **Modify** — add 1 devDependency |

No changes to `sass.js`, any `.scss` file, `builder.config.js`, or `validate-html.js`.

---

## Step 1 — `src/styles/tailwind.css` (new file)

```css
@import "tailwindcss";
```

> Swap `"tailwindcss"` for `"tailwindcss/utilities"` to skip Tailwind's `@layer base` preflight entirely.
> The project already has its own reset in `_styles.scss`; with `@layer`, SCSS wins anyway, but skipping avoids generating dead CSS.

---

## Step 2 — `tools/builder/core/tailwind.js` (new file)

```js
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { print, isVerbose, isProd } from '../../utils/index.js';
import { PATHS } from './paths.js';

const twBin   = path.join(process.cwd(), 'node_modules', '.bin', 'tailwindcss');
const input   = path.join(PATHS.source, 'styles', 'tailwind.css');
const output  = path.join(PATHS.tempSource, 'tw-out.css');
const mainCss = path.join(PATHS.tempSource, 'main.css');

const args = ['-i', input, '-o', output];
if (isProd) args.push('--minify');

execFileSync(twBin, args, { stdio: isVerbose ? 'inherit' : 'pipe' });

// Prepend Tailwind's @layer blocks before unlayered SCSS output.
// Source order doesn't affect who wins (layers always lose to unlayered),
// but prepending keeps the file logically ordered: reset → utilities → overrides.
const tailwindCss = fs.readFileSync(output, 'utf-8');
const existingCss = fs.readFileSync(mainCss, 'utf-8');
fs.writeFileSync(mainCss, tailwindCss + '\n' + existingCss);
fs.unlinkSync(output);

if (isVerbose) print.boldInfo('Tailwind CSS processed.\n');
```

**Key details:**
- `--minify` in prod matches the `style: 'compressed'` behaviour of `sass.js`.
- Tailwind v4's CLI auto-scans the project tree from `cwd()` (respecting `.gitignore`), detecting class names in `.html` and `.ts` files — no `content` config needed.
- Intermediate `tw-out.css` is deleted after merging.

---

## Step 3 — `tools/builder/builder.js` (one line added)

```js
runScript(path.join(scriptsDir, 'sass.js'),          'Compiling styles from main.scss...');
runScript(path.join(scriptsDir, 'tailwind.js'),       'Processing Tailwind CSS...');       // ← add
runScript(path.join(scriptsDir, 'validate-html.js'), 'Adding and validating tags in index.html...');
```

---

## Cascade behaviour

| Scenario | Winner | Reason |
|---|---|---|
| Tailwind utility (`flex`) vs SCSS rule | **SCSS** | `@layer utilities` loses to unlayered CSS |
| Tailwind preflight (`@layer base`) vs SCSS reset | **SCSS** | Same — also suppressible via `tailwindcss/utilities` |
| `!`-prefixed Tailwind (`!flex`, `!p-4`) vs SCSS | **Tailwind** | `!important` overrides everything |

---

## Developer rule

Always write complete class names in templates:
- `text-red-500` ✓ — detected by Tailwind's content scanner
- `` `text-${color}-500` `` ✗ — not detected; class will not be emitted

Use the `!` prefix only when a utility must override an existing SCSS rule.

---

## Verification

1. `npm install` — `tailwindcss` installs; `node_modules/.bin/tailwindcss` binary is present.
2. `npm run build` — "Processing Tailwind CSS…" step appears in output; no errors.
3. Add `flex gap-4` to any component template. Rebuild. Open `dist-build/src/main.css` — utilities appear inside `@layer utilities { … }` at the top of the file.
4. Open in browser — layout reflects the utility classes.
5. Add an SCSS rule targeting the same property (no `!important`). Confirm SCSS wins.
6. Use `!flex` alongside an SCSS `display` rule. Confirm Tailwind wins.
7. `npm run build:prod` — `--minify` is passed to the Tailwind CLI; output is minified; hash + gzip steps are unaffected.
