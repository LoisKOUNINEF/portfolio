import { Component, html } from '../../../../../core/index.js';
import { getLabel, getProficiency,  } from '../tech-metadata.helper.js';

interface ITechBadge extends Nutin.CatalogItemConfig {
  svgKey?: TechSvgKey;
  value?: TechSvgKey;
  label: string;
}

export interface ITechBadgeConfig extends ITech {
  displayProficiency?: boolean;
}

const templateFn = (_config: Nutin.CatalogItemConfig<ITechBadge>) => html`__TEMPLATE_PLACEHOLDER__`;

export class TechBadgeComponent extends Component {
  constructor(mountTarget: HTMLElement, config: Nutin.CatalogItemConfig<ITechBadgeConfig>) {
    super({ templateFn, mountTarget });
    this.config = config;
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();
    const label = getLabel(this.config);
    const proficiency = getProficiency(this.config);
    this.config = { 
      ...this.config, label, proficiency 
    };
  }
}
