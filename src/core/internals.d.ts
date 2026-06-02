declare interface NavigationEventMap {
  'navigate': { path: string };
  'reload': {};
}

declare interface LifecycleEventMap {
  'before-render': {};
  'after-render': {};
  'before-destroy': {};
  'after-destroy': {};
  'view-mount': { viewName: string };
  'view-unmount': { viewName: string };
}

declare interface OverlaysEventMap {
  'popover-opened': {};
  'popover-closed': {};
}

declare interface I18nEventMap {
  'language-changed': {
    lang: string;
  };
}

declare interface FrameworkEventMap extends NavigationEventMap, LifecycleEventMap, OverlaysEventMap, I18nEventMap {}

declare interface EventMap extends FrameworkEventMap, AppEventMap {}

declare type EventKey = keyof EventMap;