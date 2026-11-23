import { ModalHost } from '../../common/modal-host/modal-host.js';
import { AppEventBus, html } from '../../../../core/index.js';
import { ProjectSectionComponent, ProjectSectionItem } from '../common/project-section/project-section.component.js';
import { PROJECT_SECTION_ORDER } from '../common/project-section/project-section-icons.js';
import { ProjectHeaderComponent } from '../common/project-header/project-header.component.js';
import { ProjectLinksComponent } from '../common/project-links/project-links.component.js';
import { ProjectService } from '../../../services/project/project.service.js';
import { setProjectParam } from '../../../services/project/project-url.helper.js';

// Quiet time after the last scroll event that counts as the jump being over
// (also covers a jump that doesn't scroll).
// Not `scrollend`: one left over from an earlier scroll would open the modal too early.
const SCROLL_IDLE_MS = 150;

/**
 * Opens the project's modal and names it in the URL (`?project=<folder>`) while it's open.
 * Back/forward closes it: the URL it leaves for no longer names this project.
 */
export const displayProjectModal = (folder: ProjectFolderName) => {
  const project = ProjectService.getProject(folder);
  const onPopState = (): void => modal.close();
  const modal = new ModalHost({
    template: projectModalTemplate(project),
    viewName: project.name,
    components: projectModalComponents(project),
    catalogs: projectModalCatalogs(project),
    onClose: () => {
      window.removeEventListener('popstate', onPopState);
      setProjectParam(null);
    },
  })
  modal.render();
  setProjectParam(folder);
  window.addEventListener('popstate', onPopState);
}

// One jump at a time: a second activation during the scroll would open a second modal
let pendingJump = false;

/**
 * Shows the project's card (its tab selected, its grid expanded), optionally scrolls to it,
 * then opens the project's modal once the scroll is over.
 * The modal returns focus to what was focused when it opened: the card's own button,
 * as if the modal had been opened from the card.
 */
export const openProjectAfterScroll = (folder: ProjectFolderName, { scrollToCard = false } = {}): void => {
  if (pendingJump) return;
  pendingJump = true;
  AppEventBus.emit('project-reveal', folder);
  const card = document.getElementById(folder);
  card?.closest('a11y-tabs')?.reveal(card);
  let idleTimer: ReturnType<typeof setTimeout>;
  const done = (): void => {
    clearTimeout(idleTimer);
    window.removeEventListener('scroll', onScroll);
    pendingJump = false;
    card?.querySelector<HTMLElement>('.project-card__button')?.focus({ preventScroll: true });
    displayProjectModal(folder);
  };
  const onScroll = (): void => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(done, SCROLL_IDLE_MS);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  // block 'start' honours the card's scroll-margin (clears the fixed navbar)
  if (scrollToCard) card?.scrollIntoView({ block: 'start' });
  onScroll();
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
