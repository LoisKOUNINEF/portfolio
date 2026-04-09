import { Component } from '../../../../../core/index.js';

const templateFn = (_config: IProjectTag) => `__TEMPLATE_PLACEHOLDER__`;


export class ProjectTagComponent extends Component {
  constructor(mountTarget: HTMLElement, config: IProjectTag) {
    super({templateFn, mountTarget, config});
  }
}
