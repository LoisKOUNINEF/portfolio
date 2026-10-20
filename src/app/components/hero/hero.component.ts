import { Component, html } from '../../../core/index.js';
import { BulletPointComponent } from '../common/bullet-point/bullet-point.component.js';
import { TechBadgeComponent } from '../common/tech/tech-badge/tech-badge.component.js';
import { ButtonComponent } from '../common/button/button.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class HeroComponent extends Component {
  private _mainStackKeys: TechSvgKey[] = [ 'angular', 'nestjs', 'postgresql', 'docker' ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      ...this.getKeyCompetences(),
      ...this.getTechBadges(),
      this.getCtaAnchor()
    ]
  }

  private getTechBadges(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      items: this._mainStackKeys,
      selector: 'hero-main-stack',
      component: TechBadgeComponent,
      elementName: 'hero-tech-badge'
    })
  }

  private getKeyCompetences(): Nutin.ComponentConfig[] {
    const jsonNamePattern = (i: number) => `hero.key-competence-${i}`;
    const i18nKeys: string[] = [];
    for (let i = 0; i < 3; i++) {
      i18nKeys.push(jsonNamePattern(i+1));
    }
    return this.createCatalogComponents({
      items: i18nKeys,
      selector: 'hero-key-competences',
      component: BulletPointComponent,
      elementName: 'hero-key-competence'
    })
  }

  private getCtaAnchor(): Nutin.ComponentConfig {
    return {
      selector: 'hero-cta',
      factory: (el) => new ButtonComponent(el, {
        i18nKey: 'hero.cta',
        callback: () => this.scrollToWork(),
        className: 'hero__cta u-pre-wrap'
      })
    }
  }

  private scrollToWork() {
    const projectAnchor = document.getElementById('infrastructure');
    projectAnchor?.scrollIntoView({ behavior: 'smooth' });
  }

  protected scrollToTechnos() {
    const projectAnchor = document.getElementById('tech-stack');
    projectAnchor?.scrollIntoView({ behavior: 'smooth' });
  }
}
