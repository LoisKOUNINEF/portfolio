import { Component, ComponentProps } from '../../../../core/index.js';

export interface IPictureConfig {
  imageSrc: string;
  imageAlt: string;
  captionI18nKey?: string;
  caption?: string;
}

const templateFn = (_config: IPictureConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class PictureComponent extends Component {
  constructor(mountTarget: HTMLElement, config: IPictureConfig, props?: ComponentProps) {
    super({templateFn, mountTarget, config, props});
  }
}
