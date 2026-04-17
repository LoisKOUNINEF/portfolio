import {AppEventBus, Component} from '../../../../core/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class FooterComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'footer'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }
}
