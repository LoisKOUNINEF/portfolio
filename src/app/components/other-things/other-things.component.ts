import { PopoverView } from '../../../libs/index.js';
import { Component } from '../../../core/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class OtherThingsComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed'])
  }

  private _displayImagePop = (): void => {
    const pop = new PopoverView({
      template: `<div class="image-popover__wrapper">
  <picture>
    <source srcset="./assets/images/other-things/carved-books.avif" type="image/avif"/>
    <source srcset="./assets/images/other-things/carved-books.webp" type="image/webp"/>
    <img src="./assets/images/other-things/carved-books.jpg" alt="Carved books containing marble games and board games."/>
  </picture>
</div>`,
    });
    pop.render()
  }
}
