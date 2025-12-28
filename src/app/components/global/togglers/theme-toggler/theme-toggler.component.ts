import { Component, ComponentConfig } from '../../../../../core/index.js';
import { ThemeTogglerService } from '../../../../services/index.js';
import { ButtonComponent } from '../../../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ThemeTogglerComponent extends Component {
  private readonly _label = 'theme-toggle';

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.initTheme();
  }

  public childConfigs(): ComponentConfig[] {
    return [{
      selector: 'theme-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: () => this.toggleTheme(),
        className: 'navbar__toggler theme-toggler',
        label: this._label,
      })
    }]
  }

  private toggleTheme(): void {
    ThemeTogglerService.toggleTheme();
  }

  private initTheme(): void {
    if (ThemeTogglerService.isLightTheme) return;
    else this.initCheckbox();
  }

  private initCheckbox(): void {
    this.render();
    const checkbox = <HTMLInputElement> document.getElementById(this._label);
    checkbox.checked = true;
  }
}
