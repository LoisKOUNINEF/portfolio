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
  constructor(mountTarget: HTMLElement, config: CatalogItemConfig<ITechBadgeConfig>) {
    super({ templateFn, mountTarget });
    this.config = config;
  }

  override onBeforeRender() {
    const label = getLabel(this.config);
    const proficiency = getProficiency(this.config);
    this.config = { 
      ...this.config, label, proficiency 
    };
  }
}
