import { AppEventBus, Component, ComponentConfig } from '../../../core/index.js';
import { AnchorComponent, TechBadgeComponent } from '../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class HeroComponent extends Component {
  private _mainStackKeys: TechSvgKey[] = [ 'typescript', 'angular', 'nestjs', 'postgresql' ];

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
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

  private getProjectsAnchor(): ComponentConfig {
    return {
      selector: 'projects-anchor',
      factory: (el) => new AnchorComponent(el, { 
        href: '#main-projects', 
        i18nKey: 'hero.cta' 
      })
    }
  }

  private scrollToProjects() {
    const projectAnchor = document.getElementById('main-projects');
    projectAnchor?.scrollIntoView({ behavior: 'smooth' });
  }

  private scrollToTechnos() {
    const projectAnchor = document.getElementById('tech-stack');
    projectAnchor?.scrollIntoView({ behavior: 'smooth' });
  }
}
