import { Component } from '../../../../core/index.js';

const templateFn = (_config: IProjectLink) => `__TEMPLATE_PLACEHOLDER__`;

export class ExternalLinkComponent extends Component {
  constructor(mountTarget: HTMLElement, config: IProjectLink) {
    super({templateFn, mountTarget, config});
  }
}
