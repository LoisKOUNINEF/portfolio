declare namespace Nutin {
  interface AppEventMap {
    // Expands the project grid holding this project's card, if it's hidden
    'project-reveal': ProjectFolderName;
  }
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

declare interface ITech {
  svgKey: TechSvgKey;
}
