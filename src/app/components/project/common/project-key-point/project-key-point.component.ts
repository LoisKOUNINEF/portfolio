import { Component, html } from '../../../../../core/index.js';

export interface IProjectKeyPoint {
  label: string;
  text: string;
}

const templateFn = (_config: Nutin.CatalogItemConfig<IProjectKeyPoint>) => html`__TEMPLATE_PLACEHOLDER__`;

export class ProjectKeyPointComponent extends Component {
  constructor(mountTarget: HTMLElement, config: Nutin.CatalogItemConfig<IProjectKeyPoint>) {
    super({templateFn, mountTarget, config});
  }
}
