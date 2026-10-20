import { ProjectConfigFolder, ProjectConfigObject, ProjectService } from '../../../services/project/project.service.js';
import { Component, html, raw } from '../../../../core/index.js';
import { PictureComponent } from '../../common/picture/picture.component.js';
import { displayProjectModal } from '../project-modal/project-modal.js';
import { projectIcons } from './project-icons.js';

interface IProjectCard {
  folder: ProjectFolderName;
  project: ProjectConfigObject;
}

const templateFn = (_card: IProjectCard) => html`__TEMPLATE_PLACEHOLDER__`;

/**
 * Icon, name and tagline, then the project's picture (or an empty slot of the same size
 * until it has one); the whole card opens the project's modal.
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

  public registerChildren(): Nutin.ComponentConfig[] {
    const imageSrc = this.config.project.imageSrc;
    if (!imageSrc) return [];
    return [{
      selector: 'project-card-picture',
      factory: (el) => new PictureComponent(el, {
        sources: [
          { src: `${imageSrc}.avif`, type: 'image/avif' },
          { src: `${imageSrc}.webp`, type: 'image/webp' },
        ],
        fallback: `${imageSrc}.jpg`,
        // Decorative: the card's name and tagline already say what it shows
        alt: '',
      }),
    }];
  }

  private _openModal(): void {
    displayProjectModal(this.config.project);
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    this.config = ProjectCardComponent.toCard(this._initialConfig);
  }
}
