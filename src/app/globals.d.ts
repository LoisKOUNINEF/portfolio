declare interface AppEvent {}

declare type ProjectFolderName = 'nutin' | 'paris-2024' | 'pixels-mansion' | 'self-hosting' | 'run-for-the-bun';

declare type TechSvgKey = FrontendSvgKey | BackendSvgKey | DatabaseSvgKey | ToolsSvgKey;

type FrontendSvgKey = 'typescript' | 'angular' | 'vuejs' | 'sass' | 'html' | 'tailwind';
type BackendSvgKey = 'nestjs' | 'nodejs' | 'express' | 'rails' | 'golang' | 'java';
type DatabaseSvgKey = 'postgresql' | 'mysql' | 'typeorm' | 'sqlite';
type ToolsSvgKey = 'git' | 'docker' | 'jest' | 'linux' | 'traefik' | 'bash';

declare type LinkSvgKey = 'github' | 'live' | 'npm' | 'linkedin';

declare interface ITech {
  svgKey: TechSvgKey;
}
