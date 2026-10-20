import { Component, html } from '../../../core/index.js';
import { TechBadgeComponent } from '../common/tech/tech-badge/tech-badge.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class TechStackComponent extends Component {
  private _keys = {
    frontend: [  'angular', 'typescript', 'sass', 'tailwind'  ].map(str => ({ svgKey: str, displayProficiency: true })),
    backend: [ 'nestjs', 'golang' ].map(str => ({ svgKey: str, displayProficiency: true })),
    database: [ 'postgresql', 'sqlite' ].map(str => ({ svgKey: str, displayProficiency: true })),
    tools: [ 'docker', 'linux', 'traefik', 'bash' ].map(str => ({ svgKey: str, displayProficiency: true })),
  };

  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section'});
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      ...this.getFrontendBadges(),
      ...this.getBackendBadges(),
      ...this.getToolsBadges(),
      ...this.getDatabaseBadges(),
    ];
  }

  private getFrontendBadges(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: 'frontend-badges',
      items: this._keys.frontend,
      component: TechBadgeComponent,
      elementName: 'frontend-badge'
    })
  }

  private getBackendBadges(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: 'backend-badges',
      items: this._keys.backend,
      component: TechBadgeComponent,
      elementName: 'backend-badge'
    })
  }

  private getDatabaseBadges(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: 'database-badges',
      items: this._keys.database,
      component: TechBadgeComponent,
      elementName: 'database-badge'
    })
  }

  private getToolsBadges(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: 'tools-badges',
      items: this._keys.tools,
      component: TechBadgeComponent,
      elementName: 'tools-badge'
    })
  }
}
