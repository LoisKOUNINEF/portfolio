import { ModalHost } from '../../common/modal-host/modal-host.js';
import { html } from '../../../../core/index.js';
import { ProjectSectionComponent, ProjectSectionItem } from '../common/project-section/project-section.component.js';
import { PROJECT_SECTION_ORDER } from '../common/project-section/project-section-icons.js';
import { ProjectHeaderComponent } from '../common/project-header/project-header.component.js';
import { ProjectLinksComponent } from '../common/project-links/project-links.component.js';

export const displayProjectModal = (project: IProject) => {
  const modal = new ModalHost({
    template: projectModalTemplate(project),
    viewName: project.name,
    components: projectModalComponents(project),
    catalogs: projectModalCatalogs(project),
  })
  modal.render();
}

const projectModalTemplate = (_project: IProject) => html`__TEMPLATE_PLACEHOLDER__`;

const projectModalComponents = (project: IProject): Nutin.ComponentConfig[] => [
  {
    selector: `${project.name}-modal-header`,
    factory: (el) => new ProjectHeaderComponent(el, {
      name: project.name,
      imageSrc: project.imageSrc,
      tagline: project.popTagline,
      technos: project.technos,
      tags: project.tags,
      displayTechIcons: true,
    })
  },
  {
    selector: `${project.name}-modal-links`,
    factory: (el) => new ProjectLinksComponent(el, {
      name: project.name,
      links: project.links ?? {},
    })
  },
];

const projectModalCatalogs = (project: IProject): Nutin.CatalogConfig[] => [
  {
    selector: `${project.name}-modal-sections`,
    component: ProjectSectionComponent,
    items: PROJECT_SECTION_ORDER.map((key): ProjectSectionItem => ({ key, ...project.sections[key] })),
    elementName: `${project.name}-modal-section`
  },
];
