# PictureComponent — Refactor Plan

## 1. Problem statement

`PictureComponent` hard-codes three format assumptions directly in the template, making it
impossible to use without a specific file-naming convention:

```html
<source srcset="${_config.imageSrc}.avif" type="image/avif"/>
<source srcset="${_config.imageSrc}.webp" type="image/webp"/>
<img src="${_config.imageSrc}.jpg" alt="${_config.imageAlt}"/>
```

Additional problems:

| Issue | Detail |
|---|---|
| Hardcoded formats + order | Always avif → webp → jpg. No way to use png, gif, mp4 poster, full URLs, or a different priority order. |
| `imageAlt` naming | Inconsistent with the HTML spec attribute name `alt`. |
| No `width` / `height` | Browser cannot reserve space before the image loads → Cumulative Layout Shift (CLS). |
| No `loading` attribute | Missed `loading="lazy"` — every image eagerly loads. |
| No `decoding="async"` | Image decoding blocks the main thread. |
| No decorative support | No way to communicate `alt=""` + `aria-hidden` for purely decorative images. |
| No art direction | No way to pass a `media` query on a source (e.g. different crop for mobile). |
| Redundant `<div>` wrapper | The component element is a `<div>` wrapping a `<figure>` — one extra layer with no semantic value. |

---

## 2. Goal

Refactor `PictureComponent` into a **stateless** component that:

1. Accepts an explicit array of 1–N `IPictureSource` objects. Each source carries its full URL
   and MIME type — the consumer controls format choice, order, and paths.
2. Fulfils accessibility requirements for both meaningful and decorative images.
3. Provides performance defaults (`loading="lazy"`, `decoding="async"`) while letting callers
   override them.
4. Eliminates the `<div>` wrapper by using `tagName: 'figure'` so the component element itself
   is the `<figure>`.
5. Is a breaking change — all four callers are migrated as part of the same change.

"Stateless" means: given the same config, every `render()` call produces identical DOM. No
internal flags, no mutable instance fields beyond the `config` inherited from `Component`.

---

## 3. Interfaces

### 3.1 `IPictureSource`

```typescript
export interface IPictureSource {
  src: string;      // Full URL or path, including file extension
  type: string;     // MIME type — 'image/avif' | 'image/webp' | 'image/jpeg' | etc.
  media?: string;   // Optional media query for art direction: '(max-width: 768px)'
  sizes?: string;   // Optional sizes descriptor for resolution switching
  srcset?: string;  // Replaces src for multi-resolution srcset syntax
}
```

When `srcset` is absent, the `src` value is used as the `srcset` attribute on `<source>`.
This covers the common single-resolution case without extra verbosity.

### 3.2 `IPictureConfig`

```typescript
export interface IPictureConfig {
  sources: [IPictureSource, ...IPictureSource[]]; // At least one source — TypeScript enforced
  fallback: string;                               // <img src>; most compatible format URL
  alt: string;                                    // Alt text; '' for decorative images
  width?: number;                                 // Intrinsic width in px — prevents CLS
  height?: number;                                // Intrinsic height in px — prevents CLS
  loading?: 'lazy' | 'eager';                    // Default: 'lazy'
  decoding?: 'async' | 'sync' | 'auto';         // Default: 'async'
  captionI18nKey?: string;
  caption?: string;
}
```

**Removed from `IPictureConfig`:**
- `imageSrc` — replaced by `sources` + `fallback`.
- `imageAlt` — renamed to `alt` (matches the HTML attribute; shorter).

**Why a tuple type for `sources`?**  
`[IPictureSource, ...IPictureSource[]]` enforces at least one element at compile time. An empty
`sources` array would produce a `<picture>` with no `<source>` elements, defeating the purpose
of the component.

---

## 4. Accessibility

### 4.1 Meaningful images (`alt` is non-empty)

- `alt` is rendered on `<img>`. Describes the image content to screen readers.
- `width` + `height` prevent layout shift — browsers reserve space before the image loads,
  which avoids disorienting jumps for users relying on zoom or magnification.
- `<figure>` / `<figcaption>` provide semantic grouping. AT announces "figure" and reads the
  caption as associated content.

### 4.2 Decorative images (`alt === ''`)

When `alt` is empty string **and** no caption is provided, the image is purely decorative
(e.g. background texture, illustration that repeats information already in surrounding text).
In this case the `<figure>` itself must be hidden from AT to prevent an "unlabelled figure"
announcement.

The component sets `aria-hidden="true"` on its element (`this.element`, which is the
`<figure>`) in `onBeforeRender()`:

```
isDecorative = alt === '' AND no captionI18nKey AND no caption
if isDecorative → this.element.setAttribute('aria-hidden', 'true')
else            → this.element.removeAttribute('aria-hidden')
```

The `removeAttribute` branch matters for re-renders where config could theoretically change.

