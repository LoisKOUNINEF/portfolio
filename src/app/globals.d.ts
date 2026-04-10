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

declare type ProjectFolderName = 'nutin' | 'paris-2024' | 'pixels-mansion' | 'self-hosting' | 'run-for-the-bun';

declare type TechSvgKey = FrontendSvgKey | BackendSvgKey | DatabaseSvgKey | ToolsSvgKey;

type FrontendSvgKey = 'typescript' | 'angular' | 'vuejs' | 'sass' | 'html' | 'tailwind';
type BackendSvgKey = 'nestjs' | 'nodejs' | 'express' | 'rails' | 'golang';
type DatabaseSvgKey = 'postgresql' | 'mysql' | 'typeorm' | 'sqlite';
type ToolsSvgKey = 'git' | 'docker' | 'jest' | 'linux' | 'traefik' | 'bash';

declare type LinkSvgKey = 'github' | 'live' | 'npm' | 'linkedin';

declare interface ITechBase {
  svgKey: TechSvgKey;
}

declare interface ITech extends ITechBase{
  details?: ITechDetails;
}

declare interface ITechDetails {
  rating: number;
  tagline: string;
  keyPoints: string[];
}
