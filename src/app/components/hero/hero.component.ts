import { Component, html } from '../../../core/index.js';
import { AnchorComponent } from '../common/anchor/anchor.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

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
          className: 'hero__cta hero__cta--primary',
        })
      },
      {
        selector: 'hero-cta-secondary',
        factory: (el) => new AnchorComponent(el, {
          href: '#contact',
          i18nKey: 'hero.cta-secondary',
          className: 'hero__cta hero__cta--secondary',
        })
      },
    ];
  }
}