**When caption is present with `alt=""`:**  
This means the caption *is* the accessible description (the image's meaning is conveyed through
the caption text). In this case the `<figure>` stays visible to AT; the `<figcaption>` text
is announced. `aria-hidden` is NOT set. The `<img alt="">` still correctly signals to AT that
the image itself has no additional description.

### 4.3 `<source>` elements have no `alt`

`<source>` elements do not accept `alt` — accessibility is entirely handled by `<img alt>`.
`type` and `media` on `<source>` are not announced to AT.

### 4.4 Loading performance and accessibility

`loading="lazy"` defers off-screen images, reducing data usage for users on slow connections.
`decoding="async"` prevents the image decode from blocking the main thread, keeping the page
responsive during navigation — important for users who rely on reduced-motion or have low
processing power.

Hero images above the fold must use `loading="eager"` so they are not deferred (deferred
hero images degrade LCP and can cause a visible blank slot on first paint).

---

## 5. Template (`picture.component.html`)

The `<figure>` is removed from the template — it is now the component element itself
(`tagName: 'figure'`). The template contains only the children:

```html
<picture>
	${_config.sources.map(s => `<source srcset="${s.srcset ?? s.src}" type="${s.type}"${s.media ? ` media="${s.media}"` : ''}${s.sizes ? ` sizes="${s.sizes}"` : ''}>`).join('\n\t')}
	<img
		src="${_config.fallback}"
		alt="${_config.alt}"
		${_config.width ? `width="${_config.width}"` : ''}
		${_config.height ? `height="${_config.height}"` : ''}
		loading="${_config.loading ?? 'lazy'}"
		decoding="${_config.decoding ?? 'async'}"
	/>
</picture>
<figcaption data-optional="${_config.captionI18nKey || _config.caption}" data-i18n="${_config.captionI18nKey}" data-pipe="capitalize">${_config.caption || ''}</figcaption>
```

**Notes:**
- `data-optional` on `<figcaption>`: the framework's `DomHelper.cleanupOptionalContent()` will
  remove it from the DOM when both `captionI18nKey` and `caption` are absent, matching current
  behaviour.
- `${_config.width ? \`width="..."\` : ''}` produces an empty string (no attribute) when `width`
  is not provided. This is correct — omitting `width`/`height` is valid HTML; setting them to
  `undefined` or `0` would not be.
- Source elements are self-closing (`>` not `/>`) for HTML5 compliance.

---

## 6. Component class

```typescript
import { Component, ComponentProps } from '../../../../core/index.js';

export interface IPictureSource {
  src: string;
  type: string;
  media?: string;
  sizes?: string;
  srcset?: string;
}

export interface IPictureConfig {
  sources: [IPictureSource, ...IPictureSource[]];
  fallback: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  captionI18nKey?: string;
  caption?: string;
}

const templateFn = (_config: IPictureConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class PictureComponent extends Component<HTMLElement, IPictureConfig> {
  constructor(mountTarget: HTMLElement, config: IPictureConfig, props?: ComponentProps) {
    super({ templateFn, mountTarget, config, tagName: 'figure', props });
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    const isDecorative =
      this.config.alt === '' &&
      !this.config.caption &&
      !this.config.captionI18nKey;
    if (isDecorative) {
      this.element.setAttribute('aria-hidden', 'true');
    } else {
      this.element.removeAttribute('aria-hidden');
    }
  }
}
```

`super.onBeforeRender()` calls `Component.applyProps()` (applies `className`, `style`, and
`data-bind` values from `props`). It must be called before our attribute logic so that
`className` from `props` is applied first.

---

## 7. Caller migrations

All four callers pass a bare `imageSrc` base path. Each migration follows the same pattern:
split the base path into typed source entries.

### 7.1 `project-header.component.ts`

```typescript
// Before
new PictureComponent(el, {
  imageSrc: this._headConfig.imageSrc,
  imageAlt: `${this._headConfig.name} illustration picture`,
})

// After
new PictureComponent(el, {
  sources: [
    { src: `${this._headConfig.imageSrc}.avif`, type: 'image/avif' },
    { src: `${this._headConfig.imageSrc}.webp`, type: 'image/webp' },
  ],
  fallback: `${this._headConfig.imageSrc}.jpg`,
  alt: `${this._headConfig.name} illustration picture`,
})
```

### 7.2 `other-things.component.ts`

```typescript
// Before
new PictureComponent(el, {
  imageSrc: this._thumbnailSrc,
  imageAlt: 'Carved books.'
})

// After
new PictureComponent(el, {
  sources: [
    { src: `${this._thumbnailSrc}.avif`, type: 'image/avif' },
    { src: `${this._thumbnailSrc}.webp`, type: 'image/webp' },
  ],
  fallback: `${this._thumbnailSrc}.jpg`,
  alt: 'Carved books.',
  loading: 'eager',  // above-the-fold thumbnail
})
```

### 7.3 `carousel-popover.ts`

