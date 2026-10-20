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

/**
 * Renders `<a11y-tabs>` (a11y-elements, defined in main.ts), which handles the
 * ARIA tabs pattern, keyboard navigation and revealing a panel when a link targets
 * something inside it.
 * Small screens only: the tablist is shown solely as a rail docked on the right side of
 * the viewport, while the section covers the middle of the screen. Larger screens keep
 * it inline under the section heading.
 */
export class TabsComponent extends Component<HTMLElementTagNameMap['a11y-tabs'], ITabsConfig> {
  private _observers: IntersectionObserver[] = [];
  private _smallScreen: MediaQueryList | null = null;
  private _isSectionCentered = false;

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
  }

  protected override onBeforeDestroy(): void {
    super.onBeforeDestroy();
    this.disconnectObservers();
  }

  private observe(): void {
    this.disconnectObservers();

    // A thin band across the middle of the viewport: only one section can be "current"
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) this._isSectionCentered = entry.isIntersecting;
      this.updateDocking();
    }, { rootMargin: '-50% 0px -50% 0px' });
    sectionObserver.observe(this.element);

    this._observers = [sectionObserver];
  }

  private disconnectObservers(): void {
    this._observers.forEach((observer) => observer.disconnect());
    this._observers = [];
  }

  // The tablist is out of the flow either way on small screens (hidden, or fixed when
  // docked), so docking never changes the layout
  private updateDocking(): void {
    const docked = (this._smallScreen?.matches ?? false) && this._isSectionCentered;
    if (docked === this.element.classList.contains('tabs--docked')) return;

    this.element.classList.toggle('tabs--docked', docked);
    this.element.setAttribute('orientation', docked ? 'vertical' : 'horizontal');
  }
}
