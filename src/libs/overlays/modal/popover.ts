import { ComponentConfig, CatalogConfig, AppPipeRegistry, Overlays } from '../../../core/index.js';
import { ModalOverlayRuntime, ModalOverlayRuntimeOptions } from '../core/modal-overlay-runtime.js';

export interface PopoverOptions extends ModalOverlayRuntimeOptions {
  template: string;
  components?: ComponentConfig[];
  catalogs?: CatalogConfig[];
  viewName?: string;
  onClose?: () => void;
}

export class PopoverOverlay extends ModalOverlayRuntime {
  private _onCloseCb?: () => void;
  private _components: ComponentConfig[];
  private _catalogs: CatalogConfig[];
  private _prevTitle: string | undefined;

  constructor({
    template,
    onClose,
    viewName,
    components = [],
    catalogs = [],
    focusTrapOptions = {},
    ...rest
  }: PopoverOptions) {
    super({ ...rest, template, focusTrapOptions, dialogLabel: viewName ?? '' });
    this._onCloseCb = onClose;
    this._components = components;
    this._catalogs = catalogs;
    this._setViewName(viewName);
  }

  public override childConfigs(): ComponentConfig[] {
    return [
      ...this._components,
      ...this._catalogs.flatMap(c => this.catalogConfig(c)),
    ];
  }

  public override render(): HTMLElement {
    const overlay = super.render();
    Overlays.popoverOpened();
    Overlays.overlayOpened('popover');
    return overlay;
  }

  protected override createBackdrop(): HTMLElement {
    const el = super.createBackdrop();
    el.className = 'popover-overlay';
    return el;
  }

  protected override createWrapper(): HTMLElement {
    const el = super.createWrapper();
    el.className = 'popover-wrapper';
    return el;
  }

  protected override getContentClass(): string {
    return 'popover-content';
  }

  protected override onAfterRender(): void {
  }

  protected override onBeforeDestroy(): void {
    Overlays.popoverClosed();
    Overlays.overlayClosed('popover');
    if (this._prevTitle !== undefined) document.title = this._prevTitle;
    this._onCloseCb?.();
  }

  private _setViewName(viewName: string | undefined): void {
    if (viewName) {
      this._prevTitle = document.title;
      document.title = AppPipeRegistry.apply('capitalize', viewName);
    }
  }
}

export { PopoverOverlay as PopoverView };
