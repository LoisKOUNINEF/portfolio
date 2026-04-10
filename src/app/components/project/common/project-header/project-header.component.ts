import { Component, ComponentConfig } from '../../../../../core/index.js';
import {ProjectTagComponent, TechBadgeComponent} from '../../../index.js';

interface IProjectHeadConfig {
  name: string;
  imageSrc: string;
  tagline: string;
  technos: ITechBase[];
  tags: IProjectTag[];
  displayTechIcons?: boolean;
}

const templateFn = (_config: IProjectHeadConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class ProjectHeaderComponent extends Component {
  private _headConfig: IProjectHeadConfig;

  constructor(mountTarget: HTMLElement, config: IProjectHeadConfig) {
    super({templateFn, mountTarget, config});
    this._headConfig = config;
  }

  public childConfigs(): ComponentConfig[] {
    const configs = this.getTagsConfig();
    if (!this._headConfig.displayTechIcons) {
      return configs;
    }
    configs.push(...this.getTechBadgesConfig());
    return configs
  }

  private getTechBadgesConfig(): ComponentConfig[] {
    return this.catalogConfig({
      selector: `project-header-technos`,
      array: this._headConfig.technos,
      component: TechBadgeComponent,
      elementName: `project-header-techno`
    })
  }

  private getTagsConfig(): ComponentConfig[] {
    return this.catalogConfig({
      selector: `project-header-tags`,
      array: this._headConfig.tags,
      component: ProjectTagComponent,
      elementName: `project-header-tag`
    })
  }
}