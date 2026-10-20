import { Component, html } from '../../../../core/index.js';

export interface ButtonConfig {
  callback: () => void;
  textContent?: string;
  i18nKey?: string;
  className?: string;
  ariaLabel?: string;
  ariaControls?: string;
  ariaExpanded?: boolean;
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

  protected _onClick(): void {
    this.config.callback();
  }
}
