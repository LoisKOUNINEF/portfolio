import { Component, ComponentConfig } from '../../../../../core/index.js';
import { themeTogglerService } from '../../../../services/index.js';
import { ButtonComponent } from '../../../../../libs/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ThemeTogglerComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }

  public childConfigs(): ComponentConfig[] {
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
