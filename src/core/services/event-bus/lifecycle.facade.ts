import { AppEventBus, IEventBus } from "./event-bus.js";

class LifecycleFacade {
  constructor(private bus: IEventBus) {}

  beforeRender() {
    this.bus.emit('before-render');
  }

  onBeforeRender(callback: () => void) {
    this.bus.subscribe('before-render', callback);
    return () => this.bus.off('before-render', callback);
  }

  afterRender() {
    this.bus.emit('after-render');
  }

  onAfterRender(callback: () => void) {
    this.bus.subscribe('after-render', callback);
    return () => this.bus.off('after-render', callback);
  }

  beforeDestroy() {
    this.bus.emit('before-destroy');
  }

  onBeforeDestroy(callback: () => void) {
    this.bus.subscribe('before-destroy', callback);
    return () => this.bus.off('before-destroy', callback);
  }

  afterDestroy() {
    this.bus.emit('after-destroy');
  }

  onAfterDestroy(callback: () => void) {
    this.bus.subscribe('after-destroy', callback);
    return () => this.bus.off('after-destroy', callback);
  }

  viewMount(viewName: string) {
    this.bus.emit('view-mount', {viewName});
  }

  onViewMount(callback: (data: { viewName: string }) => void) {
    this.bus.subscribe('view-mount', callback);
    return () => this.bus.off('view-mount', callback);
  }

  viewUnmount(viewName: string) {
    this.bus.emit('view-unmount', { viewName });
  }

  onViewUnmount(callback: (data: { viewName: string }) => void) {
    this.bus.subscribe('view-unmount', callback);
    return () => this.bus.off('view-unmount', callback);
  }
}

export const Lifecycle = new LifecycleFacade(AppEventBus);
