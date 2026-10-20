import { Component, html } from '../../../../core/index.js';

export interface IAnchorConfig {
  // prefix href with '#' for internal anchor
  href: string;
  target?: string;
  i18nKey?: string;
  textContent?: string;
  className?: string;
  ariaLabel?: string;
}

const optionalAttr = (name: string, value: string | undefined) =>
  value === undefined ? '' : html`${name}="${value}"`;

const templateFn = (config: IAnchorConfig) => html`<a href="${config.href}" class="${config.className}" ${optionalAttr('target', config.target)} ${optionalAttr('data-i18n', config.i18nKey)} ${optionalAttr('aria-label', config.ariaLabel)}>${config.textContent}</a>`;

/**
 * Renders a real `<a>` inside `<a11y-anchor>` (a11y-elements, defined in main.ts), which handles
 * new-tab `rel`/labelling and smooth-scroll + focus for internal `#` anchors.
 */
export class AnchorComponent extends Component<HTMLElement, IAnchorConfig> {
  constructor(mountTarget: HTMLElement, config: IAnchorConfig, props?: Nutin.ComponentProps) {
    super({
      templateFn,
      mountTarget,
      tagName: 'a11y-anchor',
      config,
      normalizeKeys: ['className', 'textContent'],
      props
    });
  }
}
