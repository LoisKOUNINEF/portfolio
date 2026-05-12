import { Component, ComponentConfig } from '../../../core/index.js';
import { displayImagePop } from './image-popover/image-popover.js';
import { PictureComponent } from '../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class OtherThingsComponent extends Component {
  private readonly _thumbnailSrc = './assets/images/other-things/thumbnail';

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed'])
  }

  public childConfigs(): ComponentConfig[] {
    return [{
      selector: 'other-things-thumbnail',
      factory: (el) => new PictureComponent(el, {
        imageSrc: this._thumbnailSrc,
        imageAlt: 'Carved books.'
      })
    }]
  }

  private _displayImagePop = (): void => {
    displayImagePop();
  }
}
