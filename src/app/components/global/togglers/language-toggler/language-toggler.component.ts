import { Component, I18nService, html } from '../../../../../core/index.js';
import { languageTogglerService } from '../../../../services/togglers/language-toggler/language-toggler.service.js';
import { ButtonComponent } from '../../../common/button/button.component.js';
import { togglerButtonClass } from '../toggler-classes.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class LanguageTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    const label = I18nService.translate('language-toggler.label');
    return [{
      selector: 'language-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: async () => await this.toggleLang(),
        i18nKey: 'language-toggler.flag',
        className: `${togglerButtonClass} text-nowrap text-inherit lowercase font-secondary`,
        ariaLabel: label,
        tooltip: label,
      })
    }]
  }

  private async toggleLang(): Promise<void> {
    await languageTogglerService.toggleLang();
  }
}
