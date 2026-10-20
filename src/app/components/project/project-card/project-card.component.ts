import { ProjectConfigFolder, ProjectConfigObject, ProjectService } from '../../../services/project/project.service.js';
import { Component, html, raw } from '../../../../core/index.js';
import { displayProjectModal } from '../project-modal/project-modal.js';
import { projectIcons } from './project-icons.js';

interface IProjectCard {
  folder: ProjectFolderName;
  project: ProjectConfigObject;
}

const templateFn = (_card: IProjectCard) => html`__TEMPLATE_PLACEHOLDER__`;

/**
 * Icon, name and tagline; the whole card opens the project's modal.
 * The card's id is the project's folder name, so `#<folder>` links can target it.
 */
export class ProjectCardComponent extends Component<HTMLElement, IProjectCard> {
  private readonly _initialConfig: ProjectConfigFolder;

  constructor(mountTarget: HTMLElement, config: ProjectConfigFolder, props?: Nutin.ComponentProps) {
    super({ templateFn, mountTarget, config: ProjectCardComponent.toCard(config), props });
    this._initialConfig = config;
    this.listenToRenderEvents(['language-changed']);
  }

  private static toCard(config: ProjectConfigFolder): IProjectCard {
    return { folder: ProjectService.parseFolderName(config), project: ProjectService.getProject(config) };
  }

  private _openModal(): void {
    displayProjectModal(this.config.project);
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    this.config = ProjectCardComponent.toCard(this._initialConfig);
  }
}
