import { AppEventBus, Component, ComponentConfig } from '../../../core/index.js';
import {AnchorComponent, BulletPointComponent, TechBadgeComponent} from '../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class HeroComponent extends Component {
  private _mainStackKeys: TechSvgKey[] = [ 'angular', 'nodejs', 'golang', 'postgresql', 'docker' ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      ...this.getKeyCompetences(),
      ...this.getTechBadges(),
      this.getProjectsAnchor()
    ]
  }

  private getTechBadges(): ComponentConfig[] {
    return this.catalogConfig({
      array: this._mainStackKeys,
      selector: 'hero-main-stack',
      component: TechBadgeComponent,
      elementName: 'hero-tech-badge'
    })
  }

  private getKeyCompetences(): ComponentConfig[] {
    const jsonNamePattern = (i: number) => `hero.key-competence-${i}`;
    const i18nKeys: any[] = [];
    for (let i = 0; i < 3; i++) {
      i18nKeys.push(jsonNamePattern(i+1));
    }
    return this.catalogConfig({
      array: i18nKeys,
      selector: 'hero-key-competences',
      component: BulletPointComponent,
      elementName: 'hero-key-competence'
    })
  }

  private getProjectsAnchor(): ComponentConfig {
    return {
      selector: 'projects-anchor',
      factory: (el) => new AnchorComponent(el, { 
        href: '#main-projects', 
        i18nKey: 'hero.cta' 
      })
    }
  }

  private scrollToTechnos() {
    const projectAnchor = document.getElementById('tech-stack');
    projectAnchor?.scrollIntoView({ behavior: 'smooth' });
  }
}
