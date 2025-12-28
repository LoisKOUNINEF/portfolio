import { PopoverView } from "../../../../libs/index.js";
import { CatalogConfig, ComponentConfig } from "../../../../core/index.js";
import {
  ProjectSectionComponent,
  ProjectHeaderComponent,
  ProjectLinksComponent,
} from "../../index.js";

export const displayProjectPop = (project: IProject) => {
  const pop = new PopoverView({
    template: projectPopoverTemplate(project),
    viewName: project.name,
    children: projectPopoverChildren(project),
    catalogs: projectPopoverCatalogs(project),
  })
  pop.render();
}

const projectPopoverTemplate = (_project: IProject) => `__TEMPLATE_PLACEHOLDER__`;

const projectPopoverChildren = (project: IProject): ComponentConfig[] => [
  {
    selector: `${project.name}-popover-header`,
    factory: (el) => new ProjectHeaderComponent(el, {
      name: project.name,
      imageSrc: project.imageSrc,
      tagline: project.popTagline,
      technos: project.technos
    })
  },
  {
    selector: `${project.name}-popover-overview`,
    factory: (el) => new ProjectSectionComponent(el, 
      project.overview
    )
  },
  {
    selector: `${project.name}-popover-purpose`,
    factory: (el) => new ProjectSectionComponent(el, 
      project.purpose
    )
  },
  {
    selector: `${project.name}-popover-constraints`,
    factory: (el) => new ProjectSectionComponent(el, 
      project.constraints
    )
  },
  {
    selector: `${project.name}-popover-learned`,
    factory: (el) => new ProjectSectionComponent(el, 
      project.learned
    )
  },
  {
    selector: `${project.name}-popover-links`,
    factory: (el) => new ProjectLinksComponent(el, 
      project.links
    )
  },
];

const projectPopoverCatalogs = (project: IProject): CatalogConfig[] => [
  {
    selector: `${project.name}-popover-choices`,
    component: ProjectSectionComponent,
    array: project.choices,
    elementName: `${project.name}-popover-choice`
  },
  {
    selector: `${project.name}-popover-challenges`,
    component: ProjectSectionComponent,
    array: project.challenges,
    elementName: `${project.name}-popover-challenge`
  },
];
