import { Component, I18nService, html } from '../../../../core/index.js';
import { ButtonComponent } from '../../common/button/button.component.js';
import { AnchorComponent, IAnchorConfig } from '../../common/anchor/anchor.component.js';
import { LanguageTogglerComponent } from '../togglers/language-toggler/language-toggler.component.js';
import { ThemeTogglerComponent } from '../togglers/theme-toggler/theme-toggler.component.js';
import { NavToggleHelper } from './nav-toggle.helper.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// Section links; NavToggleHelper moves `active` to the current section's link
const anchorClass = 'transition-[color,border] duration-fast ease-in-out border-b-2 border-background no-underline font-semibold text-inherit py-small px-[0.4rem] bg-background [&.active]:text-secondary [&.active]:border-secondary [&.active]:hover:cursor-default [&.active]:hover:[transform:none] [&.active]:focus-visible:outline-2 [&.active]:focus-visible:outline-primary max-medium:[&.active]:border-background [&:not(.active)]:pointer-events-auto [&:not(.active)]:hover:text-primary [&:not(.active)]:hover:border-primary [&:not(.active)]:focus-visible:outline-2 [&:not(.active)]:focus-visible:outline-secondary';

export class NavbarComponent extends Component<HTMLHeadingElement> {
  private readonly _anchorHrefs: IAnchorConfig[] = [
    { href: '#hero', i18nKey: 'navbar.hero', className: `${anchorClass} ${NavToggleHelper.toggleClasses.active}` },
    { href: '#projects', i18nKey: 'navbar.projects', className: anchorClass },
    { href: '#about', i18nKey: 'navbar.about', className: anchorClass },
    { href: '#tech-stack', i18nKey: 'navbar.tech-stack', className: anchorClass },
    { href: '#contact', i18nKey: 'navbar.contact', className: anchorClass },
  ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'header'});
    this.listenToRenderEvents(['language-changed']);
    // Initial state, for whatever position the page opens at
    this.listen('view-mount', () => NavToggleHelper.highlightCurrent());
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    const onScroll: EventListener = () => NavToggleHelper.onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    this.eventListeners.push([window, 'scroll', onScroll]);
    NavToggleHelper.setupAnchorListeners();
    // A re-render (e.g. language change) resets the links to their initial classes
    NavToggleHelper.highlightCurrent();
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
      // On <a11y-anchor> (display: contents): inherited by the link, which re-enables pointer events unless active
      props: { className: 'text-nowrap pointer-events-none' }
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
        // Small screens only; rotated while the dropdown is open
        className: "navbar__toggle-navbar transition-all duration-slow ease-in-out transition-discrete hidden text-largest bg-transparent border-none cursor-pointer text-text max-medium:block [&.open]:rotate-[-90deg] before:content-['☰']",
        ariaControls: 'navbar-anchors',
        ariaExpanded: false,
        ariaLabel: I18nService.translate('navbar.toggle-label', 'Toggle navigation'),
      })
    }
  }

  private toggleNav(): void {
    NavToggleHelper.toggleNav();
  }
}
