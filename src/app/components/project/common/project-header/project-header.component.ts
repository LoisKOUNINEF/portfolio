import { Component, ComponentConfig } from '../../../../../core/index.js';
import { TechBadgeComponent } from '../../../index.js';

interface IProjectHeadConfig {
  name: string;
  imageSrc: string;
  tagline: string;
  technos: IProjectTechno[];
}

const templateFn = (_config: IProjectHeadConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class ProjectHeaderComponent extends Component {
  private _headConfig: IProjectHeadConfig;

  constructor(mountTarget: HTMLElement, config: IProjectHeadConfig) {
    super({templateFn, mountTarget, config});
    this._headConfig = config;
  }

  public childConfigs(): ComponentConfig[] {
    return this.getTechBadgesConfig();
  }

  private getTechBadgesConfig(): ComponentConfig[] {
    return this.catalogConfig({
      selector: `project-header-technos`,
      array: this._headConfig.technos,
      component: TechBadgeComponent,
      elementName: `project-header-techno`
    })
  }
}