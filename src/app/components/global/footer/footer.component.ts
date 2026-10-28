import { Component, html, Navigation } from '../../../../core/index.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class FooterComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'footer'});
    this.listenToRenderEvents(['language-changed']);
  }

  private _goToOtherThings(): void {
    Navigation.navigateTo('/other-things');
  }
}
