import { ModalView } from "../../../../libs/index.js";
import { CatalogConfig, ComponentConfig } from "../../../../core/index.js";
import {
  ProjectSectionComponent,
  ProjectHeaderComponent,
  ProjectLinksComponent,
} from "../../index.js";

export const displayProjectModal = (project: IProject) => {
  const modal = new ModalView({
    template: projectModalTemplate(project),
    viewName: project.name,
    components: projectModalComponents(project),
    catalogs: projectModalCatalogs(project),
  })
  modal.render();
}

const projectModalTemplate = (_project: IProject) => `__TEMPLATE_PLACEHOLDER__`;

const projectModalComponents = (project: IProject): ComponentConfig[] => [
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

const projectModalCatalogs = (project: IProject): CatalogConfig[] => [
  {
    selector: `${project.name}-modal-choices`,
    component: ProjectSectionComponent,
    array: project.choices,
    elementName: `${project.name}-modal-choice`
  },
  {
    selector: `${project.name}-modal-challenges`,
    component: ProjectSectionComponent,
    array: project.challenges,
    elementName: `${project.name}-modal-challenge`
  },
];
