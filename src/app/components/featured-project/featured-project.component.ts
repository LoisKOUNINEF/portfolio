import { Component, I18nService, html } from '../../../core/index.js';
import { AnchorComponent } from '../common/anchor/anchor.component.js';
import { PictureComponent } from '../common/picture/picture.component.js';
import { displayProjectModal } from '../project/project-modal/project-modal.js';
import { ProjectService } from '../../services/project/project.service.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// Quiet time after the last scroll event that counts as the jump being over (also
// covers a jump that doesn't scroll). Not `scrollend`: one left over from an earlier
// scroll would open the modal too early. Longer than <a11y-anchor>'s 100ms delay
// before focusing the target, so that focus doesn't land after the modal's.
const SCROLL_IDLE_MS = 150;

/**
 * Short presentation of Nutin; its link jumps to the Projects section (so closing the
 * modal leaves the whole section in view), selects the Tools tab holding the Nutin
 * card, then opens the project's modal once the scroll is over.
 */
export class FeaturedProjectComponent extends Component {
  private readonly _folder: ProjectFolderName = 'nutin';
  private readonly _imageSrc = '/assets/images/projects/nutin';
  private _pendingJump = false;

  constructor(mountTarget: HTMLElement) {
    super({ templateFn, mountTarget, tagName: 'section' });
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'featured-project-picture',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: `${this._imageSrc}.avif`, type: 'image/avif' },
            { src: `${this._imageSrc}.webp`, type: 'image/webp' },
          ],
          fallback: `${this._imageSrc}.jpg`,
          alt: I18nService.translate('featured-project.image-alt'),
        }, {
          className: 'featured-project__screen-content',
        }),
      },
      {
        selector: 'featured-project-link',
        factory: (el) => new AnchorComponent(el, {
          href: '#projects',
          i18nKey: 'featured-project.link',
          className: 'featured-project__link',
        }),
      },
    ];
  }

  // <a11y-anchor> also activates the link on Space, without a click
  private _onLinkKeydown(event: KeyboardEvent): void {
    if (event.key === ' ' && (event.target as Element).closest('a[href]')) this._openProjectAfterScroll();
  }

  // A modified or non-primary click opens the link elsewhere (new tab/window): no jump here
  private _onLinkClick(event: MouseEvent): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    this._openProjectAfterScroll();
  }

  // Runs after <a11y-anchor>'s own handler on the link, so the scroll has started.
  // One jump at a time: a second activation during the scroll would open a second modal
  private _openProjectAfterScroll(): void {
    if (this._pendingJump) return;
    this._pendingJump = true;
    const card = document.getElementById(this._folder);
    // The link targets the section, not the card: select the card's tab ourselves
    if (card) card.closest('a11y-tabs')?.reveal(card);
    let idleTimer: ReturnType<typeof setTimeout>;
    const done = (): void => {
      clearTimeout(idleTimer);
      window.removeEventListener('scroll', onScroll);
      this._pendingJump = false;
      // The modal returns focus to what was focused when it opened: the card's own
      // button, as if the modal had been opened from the card
      card?.querySelector<HTMLElement>('.project-card__button')?.focus({ preventScroll: true });
      displayProjectModal(ProjectService.getProject(this._folder));
    };
    const onScroll = (): void => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(done, SCROLL_IDLE_MS);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
}
