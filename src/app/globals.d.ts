declare namespace Nutin {
  interface AppEventMap {}
}

declare type ProjectFolderName =
  | 'nutin' | 'a11y-elements'
  | 'paris-2024' | 'retro-cabinet' | 'notelet' | 'narrative-palettes'
  | 'self-hosting' | 'ci-cd' | 'mailer';

declare type TechSvgKey = FrontendSvgKey | BackendSvgKey | DatabaseSvgKey | ToolsSvgKey;

type FrontendSvgKey = 'typescript' | 'angular' | 'vuejs' | 'sass' | 'html' | 'tailwind';
type BackendSvgKey = 'nestjs' | 'nodejs' | 'express' | 'rails' | 'golang' | 'java';
type DatabaseSvgKey = 'postgresql' | 'mysql' | 'typeorm' | 'sqlite';
type ToolsSvgKey = 'git' | 'docker' | 'jest' | 'linux' | 'traefik' | 'bash';

declare type LinkSvgKey = 'github' | 'live' | 'npm' | 'linkedin';

declare interface ITech {
  svgKey: TechSvgKey;
}
