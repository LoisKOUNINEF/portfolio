import { Component, html } from '../../../../../core/index.js';
import { ExternalLinkComponent } from '../../../common/external-link/external-link.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectLinksComponent extends Component {
  private _links: IProjectLink[];

  constructor(mountTarget: HTMLElement, config: IProjectLink[]) {
    super({templateFn, mountTarget, config});
    this._links = config;
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: `project-links`,
      items: this._links,
      component: ExternalLinkComponent,
      elementName: `project-link`
    })
  }
}
