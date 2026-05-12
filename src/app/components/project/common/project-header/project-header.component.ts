import { Component, ComponentConfig } from '../../../../../core/index.js';
import {BulletPointComponent, ProjectTagComponent, TechBadgeComponent, TechStringComponent, PictureComponent} from '../../../index.js';

interface IProjectHeadConfig {
  name: string;
  imageSrc: string;
  tagline: string;
  technos: ITech[];
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
      configs.push(this.getTechStringConfig());
    } else {
      configs.push(...this.getTechBadgesConfig());
      configs.push(this.getPictureConfig())
    }
    return configs;
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

  private getTechStringConfig(): ComponentConfig {
    return {
      selector: 'project-header-tech-string',
      factory: (el) => new TechStringComponent(el, this._headConfig.technos)
    }
  }

  private getPictureConfig(): ComponentConfig {
    return {
      selector: 'project-header-picture',
      factory: (el) => new PictureComponent(el, {
        imageSrc: this._headConfig.imageSrc,
        imageAlt: `${this._headConfig.name} illustration picture`,
      },
      {
        className: 'project-header__screen-mock-content'
      })
    
  }}
}