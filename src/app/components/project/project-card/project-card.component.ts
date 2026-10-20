import { ProjectConfigFolder, ProjectConfigObject, ProjectService } from '../../../services/project/project.service.js';
import { Component, html } from '../../../../core/index.js';
import { ButtonComponent } from '../../common/button/button.component.js';
import { displayProjectModal } from '../project-modal/project-modal.js';
import { ProjectHeaderComponent } from '../common/project-header/project-header.component.js';
import { ProjectLinksComponent } from '../common/project-links/project-links.component.js';
import { ProjectSectionComponent } from '../common/project-section/project-section.component.js';

const templateFn = (_project: ProjectConfigObject) => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectCardComponent extends Component {
  private _project: ProjectConfigObject;
  private readonly _initialConfig: ProjectConfigFolder;

  constructor(mountTarget: HTMLElement, config: ProjectConfigFolder, props?: Nutin.ComponentProps) {
    const project = ProjectService.getProject(config);

    super({ templateFn, mountTarget, config: project, props });

    this._project = project;
    this._initialConfig = config;
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      this.getHeaderConfig(),
      this.getPresentationConfig(),
      this.getLinksConfig(),
      this.getViewMoreBtnConfig()
    ]
  }

  private getHeaderConfig(): Nutin.ComponentConfig {
    const { name, imageSrc, tagline, technos, tags } = {...this._project};
    return {
      selector: `project-card-header`,
      factory: (el) => new ProjectHeaderComponent(
        el,
        { name, imageSrc, tagline, technos, tags }
      )
    }
  }

  private getPresentationConfig(): Nutin.ComponentConfig {
    return {
      selector: `project-card-presentation`,
      factory: (el) => new ProjectSectionComponent(el, 
        this._project.presentation
      ),
    }
  }

  private getLinksConfig(): Nutin.ComponentConfig {
    return {
      selector: `project-card-links`,
      factory: (el) => new ProjectLinksComponent(el,
        this._project.links
      )
    }
  }

  private getViewMoreBtnConfig(): Nutin.ComponentConfig {
    return {
      selector: `project-card-view-more`,
      factory: (el) => new ButtonComponent(el, {
        i18nKey: 'project-card.view-more',
        className: 'project-card__view-more',
        callback: () => this.displayModal()
      })
    }
  }

  private displayModal() {
    displayProjectModal(this._project);
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    this._project = ProjectService.getProject(this._initialConfig);
  }
}
