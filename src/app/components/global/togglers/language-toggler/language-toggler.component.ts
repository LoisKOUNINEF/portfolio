import { Component, ComponentConfig } from '../../../../../core/index.js';
import { LanguageTogglerService } from '../../../../services/index.js';
import { ButtonComponent } from '../../../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class LanguageTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public childConfigs(): ComponentConfig[] {
    return [{
      selector: 'language-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: async () => await this.toggleLang(),
        i18nKey: 'language-toggler.flag',
        className: 'navbar__toggler lang-toggler'
      })
    }]
  }

  private async toggleLang(): Promise<void> {
    await LanguageTogglerService.toggleLang();
  }
}
