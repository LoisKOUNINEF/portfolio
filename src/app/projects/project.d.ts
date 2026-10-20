declare interface IProjectBase {
  id: number;
  name: string;
  tags: IProjectTag[];
  tagline: string;
  // Path without extension (.avif/.webp/.jpg variants); optional until a picture exists
  imageSrc?: string;
  presentation: IProjectPresentation;
  technos: ITechBase[];
  links: IProjectLink[];
}

declare interface IProject extends IProjectBase {
  popTagline: string;
  sections: IProjectSection[];
  conclusion?: string;
}

declare interface IProjectPresentation {
  keyPoints?: string[];
}

declare interface IProjectSection {
  sectionName: string;
  sectionHead?: string;
  sectionContent?: string;
  // Each entry renders as "label: text"
  sectionKeyPoints?: Record<string, string>[];
  // Path without extension (.avif/.webp/.jpg variants), like imageSrc
  sectionImageSrc?: string;
  // Only read when sectionImageSrc is set; defaults to 'right'
  imagePosition?: 'left' | 'right';
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
