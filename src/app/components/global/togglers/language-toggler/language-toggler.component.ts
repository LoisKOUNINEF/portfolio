import { Component, I18nService, html } from '../../../../../core/index.js';
import { languageTogglerService } from '../../../../services/togglers/language-toggler/language-toggler.service.js';
import { ButtonComponent } from '../../../common/button/button.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class LanguageTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [{
      selector: 'language-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: async () => await this.toggleLang(),
        i18nKey: 'language-toggler.flag',
        className: 'navbar__toggler lang-toggler',
        ariaLabel: I18nService.translate('language-toggler.label'),
      })
    }]
  }

  private async toggleLang(): Promise<void> {
    await languageTogglerService.toggleLang();
  }
}
