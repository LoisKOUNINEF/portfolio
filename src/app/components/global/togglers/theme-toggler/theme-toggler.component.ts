import { Component, I18nService, html } from '../../../../../core/index.js';
import { themeTogglerService } from '../../../../services/togglers/theme-toggler/theme-toggler.service.js';
import { ButtonComponent } from '../../../common/button/button.component.js';
import { togglerButtonClass } from '../toggler-classes.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class ThemeTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    const label = I18nService.translate('theme-toggler.label');
    return [{
      selector: 'theme-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: () => this.toggleTheme(),
        className: `${togglerButtonClass} before:content-['🌙'] dark:before:content-['🔅']`,
        ariaLabel: label,
        tooltip: label,
      })
    }]
  }

  private toggleTheme(): void {
    themeTogglerService.toggleTheme();
  }
}
