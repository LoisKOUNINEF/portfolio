import { Component, I18nService, html } from '../../../core/index.js';
import { displayCarouselModal } from './carousel-modal/carousel-modal.js';
import { PictureComponent } from '../common/picture/picture.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class OtherThingsComponent extends Component {
  private readonly _thumbnailSrc = '/assets/images/other-things/thumbnail';

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [{
      selector: 'other-things-thumbnail',
      factory: (el) => new PictureComponent(el, {
        sources: [
          { src: `${this._thumbnailSrc}.avif`, type: 'image/avif' },
          { src: `${this._thumbnailSrc}.webp`, type: 'image/webp' },
        ],
        fallback: `${this._thumbnailSrc}.jpg`,
        // Named by the surrounding button
        alt: '',
        width: 1080,
        height: 1080,
        loading: 'eager',
      })
    }]
  }

  protected _displayCarouselModal = (): void => {
    displayCarouselModal();
  }
}
