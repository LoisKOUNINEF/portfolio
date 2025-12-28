import { Component, ComponentConfig } from '../../../../../core/index.js';
import { BulletPointComponent } from '../../../index.js';

const templateFn = (_config: IProjectSection) => `__TEMPLATE_PLACEHOLDER__`;

export class ProjectSectionComponent extends Component {
  private _section: IProjectSection;

  constructor(mountTarget: HTMLElement, config: IProjectSection) {
    super({ templateFn, mountTarget, config, tagName: 'article' });
    this._section = config;
  }

  public childConfigs(): ComponentConfig[] {
    return this.getKeyPoints();
  }

  private getKeyPoints(): ComponentConfig[] {
    if (!this._section.keyPoints) return []
    return this.catalogConfig({
      array: this._section.keyPoints,
      selector: `project-section-key-points`,
      component: BulletPointComponent,
      elementName: `project-section-key-point`
    })
  }
}
