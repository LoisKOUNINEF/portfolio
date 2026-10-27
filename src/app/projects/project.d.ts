declare interface IProjectBase {
  id: number;
  name: string;
  tags: IProjectTag[];
  tagline: string;
  // Path without extension (.avif/.webp/.jpg variants); optional until a picture exists
  imageSrc?: string;
  presentation: IProjectPresentation;
  technos: ITechBase[];
  links?: IProjectLinks;
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
  // Only read when sectionImageSrc is set; defaults to alternating by section order (right, left, right…)
  imagePosition?: 'left' | 'right';
}

declare interface IProjectLink {
  // Without protocol (https:// is prepended)
  url: string;
  // Overrides the default label (project-links.<key>)
  label?: string;
}

// At most 3 links in total, rendered GitHub → website → other (in array order)
declare interface IProjectLinks {
  github?: IProjectLink;
  website?: IProjectLink;
  // No default label: always say where it leads
  other?: (IProjectLink & { label: string })[];
}

declare interface IProjectTag {
  i18nKey: string;
  color?: string;
  // color: green, blue, teal. purple, orange, red, pink, yellow, cyan, indigo, lime, brown, grey
  // default: grey
}
