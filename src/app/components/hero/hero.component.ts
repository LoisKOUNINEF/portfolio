import { Component, html, Navigation } from '../../../core/index.js';
import { AnchorComponent } from '../common/anchor/anchor.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// The <a> inside <a11y-anchor> (display: contents, so the links are the flex items)
const ctaClass = 'block py-small px-large border-2 border-primary rounded-large text-medium font-semibold text-center transition-[background-color,color,transform] duration-fast ease-in-out hover:[transform:translateY(-2px)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 max-medium:flex-[1_1_calc(50%-0.5rem)] motion-reduce:transition-none motion-reduce:hover:[transform:none]';

export class HeroComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    this.listenToRenderEvents(['language-changed']);
  }

  // Real same-page links: <a11y-anchor> smooth-scrolls to the section and moves focus there
  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'hero-cta-primary',
        factory: (el) => new AnchorComponent(el, {
          href: '#projects',
          i18nKey: 'hero.cta',
          className: `${ctaClass} bg-primary text-background hover:bg-transparent hover:text-primary`,
        })
      },
      {
        selector: 'hero-cta-secondary',
        factory: (el) => new AnchorComponent(el, {
          href: '#contact',
          i18nKey: 'hero.cta-secondary',
          className: `${ctaClass} bg-transparent text-primary hover:bg-[color-mix(in_srgb,var(--primary),transparent_90%)]`,
        })
      },
    ];
  }

  _secret(): void {
    Navigation.navigateTo('/other-things');
  }
}
