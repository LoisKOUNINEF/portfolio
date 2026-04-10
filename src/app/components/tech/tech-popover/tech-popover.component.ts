import { PopoverView } from "../../../../libs/index.js";
import { CatalogConfig, ComponentConfig } from "../../../../core/index.js";
import {
} from "../../index.js";

export const displayTechPop = (tech: ITech) => {
  const pop = new PopoverView({
    template: techPopoverTemplate(tech),
    // components: techPopoverComponents(tech),
    // catalogs: techPopoverCatalogs(tech),
  })
  pop.render();
}

const techPopoverTemplate = (_tech: ITech) => `__TEMPLATE_PLACEHOLDER__`;

// const projectPopoverComponents = (tech: ITech): ComponentConfig[] => [
//   {
//     selector: `${project.name}-popover-header`,
//     factory: (el) => new ProjectHeaderComponent(el, {
//       name: project.name,
//       imageSrc: project.imageSrc,
//       tagline: project.popTagline,
//       technos: project.technos,
//       tags: project.tags,
//       displayTechIcons: true,
//     })
//   },
//   {
//     selector: `${project.name}-popover-overview`,
//     factory: (el) => new ProjectSectionComponent(el,
//         project.overview
//     )
//   },
//   {
//     selector: `${project.name}-popover-purpose`,
//     factory: (el) => new ProjectSectionComponent(el,
//         project.purpose
//     )
//   },
// ];
//
// const techPopoverCatalogs = (tech: ITech): CatalogConfig[] => [
//   {
//     selector: `${project.name}-popover-choices`,
//     component: ProjectSectionComponent,
//     array: project.choices,
//     elementName: `${project.name}-popover-choice`
//   }
// ];
