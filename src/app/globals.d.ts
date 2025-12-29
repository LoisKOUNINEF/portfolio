declare type CoreEventMap = {
  'navigate': string;
  'reload': string;
  'language-changed': string;
  'view-mount': string;
  'view-render': string;
  'view-unmount': string;
  'track-pageview': { page: string };
  'popover-opened': string;
  'popover-close': string;
  // Add other events and their payload types here
};

declare type StoreEventMap = {[ K in `store:${string}` ]: any; };

// Merged event map
declare type EventMap = CoreEventMap & StoreEventMap;
declare type EventKey = keyof EventMap;
