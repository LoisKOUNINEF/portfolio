import { Component, html } from '../../../../../core/index.js';
import { AnchorComponent, IAnchorConfig } from '../../../common/anchor/anchor.component.js';
import { ctaExternalClass, ctaOutlineClass } from '../../../common/anchor/cta-classes.js';

interface IProjectLinksConfig {
  name: string;
  links: IProjectLinks;
}

const MAX_LINKS = 3;

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// A custom label wins over the default one (project-links.<key>)
const toAnchorConfig = (link: IProjectLink, defaultKey?: string): IAnchorConfig => ({
  href: `https://${link.url}`,
  target: '_blank',
  className: `${ctaOutlineClass} ${ctaExternalClass}`,
  ...(link.label ? { textContent: link.label } : { i18nKey: `project-links.${defaultKey}` }),
});

export class ProjectLinksComponent extends Component {
  private _linksConfig: IProjectLinksConfig;

  constructor(mountTarget: HTMLElement, config: IProjectLinksConfig) {
    super({templateFn, mountTarget, config});
    this._linksConfig = config;
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: `project-links`,
      items: this.getOrderedLinks(),
      component: AnchorComponent,
      elementName: `project-link`
    })
  }

  // Always GitHub → website → other, whatever the JSON order
  private getOrderedLinks(): IAnchorConfig[] {
    const { github, website, other = [] } = this._linksConfig.links;
    const anchors = [
      ...(github ? [toAnchorConfig(github, 'github')] : []),
      ...(website ? [toAnchorConfig(website, 'website')] : []),
      ...other.map((link) => toAnchorConfig(link)),
    ];
    if (anchors.length > MAX_LINKS) {
      console.warn(`${this._linksConfig.name}: ${anchors.length} links given, only the first ${MAX_LINKS} are shown`);
    }
    return anchors.slice(0, MAX_LINKS);
  }
}
