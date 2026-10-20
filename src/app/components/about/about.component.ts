import { Component, html } from '../../../core/index.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class AboutMeComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'article'});
    this.listenToRenderEvents(['language-changed']);
  }
}
