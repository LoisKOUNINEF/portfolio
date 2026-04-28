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
    this.setStyles(className);
    this.setLinkAttributes();
    this.setCallback();
    this.setTabNav();
  }

  private setStyles(className: string | undefined): void {
    const extraClasses = className?.split(' ').filter(Boolean) ?? [];
    this.element.classList.add('info-card', ...extraClasses);
  }

  private setLinkAttributes(): void {
    if (!this.config.href) return;
    const el = this.element as HTMLAnchorElement;
    el.href = this.config.href;
    if (this.config.target) el.target = this.config.target;
    if (this.config.download) el.download = this.config.download;
    if (this.config.id) el.id = this.config.id;
  }

  private setCallback() {
    if (this.config.callback) {
      this.element.addEventListener('click', this.config.callback);
    }
  }

  private setTabNav() {
    if (!this.config.href && this.config.callback) {
      this.element.setAttribute('role', 'button');
      this.element.setAttribute('tabindex', '0');
      this.element.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.config.callback!();
        }
      });
    }
  }
}

