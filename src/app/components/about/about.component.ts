import { AppEventBus, Component } from '../../../core/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class AboutMeComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'article'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }
}
