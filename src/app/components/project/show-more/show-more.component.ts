import { Component, I18nService, html } from '../../../../core/index.js';
import { ButtonComponent } from '../../common/button/button.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

interface ShowMoreTranslations {
  more: string;
  less: string;
}

export class ShowMoreComponent extends Component {
  private readonly _count: number;
  private _isOpen = false;

  constructor(mountTarget: HTMLElement, count: number) {
    super({ templateFn, mountTarget });
    this._count = count;
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [this.getBtnConfig()];
  }

  private getBtnConfig(): Nutin.ComponentConfig {
    return {
      selector: 'show-more-inner-btn',
      factory: (el) => new ButtonComponent(el, {
        textContent: this.getButtonText(),
        className: 'show-more__btn',
        callback: () => this.onToggle()
      })
    };
  }

  private getButtonText(): string {
    const t = I18nService.getTranslationObject<ShowMoreTranslations>('show-more');
    return this._isOpen
      ? (t?.less ?? 'Show Less')
      : `+ ${this._count} ${t?.more ?? 'More...'}`;
  }

  private onToggle(): void {
    this._isOpen = !this._isOpen;
    document.getElementById('additional-projects')?.classList.toggle('open');
    const btn = this.element.querySelector('button');
    if (btn) btn.textContent = this.getButtonText();
  }
}
