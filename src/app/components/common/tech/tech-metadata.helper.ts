import { AppPipeRegistry, CatalogItemConfig } from "../../../../core/index.js";

export const labels: Record<string, string> = {
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

export const proficiencies: Record<string, string> = {
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

export const getLabel = (config: CatalogItemConfig<ITech | string> | ITech[] | ITech): string => {
  let label = '';
  if ('value' in config && typeof config.value === 'string') {
    label = labels[config.value] 
      ?? AppPipeRegistry.apply('capitalize', config.value);
  }
  else if ('svgKey' in config) {
    label = labels[config.svgKey] 
    ?? AppPipeRegistry.apply('capitalize', config.svgKey);
  }
  else if (Array.isArray(config)) {
    label = config.map((conf: ITech) => getLabel(conf as ITech)).join(' - ');
  }
  return label;
}

export const getProficiency = (config: CatalogItemConfig<ITech | string>): string | undefined => {
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
