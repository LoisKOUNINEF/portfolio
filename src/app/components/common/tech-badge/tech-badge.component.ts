import { AppPipeRegistry, CatalogItemConfig, Component } from '../../../../core/index.js';

interface ITechBadge extends CatalogItemConfig {
  svgKey?: TechSvgKey;
  value?: TechSvgKey;
  label: string;
}

const labels: Record<string, string> = {
  typescript: 'TypeScript',
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  typeorm: 'TypeOrm',
  nodejs: 'NodeJs',
  nestjs: 'NestJs',
  vuejs: 'VueJs',
}

const getLabel = (config: CatalogItemConfig<IProjectTechno | string>): string => {
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

const templateFn = (_config: CatalogItemConfig<ITechBadge>) => `__TEMPLATE_PLACEHOLDER__`;

export class TechBadgeComponent extends Component {
  constructor(mountTarget: HTMLElement, config: CatalogItemConfig<IProjectTechno | string>) {
    const label = getLabel(config);
    super({ templateFn, mountTarget, config: { 
      ...config, label 
    }});
  }
}
