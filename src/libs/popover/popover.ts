import { View, ButtonManager, BaseButton, ComponentConfig, AppPipeRegistry, CatalogConfig, AppEventBus } from '../../core/index.js';
import { FocusTrapHelper, IFocusTrapOptions } from './helpers/focus-trap.helper.js';
import { IPopoverDomElements, PopoverDomHelper } from './helpers/popover-dom.helper.js';

export interface PopoverButton extends BaseButton {
  // if needed for Popover-specific properties
}

export interface PopoverOptions {
  template: string;
  children?: ComponentConfig[];
  catalogs?: CatalogConfig[];
  viewName?: string;
  onClose?: () => void;
  buttons?: PopoverButton[];
  focusTrapOptions?: IFocusTrapOptions;
}

export class PopoverView extends View {
  private _onClose?: () => void;
  private _overlay: HTMLElement | null = null;
  private _buttonManager: ButtonManager;
  private _prevTitle: string | undefined;
  private children: ComponentConfig[];
  private _catalogs: CatalogConfig[];
  private _focusTrap: FocusTrapHelper | null = null;
  private _focusTrapOptions: IFocusTrapOptions;

  constructor({
    template,
    buttons = [],
    onClose,
    viewName,
    children = [],
    catalogs = [],
    focusTrapOptions = {}
  }: PopoverOptions) {
    super({ template, tagName: 'div', mountTarget: 'body' });
    this._onClose = onClose;
    this.children = children;
    this._catalogs = catalogs;
    this._buttonManager = this.createButtonManager(buttons);
    this.setOptionalViewName(viewName);
    this._focusTrapOptions = focusTrapOptions;
    AppEventBus.subscribe('popover-close', () => this.destroy());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      ...this.children,
      ...this.catalogConfigs()
    ];
  }

  public catalogConfigs(): ComponentConfig[] {
    const configs: ComponentConfig[] = []
    this._catalogs.map((catalog) => {
      configs.push(...this.catalogConfig(catalog));
    })
    return configs;
  }

  public override shouldUpdateMetaContent(): boolean {
    return false;
  }

  public override render(): HTMLElement {
    document.body.classList.add('no-scroll');
    const { wrapper, overlay } = this.createDomElements();
    this._overlay = overlay;

    this._focusTrap = new FocusTrapHelper({
      container: wrapper,
      overlay: this._overlay,
      options: this._focusTrapOptions});
    this._focusTrap.activate();

    AppEventBus.emit('popover-opened');
    return this._overlay;
  }

  public override destroy(): void {
    if (this._overlay) {
      const wrapper = this._overlay.querySelector('.popover-wrapper');
      this._overlay.classList.remove('show');
      wrapper?.classList.remove('show');

      setTimeout(() => {
        wrapper?.remove()
        this._overlay?.remove();
        this._overlay = null;
      }, 250); // match transition duration
      this._focusTrap?.deactivate();
    }

    document.body.classList.remove('no-scroll');

    if (this._prevTitle) document.title = this._prevTitle;

    super.destroy();

    if (typeof this._onClose === 'function') {
      this._onClose();
    }
  }

  private setOptionalViewName(viewName: string | undefined): void {
    if (viewName) {
      this._prevTitle = document.title;
      document.title = AppPipeRegistry.apply('capitalize', viewName);
    }
  }

  private createButtonManager(buttons: PopoverButton[]): ButtonManager {
    return new ButtonManager(
      this, 
      buttons, 
      { containerClassName: 'popover-buttons' }
    );
  }

  private createDomElements(): IPopoverDomElements {
    const content = super.render();
    const { overlay, wrapper } = PopoverDomHelper.createDomElements(content, this._buttonManager);

    this.autoBindEvents();
    this.parseDataAttributes();
    this.animateIn(wrapper);

    return { overlay, wrapper };
  }

  // Handles the close button (via data-event bound in appendCloseButton)
  private onCloseClick(): void {
    this.destroy();
  }

  private animateIn(wrapper: HTMLElement): void {
    requestAnimationFrame(() => {
      this._overlay?.classList.add('show');
      wrapper.classList.add('show');
    });
  }
}