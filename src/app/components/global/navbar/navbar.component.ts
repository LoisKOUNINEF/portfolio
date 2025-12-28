import { 
  AppEventBus, 
  Component, 
  ComponentConfig, 
  IAnchorConfig 
} from '../../../../core/index.js';
import { 
  AnchorComponent, 
  ButtonComponent, 
  LanguageTogglerComponent, 
  ThemeTogglerComponent 
} from '../../index.js';
import { NavToggleHelper } from './nav-toggle.helper.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class NavbarComponent extends Component<HTMLHeadingElement> {
  private readonly _anchorHrefs: IAnchorConfig[] = [
    { href: '#hero', i18nKey: 'navbar.hero', className: `${NavToggleHelper.toggleClasses.active}` },
    { href: '#about', i18nKey: 'navbar.about' },
    { href: '#main-projects', i18nKey: 'navbar.main-projects' },
    { href: '#tech-stack', i18nKey: 'navbar.tech-stack' },
    { href: '#infrastructure', i18nKey: 'navbar.infrastructure' },
    { href: '#contact', i18nKey: 'navbar.contact' },
  ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'header'});
    AppEventBus.subscribe('language-changed', () => this.render());
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
      props:{ className: 'navbar__anchor' }
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
        label: NavToggleHelper.label,
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
