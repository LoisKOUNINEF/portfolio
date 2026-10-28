import { Component, html } from '../../../../../core/index.js';
import { PictureComponent } from '../../../common/picture/picture.component.js';
import { ProjectTagComponent } from '../project-tag/project-tag.component.js';
import { TechBadgeComponent } from '../../../common/tech/tech-badge/tech-badge.component.js';
import { TechStringComponent } from '../../../common/tech/tech-string/tech-string.component.js';

interface IProjectHeadConfig {
  name: string;
  imageSrc?: string;
  tagline: string;
  technos: ITech[];
  tags: IProjectTag[];
  displayTechIcons?: boolean;
}

const templateFn = (_config: IProjectHeadConfig) => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectHeaderComponent extends Component {
  private _headConfig: IProjectHeadConfig;

  constructor(mountTarget: HTMLElement, config: IProjectHeadConfig) {
    super({templateFn, mountTarget, config});
    this._headConfig = config;
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    const configs = this.getTagsConfig();
    if (!this._headConfig.displayTechIcons) {
      configs.push(this.getTechStringConfig());
    } else {
      configs.push(...this.getTechBadgesConfig());
      if (this._headConfig.imageSrc) configs.push(this.getPictureConfig());
    }
    return configs;
  }

  private getTechBadgesConfig(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: `project-header-technos`,
      items: this._headConfig.technos,
      component: TechBadgeComponent,
      elementName: `project-header-techno`
    })
  }

  private getTagsConfig(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: `project-header-tags`,
      items: this._headConfig.tags,
      component: ProjectTagComponent,
      elementName: `project-header-tag`
    })
  }

  private getTechStringConfig(): Nutin.ComponentConfig {
    return {
      selector: 'project-header-tech-string',
      factory: (el) => new TechStringComponent(el, this._headConfig.technos)
    }
  }

  private getPictureConfig(): Nutin.ComponentConfig {
    return {
      selector: 'project-header-picture',
      factory: (el) => new PictureComponent(el, {
        sources: [
          { src: `${this._headConfig.imageSrc}.avif`, type: 'image/avif' },
          { src: `${this._headConfig.imageSrc}.webp`, type: 'image/webp' },
        ],
        fallback: `${this._headConfig.imageSrc}.jpg`,
        alt: `${this._headConfig.name} illustration picture`,
      },
      {
        className: 'screen-mock-content'
      })

  }}
}