import { Component, html } from '../../../../core/index.js';

const templateFn = (_config: Nutin.CatalogItemConfig<string>) => html`__TEMPLATE_PLACEHOLDER__`;

export class BulletPointComponent extends Component {
  constructor(mountTarget: HTMLElement, config: Nutin.CatalogItemConfig<string>) {
    super({templateFn, mountTarget, config});
  }
}
