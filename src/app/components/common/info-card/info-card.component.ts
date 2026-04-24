import { Component, ComponentProps } from '../../../../core/index.js';

export interface IInfoCardConfig {
  icon: string;
  labelKey: string;
  subtextKey: string;
  href?: string;
  target?: string;
  download?: string;
  id?: string;
  iconSrc?: string;
  callback?: () => void;
}

const templateFn = (_config: IInfoCardConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class InfoCardComponent extends Component<HTMLElement, IInfoCardConfig> {
  constructor(mountTarget: HTMLElement, config: IInfoCardConfig, props?: ComponentProps) {
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
    this.element.classList.add('info-card', ...extraClasses);
    this.setLinkAttributes();
    if (!this.config.href && this.config.callback) {
      this.element.addEventListener('click', this.config.callback);
    }
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
