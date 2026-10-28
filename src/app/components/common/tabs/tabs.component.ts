import { Component, I18nService, html } from '../../../../core/index.js';

export interface ITab {
  name: string;
  i18nKey: string;
  // Content of the tab's panel; kept across re-renders
  factory: Nutin.ComponentConfig['factory'];
}

export interface ITabsConfig {
  // Section heading (h2), on the same line as the small-screen picker
  titleI18nKey: string;
  // Accessible name of the tablist (and of the picker)
  labelI18nKey: string;
  tabs: ITab[];
  // Defaults to the first tab
  selected?: string;
}

const templateFn = (config: ITabsConfig) => html`__TEMPLATE_PLACEHOLDER__`;

/**
 * Renders a section heading and `<a11y-tabs>` (a11y-elements, defined in main.ts), which
 * handles the ARIA tabs pattern, keyboard navigation and revealing a panel when a link
 * targets something inside it.
 * Small screens replace the tablist with a native <select> on the heading line, kept in
 * sync with the tabs both ways.
 */
export class TabsComponent extends Component<HTMLElementTagNameMap['a11y-tabs'], ITabsConfig> {
  constructor(mountTarget: HTMLElement, config: ITabsConfig) {
    super({ templateFn, mountTarget, config, tagName: 'a11y-tabs' });
    // Set once: from then on <a11y-tabs> owns the selection (user, links, hash), and its
    // root element (with the attribute) survives re-renders
    this.element.setAttribute('selected', config.selected ?? config.tabs[0]?.name ?? '');
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return this.config.tabs.map((tab) => ({
      selector: `tab-panel-${tab.name}`,
      factory: tab.factory,
      keep: tab.name,
    }));
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    this.element.setAttribute('label', I18nService.translate(this.config.labelI18nKey));
    // Tabs → picker: keyboard (larger screens), links and URL hash
    this.element.onChange = (name) => this.syncPicker(name);
    this.syncPicker(this.element.selected);
  }

  // Picker → tabs. Nutin's @value token doesn't read <select>s, hence @target
  private _onPick(picker: HTMLSelectElement): void {
    this.element.select(picker.value);
  }

  private syncPicker(name: string): void {
    const picker = this.element.querySelector<HTMLSelectElement>('.tabs__picker');
    if (picker && name) picker.value = name;
  }
}
