import { Component, html, raw } from '../../../core/index.js';
import { TechBadgeComponent } from '../common/tech/tech-badge/tech-badge.component.js';

interface ITechGroup {
  name: string;
  // Inner markup of a 24×24 line icon
  icon: string;
  keys: TechSvgKey[];
}

const templateFn = (_groups: { groups: ITechGroup[] }) => html`__TEMPLATE_PLACEHOLDER__`;

const TECH_GROUPS: ITechGroup[] = [
  {
    name: 'frontend',
    // browser window
    icon: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M6.5 6.5h.01M9 6.5h.01"/>',
    keys: ['angular', 'typescript', 'sass', 'tailwind'],
  },
  {
    name: 'backend',
    // code brackets
    icon: '<path d="M7 8l-4 4 4 4"/><path d="M17 8l4 4-4 4"/><path d="M14 4l-4 16"/>',
    keys: ['nestjs', 'golang'],
  },
  {
    name: 'database',
    // database cylinder
    icon: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"/><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"/>',
    keys: ['postgresql', 'sqlite'],
  },
  {
    name: 'tools',
    // container box
    icon: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M12 12l8-4.5M12 12v9M12 12L4 7.5"/>',
    keys: ['docker', 'linux', 'traefik', 'bash'],
  },
];

export class TechStackComponent extends Component<HTMLElement, { groups: ITechGroup[] }> {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'section', config: { groups: TECH_GROUPS }});
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return this.config.groups.flatMap(({ name, keys }) => this.createCatalogComponents({
      selector: `${name}-badges`,
      items: keys.map((svgKey) => ({ svgKey, displayProficiency: true })),
      component: TechBadgeComponent,
      elementName: `${name}-badge`,
    }));
  }
}
