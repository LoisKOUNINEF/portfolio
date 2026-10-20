import { Component, html } from '../../../core/index.js';
import { ITab, TabsComponent } from '../common/tabs/tabs.component.js';
import { AboutSectionComponent } from './about-section/about-section.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// Tab name → its section's title and text keys (about.<title>, about.<text>)
const ABOUT_SECTIONS: { name: string; title: string; text: string }[] = [
  { name: 'architecture', title: 'architecture-title', text: 'architecture' },
  { name: 'operations', title: 'systems-title', text: 'systems' },
  { name: 'approach', title: 'pitch-headline', text: 'pitch-subtext' },
  { name: 'background', title: 'background-title', text: 'background' },
];

export class AboutMeComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget, tagName: 'article'});
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [{
      selector: 'about-tabs',
      factory: (el) => new TabsComponent(el, {
        labelI18nKey: 'about.tabs-label',
        tabs: this.getTabs(),
      }),
      keep: 'about-tabs',
    }];
  }

  private getTabs(): ITab[] {
    return ABOUT_SECTIONS.map(({ name, title, text }) => ({
      name,
      i18nKey: `about.${name}-tab`,
      factory: (el) => new AboutSectionComponent(el, {
        titleI18nKey: `about.${title}`,
        textI18nKey: `about.${text}`,
      }),
    }));
  }
}
