import { Component, html, raw } from '../../../../core/index.js';

export interface IAboutSection {
  titleI18nKey: string;
  textI18nKey: string;
  // Inner markup of a 24×24 line icon (constant, from about.component.ts)
  icon: string;
}

const templateFn = (config: IAboutSection) => html`__TEMPLATE_PLACEHOLDER__`;

export class AboutSectionComponent extends Component<HTMLElement, IAboutSection> {
  constructor(mountTarget: HTMLElement, config: IAboutSection) {
    super({ templateFn, mountTarget, config });
  }
}
