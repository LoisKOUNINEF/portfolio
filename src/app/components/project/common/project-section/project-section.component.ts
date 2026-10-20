import { Component, html } from '../../../../../core/index.js';
import { BulletPointComponent } from '../../../common/bullet-point/bullet-point.component.js';

const templateFn = (_config: IProjectSection) => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectSectionComponent extends Component {
  private _section: IProjectSection;

  constructor(mountTarget: HTMLElement, config: IProjectSection) {
    super({ templateFn, mountTarget, config, tagName: 'article' });
    this._section = config;
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return this.getKeyPoints();
  }

  private getKeyPoints(): Nutin.ComponentConfig[] {
    if (!this._section.keyPoints) return []
    return this.createCatalogComponents({
      items: this._section.keyPoints,
      selector: `project-section-key-points`,
      component: BulletPointComponent,
      elementName: `project-section-key-point`
    })
  }
}
