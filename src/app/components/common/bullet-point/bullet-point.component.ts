import { CatalogItemConfig, Component } from '../../../../core/index.js';

const templateFn = (_config: CatalogItemConfig<string>) => `__TEMPLATE_PLACEHOLDER__`;

export class BulletPointComponent extends Component {
  constructor(mountTarget: HTMLElement, config: CatalogItemConfig<string>) {
    super({templateFn, mountTarget, config});
  }
}
