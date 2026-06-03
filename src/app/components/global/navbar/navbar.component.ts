import {
  Component,
  ComponentConfig,
  IAnchorConfig,
  I18nService
} from '../../../../core/index.js';
import { 
  AnchorComponent, 
  ButtonComponent 
} from '../../../../libs/index.js';
import { 
  LanguageTogglerComponent, 
  ThemeTogglerComponent 
} from '../../index.js';
import { NavToggleHelper } from './nav-toggle.helper.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class NavbarComponent extends Component<HTMLHeadingElement> {
  private readonly _anchorHrefs: IAnchorConfig[] = [
    { href: '#hero', i18nKey: 'navbar.hero', className: `${NavToggleHelper.toggleClasses.active}` },
    { href: '#infrastructure', i18nKey: 'navbar.infrastructure' },
    { href: '#main-projects', i18nKey: 'navbar.main-projects' },
    { href: '#about', i18nKey: 'navbar.about' },
    // { href: '#tech-stack', i18nKey: 'navbar.tech-stack' },
    { href: '#contact', i18nKey: 'navbar.contact' },
  ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'header'});
    this.listenToRenderEvents(['language-changed']);
  }

  override onAfterRender() {
    window.addEventListener('scroll', () => this.scrollHelper());
    NavToggleHelper.setupAnchorListeners();
  }

  public childConfigs(): ComponentConfig[] {
    return [ ...this.getAnchors(), ...this.getTogglers() ]
  }

  private getAnchors(): ComponentConfig[] {
    return this.catalogConfig({
      array: this._anchorHrefs,
      selector: 'navbar-anchors',
      elementName: 'nav-anchor',
      component: AnchorComponent,
      props: { className: 'navbar__anchor' }
    })
  }

  private getTogglers(): ComponentConfig[] {
    return [
      {
        selector: 'language-toggler',
        factory: (el) => new LanguageTogglerComponent(el),
      },
      {
        selector: 'theme-toggler',
        factory: (el) => new ThemeTogglerComponent(el),
      },
      this.getToggleBtn(),
    ]
  }

  private getToggleBtn(): ComponentConfig {
    return {
      selector: 'nav-toggle',
      factory: (el) => new ButtonComponent(el, {
        callback: () => this.toggleNav(),
        className: 'navbar__toggle-navbar',
        ariaControls: 'navbar-anchors',
        ariaExpanded: false,
        ariaLabel: I18nService.translate('navbar.toggle-label', 'Toggle navigation'),
      })
    }
  }

  private toggleNav(): void {
    NavToggleHelper.toggleNav();
  }

  private scrollHelper() {
    NavToggleHelper.hideOnScrollDown();
    NavToggleHelper.highlightCurrent();
  }
}
