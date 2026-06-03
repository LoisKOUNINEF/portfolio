import { OverlayRuntime, OverlayRuntimeOptions } from './overlay-runtime.js';

export abstract class AnchoredOverlayRuntime extends OverlayRuntime {
  protected _anchor: HTMLElement | null = null;

  constructor(options: OverlayRuntimeOptions = {}) {
    super(options);
  }

  protected setAnchor(el: HTMLElement): void {
    this._anchor = el;
  }

  protected updatePosition(): void {
    // TODO: calculate and apply position relative to this._anchor
  }
}
