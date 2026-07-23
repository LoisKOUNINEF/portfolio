import { Component, ComponentConfig } from '../../../core/index.js';
import { displayCarouselModal } from './carousel-modal/carousel-modal.js';
import { PictureComponent } from '../../../libs/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class OtherThingsComponent extends Component {
  private readonly _thumbnailSrc = './assets/images/other-things/thumbnail';

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed']);
  }

  public childConfigs(): ComponentConfig[] {
    return [{
      selector: 'other-things-thumbnail',
      factory: (el) => new PictureComponent(el, {
        sources: [
          { src: `${this._thumbnailSrc}.avif`, type: 'image/avif' },
          { src: `${this._thumbnailSrc}.webp`, type: 'image/webp' },
        ],
        fallback: `${this._thumbnailSrc}.jpg`,
        alt: 'Carved books.',
        loading: 'eager',
      })
    }]
  }

  private _displayCarouselModal = (): void => {
    displayCarouselModal();
  }
}
