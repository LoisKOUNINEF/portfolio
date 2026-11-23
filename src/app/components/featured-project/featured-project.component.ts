import { Component, I18nService, html } from '../../../core/index.js';
import { AnchorComponent } from '../common/anchor/anchor.component.js';
import { PictureComponent } from '../common/picture/picture.component.js';
import { openProjectAfterScroll } from '../project/project-modal/project-modal.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

/**
 * Short presentation of Nutin; its link jumps to the Projects section (so closing the
 * modal leaves the whole section in view), selects the Tools tab holding the Nutin
 * card, then opens the project's modal once the scroll is over.
 */
export class FeaturedProjectComponent extends Component {
  private readonly _folder: ProjectFolderName = 'nutin';
  private readonly _imageSrc = '/assets/images/projects/nutin';

  constructor(mountTarget: HTMLElement) {
    super({ templateFn, mountTarget, tagName: 'section' });
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'featured-project-picture',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: `${this._imageSrc}.avif`, type: 'image/avif' },
            { src: `${this._imageSrc}.webp`, type: 'image/webp' },
          ],
          fallback: `${this._imageSrc}.jpg`,
          // The screen is at most 17rem wide; hidden on small screens (lazy, so not fetched there)
          sizes: '17rem',
          alt: I18nService.translate('featured-project.image-alt'),
        }, {
          className: 'screen-mock-content',
        }),
      },
      {
        selector: 'featured-project-link',
        factory: (el) => new AnchorComponent(el, {
          href: '#projects',
          i18nKey: 'featured-project.link',
          className: 'font-semibold',
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
  // The link targets the section, not the card: no scroll to the card
  private _openProjectAfterScroll(): void {
    openProjectAfterScroll(this._folder);
  }
}
