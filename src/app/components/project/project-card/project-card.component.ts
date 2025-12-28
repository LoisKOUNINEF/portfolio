import { ProjectConfigFolder, ProjectConfigObject, ProjectService } from '../../../services/index.js';
import { AppEventBus, Component, ComponentConfig, ComponentProps } from '../../../../core/index.js';
import { displayProjectPop, ProjectHeaderComponent, ProjectLinksComponent, ButtonComponent, ProjectSectionComponent } from '../../index.js';

const templateFn = (_project: ProjectConfigObject) => `__TEMPLATE_PLACEHOLDER__`;

export class ProjectCardComponent extends Component {
  private _project: ProjectConfigObject;
  private readonly _initialConfig: ProjectConfigFolder;

  constructor(mountTarget: HTMLElement, config: ProjectConfigFolder, props?: ComponentProps) {
    const project = ProjectService.getProject(config);

    super({ templateFn, mountTarget, config: project, props });

    this._project = project;
    this._initialConfig = config;
    AppEventBus.subscribe('language-changed', () => this.forceRender());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      this.getHeaderConfig(),
      this.getPresentationConfig(),
      this.getLinksConfig(),
      this.getViewMoreBtnConfig()
    ]
  }

  private getHeaderConfig(): ComponentConfig {
    const { name, imageSrc, tagline, technos } = {...this._project};
    return {
      selector: `project-card-header`,
      factory: (el) => new ProjectHeaderComponent(
        el,
        { name, imageSrc, tagline, technos }
      )
    }
  }

  private getPresentationConfig(): ComponentConfig {
    return {
      selector: `project-card-presentation`,
      factory: (el) => new ProjectSectionComponent(el, 
        this._project.presentation
      ),
    }
  }

  private getLinksConfig(): ComponentConfig {
    return {
      selector: `project-card-links`,
      factory: (el) => new ProjectLinksComponent(el,
        this._project.links
      )
    }
  }

  private getViewMoreBtnConfig(): ComponentConfig {
    return {
      selector: `project-card-view-more`,
      factory: (el) => new ButtonComponent(el, {
        i18nKey: 'project-card.view-more',
        className: 'project-card__view-more',
        callback: () => this.displayPop()
      })
    }
  }

  private displayPop() {
    displayProjectPop(this._project);
  }

  protected override forceRender(): void {
    this._project = ProjectService.getProject(this._initialConfig);
    super.forceRender();
  }
}
