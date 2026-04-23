import { AppPipeRegistry, CatalogItemConfig, Component } from '../../../../core/index.js';

interface ITechBadge extends CatalogItemConfig {
  svgKey?: TechSvgKey;
  value?: TechSvgKey;
  label: string;
}

export interface ITechBadgeConfig extends ITech {
  displayProficiency?: boolean;
}

const labels: Record<string, string> = {
  typescript: 'TypeScript',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  typeorm: 'TypeOrm',
  nodejs: 'NodeJs',
  nestjs: 'NestJs',
  vuejs: 'VueJs',
  sqlite: 'SQLite',
  golang: 'Go',
}

const proficiencies: Record<string, string> = {
  angular: 'primary',
  typescript: 'primary',
  postgresql: 'primary',
  mysql: 'tertiary',
  typeorm: 'secondary',
  nodejs: 'primary',
  nestjs: 'primary',
  vuejs: 'secondary',
  sqlite: 'secondary',
  golang: 'secondary',
  tailwind: 'secondary',
  sass: 'primary',
  rails: 'tertiary',
  docker: 'primary',
  linux: 'primary',
  traefik: 'tertiary',
  bash: 'secondary',
}

const getLabel = (config: CatalogItemConfig<ITechBase | string>): string => {
  let label = '';
  if ('value' in config && typeof config.value === 'string') {
    label = labels[config.value] 
      ?? AppPipeRegistry.apply('capitalize', config.value);
  }
  else if ('svgKey' in config) {
    label = labels[config.svgKey] 
    ?? AppPipeRegistry.apply('capitalize', config.svgKey);
  }
  return label;
}

const getProficiency = (config: CatalogItemConfig<ITechBase | string>): string | undefined => {
  if (!('displayProficiency' in config)) return;
  let proficiency: string | undefined;
  if ('value' in config && typeof config.value === 'string' ) {
    proficiency = proficiencies[config.value]! ;
  }
  else if ('svgKey' in config) {
    proficiency = proficiencies[config.svgKey]!;
  }
  return proficiency;
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
