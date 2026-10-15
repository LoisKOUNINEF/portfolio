import 'a11y-elements/accessibility-components/anchor';
import 'a11y-elements/accessibility-components/focusable';
import { Component, ComponentProps } from '../../../../core/index.js';

export interface IFocusableConfig {
  href?: string;
  target?: string;
  download?: string;
  callback?: () => void;
  ariaLabel?: string;
}

export interface IFocusableElementConfig extends IFocusableConfig {
  iconSrc: string;
  labelKey: string;
  subtextKey: string;
}

const templateFn = (_config: IFocusableElementConfig) => `__TEMPLATE_PLACEHOLDER__`;

/**
 * Link mode (`href`): a real `<a>` wrapped in `<a11y-anchor>` (new-tab rel/label, internal anchor focus).
 * Action mode (`callback` only): `<a11y-focusable>` (role="button", Enter/Space → click).
 * Neither: a plain, non-interactive `<div>`.
 */
export class InfoCardComponent extends Component<HTMLElement, IFocusableElementConfig> {
  private readonly _classNames: string[];

  constructor(mountTarget: HTMLElement, config: IFocusableElementConfig, props?: ComponentProps) {
    const { className, ...restProps } = props ?? {};
    super({
      templateFn,
      mountTarget,
      config,
      tagName: InfoCardComponent.tagFor(config),
      normalizeKeys: ['href', 'target', 'download', 'iconSrc'],
      props: restProps,
    });
    this._classNames = ['focusable-element', ...(className?.split(' ').filter(Boolean) ?? [])];
    if (!config.href) this.applyCardAttributes(this.element);
  }

  private static tagFor(config: IFocusableConfig): 'a11y-anchor' | 'a11y-focusable' | 'div' {
    if (config.href) return 'a11y-anchor';
    return config.callback ? 'a11y-focusable' : 'div';
  }

  protected override onAfterRender(): void {
    const target = this.config.href ? this.wrapInAnchor() : this.element;
    if (this.config.callback) {
      const click: EventListener = () => this.config.callback!();
      target.addEventListener('click', click);
      this.eventListeners.push([target, 'click', click]);
    }
  }

  private wrapInAnchor(): HTMLAnchorElement {
    const anchor = document.createElement('a');
    anchor.href = this.config.href!;
    if (this.config.target) anchor.target = this.config.target;
    if (this.config.download) anchor.download = this.config.download;
    this.applyCardAttributes(anchor);
    anchor.append(...Array.from(this.element.childNodes));
    this.element.replaceChildren(anchor);
    return anchor;
  }

  private applyCardAttributes(el: HTMLElement): void {
    el.classList.add(...this._classNames);
    if (this.config.ariaLabel) el.setAttribute('aria-label', this.config.ariaLabel);
  }
}
