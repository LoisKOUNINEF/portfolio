import { Component, I18nService, html } from '../../../../core/index.js';
import { ButtonComponent } from '../../common/button/button.component.js';
import { ProjectCardComponent } from '../project-card/project-card.component.js';

const templateFn = (config: IProjectGrid) => html`__TEMPLATE_PLACEHOLDER__`;

// Cards shown before the "+X more projects…" toggle
const MAX_VISIBLE = 3;

interface IProjectGrid {
  folders: ProjectFolderName[];
  visibleCount: number;
  // For the toggle's aria-controls
  gridId: string;
}

/**
 * The first `visibleCount` project cards; the others are hidden behind a
 * "+X more projects…" / "Show less" toggle. A same-page link or URL hash targeting a
 * hidden card expands the grid first, so the jump lands on a visible card.
 */
export class ProjectGridComponent extends Component<HTMLElement, IProjectGrid> {
  private _expanded = false;
  // Capture phase: must run before the link's own handler looks for its target
  private readonly _onLinkClick = (e: Event): void => {
    const href = (e.target as Element | null)?.closest?.('a[href^="#"]')?.getAttribute('href');
    if (href) this.revealTarget(href);
  };

  constructor(mountTarget: HTMLElement, folders: ProjectFolderName[], visibleCount = MAX_VISIBLE) {
    super({ templateFn, mountTarget, config: { folders, visibleCount, gridId: `project-grid-${folders[0] ?? ''}` } });
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    const children = this.createCatalogComponents({
      items: this.config.folders,
      selector: 'project-grid',
      elementName: 'project-grid-item',
      component: ProjectCardComponent,
      keepBy: (folder: ProjectFolderName) => folder,
    });
    if (!this.hiddenCount()) return children;
    return [...children, {
      selector: 'project-grid-more',
      factory: (el) => new ButtonComponent(el, {
        textContent: this.toggleText(),
        // "+X more projects…" toggle: same look as the pre-rework "show more" button
        className: 'project-grid__more py-smallest px-0 border-none rounded-large bg-transparent text-accent font-secondary text-[1.1rem] italic underline-offset-[3px] hover:underline focus-visible:underline focus-visible:outline-1 focus-visible:outline-accent focus-visible:outline-offset-2',
        ariaControls: this.config.gridId,
        ariaExpanded: this._expanded,
        callback: () => this.toggle(),
      }),
    }];
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    document.removeEventListener('click', this._onLinkClick, true);
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    if (!this.hiddenCount()) return;
    this.applyVisibility();
    // Links and hash: client-only (SSR prerendering has no location)
    if (typeof location === 'undefined') return;
    document.addEventListener('click', this._onLinkClick, true);
    const onHashChange: EventListener = () => this.revealTarget(location.hash, true);
    window.addEventListener('hashchange', onHashChange);
    this.eventListeners.push([window, 'hashchange', onHashChange]);
    this.revealTarget(location.hash);
  }

  protected override onBeforeDestroy(): void {
    super.onBeforeDestroy();
    document.removeEventListener('click', this._onLinkClick, true);
  }

  private hiddenCount(): number {
    return Math.max(0, this.config.folders.length - this.config.visibleCount);
  }

  private toggleText(): string {
    if (this._expanded) return I18nService.translate('project-grid.less', 'Show less');
    const count = this.hiddenCount();
    const key = count === 1 ? 'project-grid.more-one' : 'project-grid.more-other';
    return I18nService.translate(key, '+{n} more projects…').replace('{n}', String(count));
  }

  private items(): HTMLElement[] {
    const grid = this.element.querySelector<HTMLElement>('.project-grid');
    return grid ? [...grid.children] as HTMLElement[] : [];
  }

  // Hidden cards are out of the layout, the tab order and the accessibility tree
  private applyVisibility(): void {
    this.items().forEach((item, index) => {
      item.hidden = !this._expanded && index >= this.config.visibleCount;
    });
    const button = this.element.querySelector<HTMLButtonElement>('.project-grid__more');
    if (button) {
      button.textContent = this.toggleText();
      button.setAttribute('aria-expanded', String(this._expanded));
    }
  }

  private toggle(): void {
    this._expanded = !this._expanded;
    this.applyVisibility();
    // Keyboard and screen-reader users land on the first revealed card
    if (this._expanded) {
      this.items()[this.config.visibleCount]?.querySelector<HTMLElement>('.project-card__button')?.focus();
    }
  }

  // Expands the grid when `hash` targets one of its hidden cards
  private revealTarget(hash: string, scroll = false): void {
    if (this._expanded || hash.length < 2) return;
    let target: HTMLElement | null = null;
    try {
      target = document.getElementById(decodeURIComponent(hash.slice(1)));
    } catch {
      return; // malformed escape sequence
    }
    const hiddenItems = this.items().slice(this.config.visibleCount);
    if (!target || !hiddenItems.some((item) => item.contains(target))) return;
    this._expanded = true;
    this.applyVisibility();
    if (scroll) target.scrollIntoView();
  }
}
