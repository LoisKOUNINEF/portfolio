import { Component, ComponentProps } from '../../../core/index.js';


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

const renderSources = (sources: IPictureSource[]): string =>
  sources.map(s => {
    const srcset = s.srcset ?? s.src;
    const media = s.media ? ` media="${s.media}"` : '';
    const sizes = s.sizes ? ` sizes="${s.sizes}"` : '';
    return `<source srcset="${srcset}" type="${s.type}"${media}${sizes}>`;
  }).join('');

const renderImg = (config: IPictureConfig): string => {
  const width = config.width != null ? ` width="${config.width}"` : '';
  const height = config.height != null ? ` height="${config.height}"` : '';
  const loading = config.loading ?? 'lazy';
  const decoding = config.decoding ?? 'async';
  return `<img src="${config.fallback}" alt="${config.alt}"${width}${height} loading="${loading}" decoding="${decoding}"/>`;
};

const templateFn = (_config: IPictureConfig) => `<picture>
${renderSources(_config.sources)}${renderImg(_config)}
</picture>
<figcaption data-optional="${_config.captionI18nKey || _config.caption}" data-i18n="${_config.captionI18nKey}" data-pipe="capitalize">${_config.caption || ''}</figcaption>`;

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
