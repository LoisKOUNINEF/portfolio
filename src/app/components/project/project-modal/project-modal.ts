import { ModalView } from '../../common/modal-host/modal-host.js';
import { html } from '../../../../core/index.js';
import { ProjectSectionComponent } from '../common/project-section/project-section.component.js';
import { ProjectHeaderComponent } from '../common/project-header/project-header.component.js';
import { ProjectLinksComponent } from '../common/project-links/project-links.component.js';

export const displayProjectModal = (project: IProject) => {
  const modal = new ModalView({
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
    selector: `${project.name}-modal-overview`,
    factory: (el) => new ProjectSectionComponent(el,
      project.overview
    )
  },
  {
    selector: `${project.name}-modal-purpose`,
    factory: (el) => new ProjectSectionComponent(el,
      project.purpose
    )
  },
  {
    selector: `${project.name}-modal-constraints`,
    factory: (el) => new ProjectSectionComponent(el,
      project.constraints
    )
  },
  {
    selector: `${project.name}-modal-learned`,
    factory: (el) => new ProjectSectionComponent(el,
      project.learned
    )
  },
  {
    selector: `${project.name}-modal-links`,
    factory: (el) => new ProjectLinksComponent(el,
      project.links
    )
  },
];

const projectModalCatalogs = (project: IProject): Nutin.CatalogConfig[] => [
  {
    selector: `${project.name}-modal-choices`,
    component: ProjectSectionComponent,
    items: project.choices,
    elementName: `${project.name}-modal-choice`
  },
  {
    selector: `${project.name}-modal-challenges`,
    component: ProjectSectionComponent,
    items: project.challenges,
    elementName: `${project.name}-modal-challenge`
  },
];
