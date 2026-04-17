import {AppEventBus, Component} from '../../../core/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class InfosComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    AppEventBus.subscribe('language-changed', () => this.render());
  }
}
