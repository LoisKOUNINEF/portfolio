import { Component, html } from '../../../../core/index.js';

export interface IAboutSection {
  titleI18nKey: string;
  textI18nKey: string;
}

const templateFn = (config: IAboutSection) => html`__TEMPLATE_PLACEHOLDER__`;

export class AboutSectionComponent extends Component<HTMLElement, IAboutSection> {
  constructor(mountTarget: HTMLElement, config: IAboutSection) {
    super({ templateFn, mountTarget, config });
    this.listenToRenderEvents(['language-changed']);
  }
}
