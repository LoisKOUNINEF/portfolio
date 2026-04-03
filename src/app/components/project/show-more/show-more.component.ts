import { AppEventBus, Component, ComponentConfig, I18nService } from '../../../../core/index.js';
import { ButtonComponent } from '../../index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

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
    AppEventBus.subscribe('language-changed', () => this.forceRender());
  }

  public childConfigs(): ComponentConfig[] {
    return [this.getBtnConfig()];
  }

  private getBtnConfig(): ComponentConfig {
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
      ? (t?.less ?? 'show less')
      : `+ ${this._count} ${t?.more ?? 'more...'}`;
  }

  private onToggle(): void {
    this._isOpen = !this._isOpen;
    document.getElementById('additional-projects')?.classList.toggle('open');
    const btn = this.element.querySelector('button');
    if (btn) btn.textContent = this.getButtonText();
  }
}
