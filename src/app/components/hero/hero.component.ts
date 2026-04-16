import { AppEventBus, Component, ComponentConfig } from '../../../core/index.js';
import { AnchorComponent, BulletPointComponent } from '../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class HeroComponent extends Component {

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      this.getProjectsAnchor(),
      ...this.getKeyCompetences()
    ]
  }

  private getKeyCompetences(): ComponentConfig[] {
    const i18nKeys: any[] = [];
    for (let i = 0; i < 3; i++) {
      i18nKeys.push(`hero.key-competence-${i+1}`)
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
}
