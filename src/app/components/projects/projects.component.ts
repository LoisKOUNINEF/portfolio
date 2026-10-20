import { Component, html } from '../../../core/index.js';
import { ITab, TabsComponent } from '../common/tabs/tabs.component.js';
import { ProjectGridComponent } from '../project/project-grid/project-grid.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

const PROJECT_GROUPS: Record<'apps' | 'tools' | 'infra', ProjectFolderName[]> = {
  apps: ['paris-2024', 'retro-cabinet', 'notelet', 'narrative-palettes'],
  tools: ['nutin', 'a11y-elements'],
  infra: ['self-hosting', 'ci-cd', 'mailer'],
};

export class ProjectsComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({ templateFn, mountTarget, tagName: 'section' });
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [{
      selector: 'projects-tabs',
      factory: (el) => new TabsComponent(el, {
        titleI18nKey: 'projects.title',
        labelI18nKey: 'projects.tabs-label',
        selected: 'apps',
        tabs: this.getTabs(),
      }),
      keep: 'projects-tabs',
    }];
  }

  private getTabs(): ITab[] {
    return Object.entries(PROJECT_GROUPS).map(([name, folders]) => ({
      name,
      i18nKey: `projects.${name}`,
      factory: (el) => new ProjectGridComponent(el, folders),
    }));
  }
}
