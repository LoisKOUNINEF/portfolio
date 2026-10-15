import 'a11y-elements/accessibility-components/picture';
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

/**
 * Renders the `<picture>` markup inside `<a11y-picture>` (a11y-elements),
 * which handles the figure role and decorative `aria-hidden`.
 */
export class PictureComponent extends Component<HTMLElement, IPictureConfig> {
  constructor(mountTarget: HTMLElement, config: IPictureConfig, props?: ComponentProps) {
    super({ mountTarget, config, tagName: 'a11y-picture', props });
  }

  protected override generateTemplate(): string {
    return `<picture>
${this.renderSources()}${this.renderImg()}
</picture>
<figcaption data-optional="${this.config.captionI18nKey || this.config.caption}" data-i18n="${this.config.captionI18nKey}" data-pipe="capitalize">${this.config.caption || ''}</figcaption>`;
  }

  private renderSources(): string {
    return this.config.sources.map(s => {
      const srcset = s.srcset ?? s.src;
      const media = s.media ? ` media="${s.media}"` : '';
      const sizes = s.sizes ? ` sizes="${s.sizes}"` : '';
      return `<source srcset="${srcset}" type="${s.type}"${media}${sizes}>`;
    }).join('');
  }

  private renderImg(): string {
    const c = this.config;
    const width = c.width != null ? ` width="${c.width}"` : '';
    const height = c.height != null ? ` height="${c.height}"` : '';
    return `<img src="${c.fallback}" alt="${c.alt}"${width}${height} loading="${c.loading ?? 'lazy'}" decoding="${c.decoding ?? 'async'}"/>`;
  }
}
