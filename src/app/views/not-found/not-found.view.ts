import { NavToggleHelper } from '../../components/global/navbar/nav-toggle.helper.js';
import { AppEventBus, Component, ComponentConfig, View } from '../../../core/index.js';
import { ButtonComponent } from '../../components/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class NotFoundView extends View {
  constructor() {
    super({template});
    this.hideGlobals();
  }

  public onExit(): void {
    this.revealGlobals();    
  }

  childConfigs(): ComponentConfig[] {
    const btnClass = 'not-found__back-btn';
    return [
      { 
        selector: 'back-to-home',
        factory: (el) => new ButtonComponent(el, { i18nKey: 'not-found.redirect', callback: () => this.handleHome(), className: btnClass })
      },
    ]
  }

  private handleHome(): void {
    AppEventBus.emit('navigate', '/');
  }

  private hideGlobals() {
    const navbar = document.getElementById('navbar') as HTMLElement;
    navbar.style = 'display: none';
    const footer = document.getElementById('footer') as HTMLElement;
    footer.style = 'display: none';
  }

  private revealGlobals() {
    const navbar = document.getElementById('navbar') as HTMLElement;
    navbar.style = 'display: block';
    const footer = document.getElementById('footer') as HTMLElement;
    footer.style = 'display: block';
  }
}