`IImagePopConfig extends IPictureConfig` must be updated. `carouselImagesSrc()` now builds
full source arrays instead of bare paths:

```typescript
export interface IImagePopConfig extends IPictureConfig {
  viewName?: string;
}

const carouselImagesSrc = (): IImagePopConfig[] => {
  return carouselImages.map((s: string) => {
    const base = assetsBase + s;
    return {
      sources: [
        { src: `${base}.avif`, type: 'image/avif' },
        { src: `${base}.webp`, type: 'image/webp' },
      ],
      fallback: `${base}.jpg`,
      alt: `${s} illustration`,
    };
  });
};
```

### 7.4 `not-found.view.ts`

```typescript
// Before
new PictureComponent(el, {
  imageSrc: './assets/images/404',
  imageAlt: 'Carved books.'
})

// After
new PictureComponent(el, {
  sources: [
    { src: './assets/images/404.avif', type: 'image/avif' },
    { src: './assets/images/404.webp', type: 'image/webp' },
  ],
  fallback: './assets/images/404.jpg',
  alt: 'Page not found illustration — carved books.',
  loading: 'eager',  // immediately visible on the 404 page
})
```

Note: the `not-found.view.ts` alt text is improved. "Carved books." is not a meaningful
description in the context of a 404 page. A screen reader user landing on the 404 page should
understand what they are looking at.

---

## 8. Files

| Action | File |
|---|---|
| **Update** | `src/app/components/common/picture/picture.component.ts` |
| **Update** | `src/app/components/common/picture/picture.component.html` |
| **Update** | `src/app/components/project/common/project-header/project-header.component.ts` |
| **Update** | `src/app/components/other-things/other-things.component.ts` |
| **Update** | `src/app/components/other-things/carousel-popover/carousel-popover.ts` |
| **Update** | `src/app/views/not-found/not-found.view.ts` |

No new files. No changes to `src/app/components/common/index.ts` — the export path is unchanged.

---

## 9. Usage examples

### Standard image with formats

```typescript
new PictureComponent(el, {
  sources: [
    { src: '/assets/images/hero.avif', type: 'image/avif' },
    { src: '/assets/images/hero.webp', type: 'image/webp' },
  ],
  fallback: '/assets/images/hero.jpg',
  alt: 'Developer at a standing desk, writing code.',
  width: 800,
  height: 600,
  loading: 'eager',  // hero image — must not be lazy
})
```

### Single format (PNG only, no modern alternatives)

```typescript
new PictureComponent(el, {
  sources: [
    { src: '/assets/images/logo.png', type: 'image/png' },
  ],
  fallback: '/assets/images/logo.png',  // same file, <img> fallback still required
  alt: 'Company logo.',
  width: 200,
  height: 60,
})
```

### Art direction (different crop per viewport)

```typescript
new PictureComponent(el, {
  sources: [
    { src: '/assets/images/team-mobile.webp', type: 'image/webp', media: '(max-width: 640px)' },
    { src: '/assets/images/team-desktop.webp', type: 'image/webp' },
  ],
  fallback: '/assets/images/team-desktop.jpg',
  alt: 'The team gathered around a whiteboard.',
  width: 1200,
  height: 800,
})
```

### Decorative image

```typescript
new PictureComponent(el, {
  sources: [
    { src: '/assets/images/bg-texture.avif', type: 'image/avif' },
    { src: '/assets/images/bg-texture.webp', type: 'image/webp' },
  ],
  fallback: '/assets/images/bg-texture.jpg',
  alt: '',  // decorative → aria-hidden="true" applied to <figure>
})
```

### Image with caption and empty alt (caption is the accessible description)

```typescript
new PictureComponent(el, {
  sources: [
    { src: '/assets/images/chart.webp', type: 'image/webp' },
  ],
  fallback: '/assets/images/chart.png',
  alt: '',
  captionI18nKey: 'home.chart-caption',  // caption present → aria-hidden NOT set
  width: 600,
  height: 400,
})
```

---

## 10. Open questions

1. **`width` / `height` availability**: Callers need to know the intrinsic dimensions of each
   image asset. If assets are dynamically loaded (e.g. from a CMS or data file), dimensions
   should be stored alongside the asset path in the data source. For the current static assets,
   dimensions can be read from the files once and hard-coded in the caller.

2. **Resolution switching (`srcset` with `w` descriptors)**: The plan supports it via the
   optional `srcset` field on `IPictureSource`, but no current caller needs it. If added later,
   `sizes` must also be provided — a `srcset` with `w` descriptors without `sizes` causes the
   browser to use 100vw as the default, which is rarely correct.

3. **`locales/` directory**: Both `en.json` and `fr.json` contain only `{ "default": "Picture works !" }` — a dev placeholder. If `PictureComponent` has no i18n strings of its own (captions come from caller config), these files can be deleted. Confirm no other mechanism depends on a locale file existing for a component before deleting.
