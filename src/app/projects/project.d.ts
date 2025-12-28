declare type ProjectFolderName = 'nutin' | 'paris-2024' | 'pixels-mansion' | 'self-hosting';

declare type TechSvgKey = FrontendSvgKey | BackendSvgKey | DatabaseSvgKey | ToolsSvgKey;

type FrontendSvgKey = 'typescript' | 'angular' | 'vuejs' | 'sass' | 'html';
type BackendSvgKey = 'nestjs' | 'nodejs' | 'express' | 'rails';
type DatabaseSvgKey = 'postgresql' | 'mysql' | 'typeorm';
type ToolsSvgKey = 'git' | 'docker' | 'jest' | 'linux' | 'traefik' | 'bash';

declare type LinkSvgKey = 'github' | 'live' | 'npm' | 'linkedin';

declare interface IProjectBase {
  id: number;
  name: string;
  tagline: string;
  imageSrc: string;
  presentation: IProjectSection;
  technos: IProjectTechno[];
  links: IProjectLink[];
}

declare interface IProject extends IProjectBase {
  popTagline: string;
  overview: IProjectSection;
  purpose: IProjectSection;
  constraints: IProjectSection;
  choices: IProjectSection[];
  challenges: IProjectSection[];
  learned: IProjectSection;
}

declare interface IProjectSection {
  title?: string;
  mainContent?: string;
  keyPointsTitle?: string;
  keyPoints?: string[];
  after?: string;
}

declare interface IProjectTechno {
  svgKey: TechSvgKey;
}

declare interface IProjectLink {
  svgKey: LinkSvgKey;
  url: string;
}
