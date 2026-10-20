import { Component, I18nService, html } from '../../../../core/index.js';

export interface ITab {
  name: string;
  i18nKey: string;
  // Content of the tab's panel; kept across re-renders
  factory: Nutin.ComponentConfig['factory'];
}

export interface ITabsConfig {
  // Accessible name of the tablist
  labelI18nKey: string;
  tabs: ITab[];
  // Defaults to the first tab
  selected?: string;
}

const templateFn = (config: ITabsConfig) => html`__TEMPLATE_PLACEHOLDER__`;

// Same value as $breakpoints.medium (styles/base/_variables.scss)
const SMALL_SCREEN_QUERY = '(max-width: 815px)';

// The instance whose rail is docked: only one rail is shown at a time
let activeRail: TabsComponent | null = null;

// Space kept between the fixed navbar and a section heading scrolled to from the rail
const RAIL_SCROLL_GAP = 16;

/**
 * Renders `<a11y-tabs>` (a11y-elements, defined in main.ts), which handles the
 * ARIA tabs pattern, keyboard navigation and revealing a panel when a link targets
 * something inside it.
 * Small screens only: the tablist is shown solely as a rail docked on the right side of
 * the viewport. It docks when the section reaches the middle of the screen, then stays
 * while any part of the section is visible, so selecting a short panel can't make it
 * vanish. Another section docking takes over. Larger screens keep the tablist inline
 * under the section heading.
 */
export class TabsComponent extends Component<HTMLElementTagNameMap['a11y-tabs'], ITabsConfig> {
  private _observers: IntersectionObserver[] = [];
  private _smallScreen: MediaQueryList | null = null;
  private _isSectionCentered = false;
  private _isSectionVisible = false;
  // Selection when the user started interacting with a tab (see onAfterRender)
  private _selectedBefore: string | null = null;

  constructor(mountTarget: HTMLElement, config: ITabsConfig) {
    super({ templateFn, mountTarget, config, tagName: 'a11y-tabs' });
    // Set once: from then on <a11y-tabs> owns the selection (user, links, hash), and its
    // root element (with the attribute) survives re-renders
    this.element.setAttribute('selected', config.selected ?? config.tabs[0]?.name ?? '');
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return this.config.tabs.map((tab) => ({
      selector: `tab-panel-${tab.name}`,
      factory: tab.factory,
      keep: tab.name,
    }));
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    this.element.setAttribute('label', I18nService.translate(this.config.labelI18nKey));

    // Docking is client-only: SSR prerendering has neither IntersectionObserver nor matchMedia
    if (typeof IntersectionObserver === 'undefined' || typeof window.matchMedia !== 'function') return;
    this._smallScreen ??= window.matchMedia(SMALL_SCREEN_QUERY);
    const onMediaChange: EventListener = () => this.updateDocking();
    this._smallScreen.addEventListener('change', onMediaChange);
    this.eventListeners.push([this._smallScreen, 'change', onMediaChange]);
    this.observe();

    // Rail only: a tab picked by the user (tap, click or keys) brings the section's top into
    // view. The selection is read on the tab itself first (pointerdown/keydown, before
    // <a11y-tabs> changes it), then after <a11y-tabs>' handlers (click/keydown bubbling to
    // the tablist). Links and hashes selecting a tab aren't affected: they jump to their target.
    const list = this.element.querySelector<HTMLElement>('.tabs__list');
    if (!list) return;
    const onBeforeSelect: EventListener = () => { this._selectedBefore = this.element.selected; };
    list.querySelectorAll<HTMLElement>('.tabs__tab').forEach((tab) => {
      for (const type of ['pointerdown', 'keydown']) {
        tab.addEventListener(type, onBeforeSelect);
        this.eventListeners.push([tab, type, onBeforeSelect]);
      }
    });
    // Kept until the selection actually changes: Enter's keydown reaches the tablist
    // before the click it triggers
    const onAfterSelect: EventListener = () => {
      if (this._selectedBefore === null || this.element.selected === this._selectedBefore) return;
      this._selectedBefore = null;
      if (this.element.classList.contains('tabs--docked')) this.scrollToSectionTop();
    };
    for (const type of ['click', 'keydown']) {
      list.addEventListener(type, onAfterSelect);
      this.eventListeners.push([list, type, onAfterSelect]);
    }
  }

  // The section heading, just below the fixed navbar
  private scrollToSectionTop(): void {
    const section = this.element.closest<HTMLElement>('section, article') ?? this.element;
    const heading = section.querySelector<HTMLElement>('h2') ?? section;
    const navbarHeight = document.getElementById('header')?.offsetHeight ?? 0;
    const top = heading.getBoundingClientRect().top + window.scrollY - navbarHeight - RAIL_SCROLL_GAP;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  protected override onBeforeDestroy(): void {
    super.onBeforeDestroy();
    this.disconnectObservers();
    if (activeRail === this) activeRail = null;
  }

  private observe(): void {
    this.disconnectObservers();

    // A thin band across the middle of the viewport: only one section can be "current"
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) this._isSectionCentered = entry.isIntersecting;
      this.updateDocking();
    }, { rootMargin: '-50% 0px -50% 0px' });
    sectionObserver.observe(this.element);

    // Any part of the section on screen: keeps an already docked rail
    const visibilityObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) this._isSectionVisible = entry.isIntersecting;
      this.updateDocking();
    });
    visibilityObserver.observe(this.element);

    this._observers = [sectionObserver, visibilityObserver];
  }

  private disconnectObservers(): void {
    this._observers.forEach((observer) => observer.disconnect());
    this._observers = [];
  }

  // Docks when the section reaches the middle of the screen, stays docked while it's
  // visible. The tablist is out of the flow either way on small screens (hidden, or fixed
  // when docked), so docking never changes the layout.
  private updateDocking(): void {
    const wasDocked = this.element.classList.contains('tabs--docked');
    const small = this._smallScreen?.matches ?? false;
    const docked = small && (wasDocked ? this._isSectionVisible : this._isSectionCentered);
    if (docked === wasDocked) return;

    if (docked) {
      if (activeRail && activeRail !== this) activeRail.setDocked(false);
      activeRail = this;
    } else if (activeRail === this) {
      activeRail = null;
    }
    this.setDocked(docked);
  }

  private setDocked(docked: boolean): void {
    this.element.classList.toggle('tabs--docked', docked);
    this.element.setAttribute('orientation', docked ? 'vertical' : 'horizontal');
  }
}
