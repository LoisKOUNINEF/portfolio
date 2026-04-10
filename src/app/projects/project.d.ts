declare interface IProjectBase {
  id: number;
  name: string;
  tags: IProjectTag[];
  tagline: string;
  imageSrc: string;
  presentation: IProjectSection;
  technos: ITechBase[];
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

declare interface IProjectLink {
  svgKey: LinkSvgKey;
  url: string;
}

declare interface IProjectTag {
  i18nKey: string;
  color?: string;
  // color: green, blue, teal. purple, orange, red, pink, yellow, cyan, indigo, lime, brown, grey
  // default: grey
}
