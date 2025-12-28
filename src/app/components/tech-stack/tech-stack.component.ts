import { AppEventBus, Component, ComponentConfig } from '../../../core/index.js';
import { TechBadgeComponent } from '../index.js';

interface ITechStackKeys {
  frontend: TechSvgKey[],
  backend: TechSvgKey[],
  database: TechSvgKey[],
  tools: TechSvgKey[]
}

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class TechStackComponent extends Component {
  private _keys: ITechStackKeys = {
    frontend: [ 'typescript', 'angular', 'vuejs', 'sass'  ],
    backend: [ 'nestjs', 'nodejs', 'express', 'rails' ],
    database: [ 'postgresql', 'mysql', 'typeorm' ],
    tools: [ 'git', 'docker', 'jest', 'linux', 'traefik', 'bash' ],
  };

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      ...this.getFrontendBadges(),
      ...this.getBackendBadges(),
      ...this.getToolsBadges(),
      ...this.getDatabaseBadges(),
    ];
  }

  private getFrontendBadges(): ComponentConfig[] {
    return this.catalogConfig({
      selector: 'frontend-badges',
      array: this._keys.frontend,
      component: TechBadgeComponent,
      elementName: 'frontend-badge'
    })
  }

  private getBackendBadges(): ComponentConfig[] {
    return this.catalogConfig({
      selector: 'backend-badges',
      array: this._keys.backend,
      component: TechBadgeComponent,
      elementName: 'backend-badge'
    })
  }

  private getDatabaseBadges(): ComponentConfig[] {
    return this.catalogConfig({
      selector: 'database-badges',
      array: this._keys.database,
      component: TechBadgeComponent,
      elementName: 'database-badge'
    })
  }

  private getToolsBadges(): ComponentConfig[] {
    return this.catalogConfig({
      selector: 'tools-badges',
      array: this._keys.tools,
      component: TechBadgeComponent,
      elementName: 'tools-badge'
    })
  }
}
