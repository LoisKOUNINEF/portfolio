import { AppEventBus, IEventBus } from "./event-bus.js";

class OverlaysFacade {
  constructor(private bus: IEventBus) {}

  popoverOpened() {
    this.bus.emit('popover-opened');
  }

  onPopoverOpened(callback: () => void) {
    this.bus.subscribe('popover-opened', callback);
    return () => this.bus.off('popover-opened', callback);
  }

  popoverClosed() {
    this.bus.emit('popover-closed');
  }

  onPopoverClosed(callback: () => void) {
    this.bus.subscribe('popover-closed', callback);
    return () => this.bus.off('popover-closed', callback);
  }
}

export const Overlays = new OverlaysFacade(AppEventBus);
