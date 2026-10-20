import type { ModalElement } from 'a11y-elements/overlays/modal/element';
import { BaseComponent, AppPipeRegistry } from '../../../../core/index.js';

export interface ModalOptions {
  template: Nutin.Template;
  components?: Nutin.ComponentConfig[];
  catalogs?: Nutin.CatalogConfig[];
  viewName?: string;
  fullscreen?: boolean;
  onClose?: () => void;
}

/**
 * Bridges Nutin's component tree to `<a11y-modal>` (a11y-elements, defined in main.ts).
 * Nutin renders the template + children into the element; the custom element
 * owns the dialog behavior (portal, backdrop, focus trap, Escape, close button).
 */
export class ModalHost extends BaseComponent<ModalElement> {
  private _template: Nutin.Template;
  private _components: Nutin.ComponentConfig[];
  private _catalogs: Nutin.CatalogConfig[];
  private _viewName: string | undefined;
  private _fullscreen: boolean;
  private _onCloseCb?: () => void;
  private _prevTitle: string | undefined;

  constructor({ template, components = [], catalogs = [], viewName, fullscreen = false, onClose }: ModalOptions) {
    super({ mountTarget: 'body', tagName: 'a11y-modal' });
    this._template = template;
    this._components = components;
    this._catalogs = catalogs;
    this._viewName = viewName;
    this._fullscreen = fullscreen;
    this._onCloseCb = onClose;
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return [
      ...this._components,
      ...this._catalogs.flatMap(c => this.createCatalogComponents(c)),
    ];
  }

  public override render(): HTMLElement {
    super.render();
    const modal = this.element;
    if (this._viewName) modal.setAttribute('dialog-label', this._viewName);
    modal.toggleAttribute('fullscreen', this._fullscreen);
    modal.onClose = () => this.destroy();

    this._setViewName();
    modal.setAttribute('open', '');
    return modal;
  }

  public open(): HTMLElement {
    return this.render();
  }

  public close(): void {
    this.element.close();
  }

  protected override generateTemplate(): Nutin.Template {
    return this._template;
  }

  protected override onBeforeDestroy(): void {
    if (this._prevTitle !== undefined) document.title = this._prevTitle;
    this._onCloseCb?.();
  }

  private _setViewName(): void {
    if (!this._viewName) return;
    this._prevTitle = document.title;
    document.title = AppPipeRegistry.apply('capitalize', this._viewName);
  }
}
