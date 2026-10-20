import { Component, I18nService, html } from '../../../../core/index.js';
import { ButtonComponent } from '../../common/button/button.component.js';
import { AnchorComponent, IAnchorConfig } from '../../common/anchor/anchor.component.js';
import { LanguageTogglerComponent } from '../togglers/language-toggler/language-toggler.component.js';
import { ThemeTogglerComponent } from '../togglers/theme-toggler/theme-toggler.component.js';
import { NavToggleHelper } from './nav-toggle.helper.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class NavbarComponent extends Component<HTMLHeadingElement> {
  private readonly _anchorHrefs: IAnchorConfig[] = [
    { href: '#hero', i18nKey: 'navbar.hero', className: `${NavToggleHelper.toggleClasses.active}` },
    { href: '#projects', i18nKey: 'navbar.projects' },
    { href: '#about', i18nKey: 'navbar.about' },
    { href: '#tech-stack', i18nKey: 'navbar.tech-stack' },
    { href: '#contact', i18nKey: 'navbar.contact' },
  ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'header'});
    this.listenToRenderEvents(['language-changed']);
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    const onScroll: EventListener = () => this.scrollHelper();
    window.addEventListener('scroll', onScroll);
    this.eventListeners.push([window, 'scroll', onScroll]);
    NavToggleHelper.setupAnchorListeners();
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [ ...this.getAnchors(), ...this.getTogglers() ]
  }

  private getAnchors(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      items: this._anchorHrefs,
      selector: 'navbar-anchors',
      elementName: 'nav-anchor',
      component: AnchorComponent,
      props: { className: 'navbar__anchor' }
    })
  }

  private getTogglers(): Nutin.ComponentConfig[] {
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

  private getToggleBtn(): Nutin.ComponentConfig {
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
