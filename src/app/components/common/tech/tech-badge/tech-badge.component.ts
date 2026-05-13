import { CatalogItemConfig, Component } from '../../../../../core/index.js';
import { getLabel, getProficiency,  } from '../tech-metadata.helper.js';

interface ITechBadge extends CatalogItemConfig {
  svgKey?: TechSvgKey;
  value?: TechSvgKey;
  label: string;
}

export interface ITechBadgeConfig extends ITech {
  displayProficiency?: boolean;
}

const templateFn = (_config: CatalogItemConfig<ITechBadge>) => `__TEMPLATE_PLACEHOLDER__`;

export class TechBadgeComponent extends Component {
  private _config: CatalogItemConfig<ITech>;
  constructor(mountTarget: HTMLElement, config: CatalogItemConfig<ITechBadgeConfig>) {
    const label = getLabel(config);
    const proficiency = getProficiency(config);
    super({ templateFn, mountTarget, config: { 
      ...config, label, proficiency 
    }});
      this._config = config;
  }
}
