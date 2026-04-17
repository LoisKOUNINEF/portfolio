import { Component, ComponentProps } from '../../../../core/index.js';

export interface IBaseCardConfig {
  icon: string;
  labelKey: string;
  subtextKey: string;
  href?: string;
  target?: string;
  download?: string;
  id?: string;
  iconSrc?: string;
}

const templateFn = (_config: IBaseCardConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class BaseCardComponent extends Component<HTMLElement, IBaseCardConfig> {
  constructor(mountTarget: HTMLElement, config: IBaseCardConfig, props?: ComponentProps) {
    const { className, ...restProps } = props ?? {};
    super({
      templateFn,
      mountTarget,
      config,
      tagName: config.href ? 'a' : 'div',
      normalizeKeys: ['href', 'target', 'download', 'id', 'iconSrc'],
      props: restProps,
    });
    const extraClasses = className?.split(' ').filter(Boolean) ?? [];
    this.element.classList.add('base-card', ...extraClasses);
    this.setLinkAttributes();
  }

  private setLinkAttributes(): void {
    if (!this.config.href) return;
    const el = this.element as HTMLAnchorElement;
    el.href = this.config.href;
    if (this.config.target) el.target = this.config.target;
    if (this.config.download) el.download = this.config.download;
    if (this.config.id) el.id = this.config.id;
  }
}
