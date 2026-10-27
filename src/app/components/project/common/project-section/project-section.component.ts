import { Component, html } from '../../../../../core/index.js';
import { PictureComponent } from '../../../common/picture/picture.component.js';
import { IProjectKeyPoint, ProjectKeyPointComponent } from '../project-key-point/project-key-point.component.js';

type ProjectSectionConfig = Nutin.CatalogItemConfig<IProjectSection>;

// imagePosition only matters when there is an image to place; small screens stack it anyway
const imageModifier = (section: IProjectSection): string =>
  section.sectionImageSrc && section.imagePosition === 'left' ? 'flex-row-reverse' : '';

const templateFn = (_config: ProjectSectionConfig) => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectSectionComponent extends Component {
  private _section: ProjectSectionConfig;

  constructor(mountTarget: HTMLElement, config: ProjectSectionConfig) {
    super({ templateFn, mountTarget, config, tagName: 'article' });
    this._section = config;
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    const configs = this.getKeyPoints();
    if (this._section.sectionImageSrc) configs.push(this.getPictureConfig(this._section.sectionImageSrc));
    return configs;
  }

  private getKeyPoints(): Nutin.ComponentConfig[] {
    if (!this._section.sectionKeyPoints) return [];
    const items: IProjectKeyPoint[] = this._section.sectionKeyPoints.flatMap((keyPoint) =>
      Object.entries(keyPoint).map(([label, text]) => ({ label, text }))
    );
    return this.createCatalogComponents({
      items,
      selector: `project-section-key-points`,
      component: ProjectKeyPointComponent,
      elementName: `project-section-key-point`
    })
  }

  private getPictureConfig(imageSrc: string): Nutin.ComponentConfig {
    return {
      selector: 'project-section-picture',
      factory: (el) => new PictureComponent(el, {
        sources: [
          { src: `${imageSrc}.avif`, type: 'image/avif' },
          { src: `${imageSrc}.webp`, type: 'image/webp' },
        ],
        fallback: `${imageSrc}.jpg`,
        alt: `${this._section.sectionName} illustration picture`,
      },
      {
        className: 'project-section__picture-content'
      })
    }
  }
}
