import { Component, html } from '../../../../../core/index.js';
import { themeTogglerService } from '../../../../services/togglers/theme-toggler/theme-toggler.service.js';
import { ButtonComponent } from '../../../common/button/button.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class ThemeTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [{
      selector: 'theme-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: () => this.toggleTheme(),
        className: 'navbar__toggler theme-toggler',
      })
    }]
  }

  private toggleTheme(): void {
    themeTogglerService.toggleTheme();
  }
}
