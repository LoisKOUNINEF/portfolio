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
}

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
    return html`<picture>${c.sources.map(s => html`<source srcset="${s.srcset ?? s.src}" type="${s.type}" ${s.media ? html`media="${s.media}"` : ''} ${s.sizes ? html`sizes="${s.sizes}"` : ''}>`)}<img src="${c.fallback}" alt="${c.alt}" ${c.width != null ? html`width="${c.width}"` : ''} ${c.height != null ? html`height="${c.height}"` : ''} loading="${c.loading ?? 'lazy'}" decoding="${c.decoding ?? 'async'}"/></picture>
<figcaption data-optional="${caption}" ${c.captionI18nKey ? html`data-i18n="${c.captionI18nKey}"` : ''} data-pipe="capitalize">${c.caption || ''}</figcaption>`;
  }
}
