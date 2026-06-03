import { Component, ComponentProps } from '../../../../core/index.js';
import { FocusableHelper, IFocusableConfig } from '../../../../libs/index.js';

export interface IFocusableElementConfig extends IFocusableConfig {
  iconSrc: string;
  labelKey: string;
  subtextKey: string;
}

const templateFn = (_config: IFocusableElementConfig) => `__TEMPLATE_PLACEHOLDER__`;
export class InfoCardComponent extends Component<HTMLElement, IFocusableElementConfig> {
  constructor(mountTarget: HTMLElement, config: IFocusableElementConfig, props?: ComponentProps) {
    const { className, ...restProps } = props ?? {};
    super({
      templateFn,
      mountTarget,
      config,
      tagName: config.href ? 'a' : 'div',
      normalizeKeys: ['href', 'target', 'download', 'iconSrc'],
      props: restProps,
    });
    this.element.classList.add('focusable-element');
    if (className) {
      className.split(' ').filter(Boolean).forEach(className => this.element.classList.add(className));
    }
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    FocusableHelper.applySemantics(this.element, this.config);
  }

  protected override onAfterRender(): void {
    FocusableHelper.applyEventListeners(this.element, this.config, this.eventListeners);
  }
}
