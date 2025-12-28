import { Component, ComponentConfig } from '../../../../../core/index.js';
import { ExternalLinkComponent } from '../../../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ProjectLinksComponent extends Component {
  private _links: IProjectLink[];

  constructor(mountTarget: HTMLElement, config: IProjectLink[]) {
    super({templateFn, mountTarget, config});
    this._links = config;
  }

  public childConfigs(): ComponentConfig[] {
    return this.catalogConfig({
      selector: `project-links`,
      array: this._links,
      component: ExternalLinkComponent,
      elementName: `project-link`
    })
  }
}
