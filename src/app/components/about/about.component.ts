import { Component, html } from '../../../core/index.js';
import { AboutSectionComponent, IAboutSection } from './about-section/about-section.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// Each card's title and text keys (about.<title>, about.<text>) and its icon
// (inner markup of a 24×24 line icon, stroked like the project icons)
const ABOUT_SECTIONS: { title: string; text: string; icon: string }[] = [
  {
    title: 'architecture-title', text: 'architecture',
    // stacked layers
    icon: '<path d="M12 4l8 4-8 4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M4 16l8 4 8-4"/>',
  },
  {
    title: 'systems-title', text: 'systems',
    // gear
    icon: '<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  },
  {
    title: 'background-title', text: 'background',
    // briefcase
    icon: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/>',
  },
];

export class AboutMeComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'article'});
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      selector: 'about-sections',
      items: this.getSections(),
      component: AboutSectionComponent,
      elementName: 'about-section',
    });
  }

  private getSections(): IAboutSection[] {
    return ABOUT_SECTIONS.map(({ title, text, icon }) => ({
      titleI18nKey: `about.${title}`,
      textI18nKey: `about.${text}`,
      icon,
    }));
  }
}
