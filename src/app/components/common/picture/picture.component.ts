import { Component, html } from '../../../../core/index.js';

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
  // Slot width (the `sizes` attribute). When set, every source without its own `srcset`, and
  // the <img>, get the resized variants (foo-640w.avif, …) plus the original as candidates
  sizes?: string;
}

// Widths of the variants written by scripts/resize-images.sh: keep in sync with its --widths default
export const RESPONSIVE_WIDTHS = [640, 1080] as const;

// Width announced for the original when the config has no `width`: the usual screenshot width.
// Only used by the browser to rank the candidates
const DEFAULT_ORIGINAL_WIDTH = 1920;

// foo.avif -> "foo-640w.avif 640w, foo-1080w.avif 1080w, foo.avif 1920w"
const responsiveSrcset = (src: string, originalWidth: number): string => {
  const dot = src.lastIndexOf('.');
  const stem = src.slice(0, dot);
  const ext = src.slice(dot);
  return [
    ...RESPONSIVE_WIDTHS.map((w) => `${stem}-${w}w${ext} ${w}w`),
    `${src} ${originalWidth}w`,
  ].join(', ');
};

/**
 * Renders the `<picture>` markup inside `<a11y-picture>` (a11y-elements),
 * which handles the figure role and decorative `aria-hidden`.
 */
export class PictureComponent extends Component<HTMLElement, IPictureConfig> {
  constructor(mountTarget: HTMLElement, config: IPictureConfig, props?: Nutin.ComponentProps) {
    super({ mountTarget, config, tagName: 'a11y-picture', props });
  }

  protected override generateTemplate(): Nutin.Template {
    const c = this.config;
    const caption = c.captionI18nKey || c.caption;
    const originalWidth = c.width ?? DEFAULT_ORIGINAL_WIDTH;
    const srcsetOf = (src: string) => (c.sizes ? responsiveSrcset(src, originalWidth) : src);
    const sizesOf = (s: IPictureSource) => s.sizes ?? (s.srcset ? undefined : c.sizes);
    return html`<picture>${c.sources.map(s => html`<source srcset="${s.srcset ?? srcsetOf(s.src)}" type="${s.type}" ${s.media ? html`media="${s.media}"` : ''} ${sizesOf(s) ? html`sizes="${sizesOf(s)}"` : ''}>`)}<img src="${c.fallback}" ${c.sizes ? html`srcset="${srcsetOf(c.fallback)}" sizes="${c.sizes}"` : ''} alt="${c.alt}" ${c.width != null ? html`width="${c.width}"` : ''} ${c.height != null ? html`height="${c.height}"` : ''} loading="${c.loading ?? 'lazy'}" decoding="${c.decoding ?? 'async'}"/></picture>
<figcaption data-optional="${caption}" ${c.captionI18nKey ? html`data-i18n="${c.captionI18nKey}"` : ''} data-pipe="capitalize">${c.caption || ''}</figcaption>`;
  }
}
