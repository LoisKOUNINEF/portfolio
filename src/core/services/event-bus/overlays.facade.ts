import { AppEventBus, IEventBus } from "./event-bus.js";

class OverlaysFacade {
  constructor(private bus: IEventBus) {}

  popoverOpened(): void {
    this.bus.emit('popover-opened');
  }

  onPopoverOpened(callback: () => void): () => void {
    this.bus.subscribe('popover-opened', callback);
    return () => this.bus.off('popover-opened', callback);
  }

  popoverClosed(): void {
    this.bus.emit('popover-closed');
  }

  onPopoverClosed(callback: () => void): () => void {
    this.bus.subscribe('popover-closed', callback);
    return () => this.bus.off('popover-closed', callback);
  }

  overlayOpened(type: string): void {
    this.bus.emit('overlay-opened', { type });
  }

  onOverlayOpened(callback: (data: { type: string }) => void): () => void {
    this.bus.subscribe('overlay-opened', callback);
    return () => this.bus.off('overlay-opened', callback);
  }

  overlayClosed(type: string): void {
    this.bus.emit('overlay-closed', { type });
  }

  onOverlayClosed(callback: (data: { type: string }) => void): () => void {
    this.bus.subscribe('overlay-closed', callback);
    return () => this.bus.off('overlay-closed', callback);
  }
}

export const Overlays = new OverlaysFacade(AppEventBus);
