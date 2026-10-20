import { Component, html } from '../../../../core/index.js';
import { ProjectCardComponent } from '../project-card/project-card.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

interface IProjectGrid {
  folders: ProjectFolderName[];
}

export class ProjectGridComponent extends Component<HTMLElement, IProjectGrid> {
  constructor(mountTarget: HTMLElement, folders: ProjectFolderName[]) {
    super({ templateFn, mountTarget, config: { folders } });
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      items: this.config.folders,
      selector: 'project-grid',
      elementName: 'project-grid-item',
      component: ProjectCardComponent,
      keepBy: (folder: ProjectFolderName) => folder,
    });
  }
}
