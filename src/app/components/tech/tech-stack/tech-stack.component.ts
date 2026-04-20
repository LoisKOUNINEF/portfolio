import { AppEventBus, Component, ComponentConfig } from '../../../../core/index.js';
import {ButtonComponent, TechBadgeComponent} from '../../index.js';

interface ITechStackKeys {
  frontend: TechSvgKey[],
  backend: TechSvgKey[],
  database: TechSvgKey[],
  tools: TechSvgKey[]
}

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class TechStackComponent extends Component {
  private _keys: ITechStackKeys = {
    frontend: [ 'angular', 'vuejs', 'tailwind', 'sass'  ],
    backend: [ 'nodejs', 'golang', 'nestjs', 'rails' ],
    database: [ 'postgresql', 'sqlite', 'mysql' ],
    tools: [ 'docker', 'linux', 'traefik', 'bash' ],
  };

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      this.getThreeDotsBadge(),
      ...this.getFrontendBadges(),
      ...this.getBackendBadges(),
      ...this.getToolsBadges(),
      ...this.getDatabaseBadges(),
    ];
  }

  private getThreeDotsBadge(): ComponentConfig {
    return {
      selector: 'dots',
      factory: (el) => new ButtonComponent(el, {
        className: 'base-svg svg-three-dots',
        callback: ()=> {}
      })
    }
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
