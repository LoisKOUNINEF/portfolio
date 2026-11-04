import { Component, html } from '../../../../core/index.js';

export interface ButtonConfig {
  callback: () => void;
  textContent?: string;
  i18nKey?: string;
  className?: string;
  ariaLabel?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
  // Hint shown on hover/focus (<a11y-tooltip>, a11y-elements, defined in main.ts)
  tooltip?: string;
}

const optionalAttr = (name: string, value: string | boolean | undefined) =>
  value === undefined ? '' : html`${name}="${String(value)}"`;

// tabindex="0": Safari's default Tab order skips native controls without an explicit tabindex
const templateFn = (config: ButtonConfig) => html`<button type="button" class="app-button ${config.className}" tabindex="0" data-event="click:_onClick" ${optionalAttr('data-i18n', config.i18nKey)} ${optionalAttr('aria-label', config.ariaLabel)} ${optionalAttr('aria-controls', config.ariaControls)} ${optionalAttr('aria-expanded', config.ariaExpanded)}>${config.textContent}</button>`;

/**
 * Note : To ensure 'this' is bound properly
 * ```typescript
 * // Will handle 'this' inside doStuff
 * { callback: () => this.doStuff() }
 * ```
*/
export class ButtonComponent extends Component<HTMLElement, ButtonConfig> {
  constructor(mountTarget: HTMLElement, config: ButtonConfig) {
    super({ templateFn, mountTarget, config });
  }

  private _tooltip: HTMLElementTagNameMap['a11y-tooltip'] | null = null;

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    this._removeTooltip();
  }

  protected override onAfterRender(): void {
    super.onAfterRender();
    const button = this.element.querySelector('button');
    if (this.config.tooltip === undefined || !button) return;
    // Created here, not in the template: the tooltip portals itself to <body> on connect, so it can't be
    // queried back from this.element. Anchored by element before it connects, so its onConnect binds
    // hover/focus on the <button> itself (focus doesn't bubble)
    const tooltip = document.createElement('a11y-tooltip');
    tooltip.textContent = this.config.tooltip;
    tooltip.anchorElement = button;
    this.element.append(tooltip);
    this._tooltip = tooltip;
  }

  // It lives in <body>, outside this.element: removed by hand on re-render and destroy
  protected override onBeforeDestroy(): void {
    this._removeTooltip();
  }

  private _removeTooltip(): void {
    this._tooltip?.remove();
    this._tooltip = null;
  }

  protected _onClick(): void {
    this.config.callback();
  }
}
