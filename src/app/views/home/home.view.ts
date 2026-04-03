import { ComponentConfig, View } from '../../../core/index.js';
import {
  AboutMeComponent,
  ContactComponent,
  HeroComponent,
  ProjectCardComponent,
  ShowMoreComponent,
  TechStackComponent
} from '../../components/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
  private readonly _allProjects: ProjectFolderName[] = ['nutin', 'paris-2024', 'pixels-mansion',  'run-for-the-bun'];
  private readonly _mediaQuery = window.matchMedia('(max-width: 1500px)');
  private _selfHostingProjectFolder: ProjectFolderName = 'self-hosting';

  constructor() {
    super({template, tagName: 'div'});
    this._mediaQuery.addEventListener('change', () => this.forceRender());
  }

  private get _columnsCount(): number {
    return this._mediaQuery.matches ? 2 : 3;
  }

  public childConfigs(): ComponentConfig[] {
    return this.getChildConfigs();
  }

  private getChildConfigs(): ComponentConfig[] {
    const showMoreConfig = this.getShowMoreBtnConfig();
    return [
      this.getHeroConfig(),
      this.getAboutMeConfig(),
      ...this.getMainProjectsCatalog(),
      ...(showMoreConfig ? [showMoreConfig] : []),
      ...this.getAdditionalProjectsCatalog(),
      this.getStackConfig(),
      this.getSelfHostingProjectConfig(),
      this.getContactConfig(),
    ];
  }

  private getHeroConfig(): ComponentConfig {
    return {
      selector: 'hero',
      factory: (el) => new HeroComponent(el)
    }
  }

  private getAboutMeConfig(): ComponentConfig {
    return {
      selector: 'about',
      factory: (el) => new AboutMeComponent(el)
    }
  }

  private getMainProjectsCatalog(): ComponentConfig[] {
    return this.catalogConfig({
      array: this._allProjects.slice(0, this._columnsCount),
      selector: 'main-projects-catalog',
      elementName: 'main-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getShowMoreBtnConfig(): ComponentConfig | null {
    const additional = this._allProjects.slice(this._columnsCount);
    if (!additional.length) return null;
    return {
      selector: 'show-more-btn',
      factory: (el) => new ShowMoreComponent(el, additional.length)
    };
  }

  private getAdditionalProjectsCatalog(): ComponentConfig[] {
    const additional = this._allProjects.slice(this._columnsCount);
    if (!additional.length) return [];
    return this.catalogConfig({
      array: additional,
      selector: 'additional-projects-catalog',
      elementName: 'additional-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getStackConfig(): ComponentConfig {
    return {
      selector: 'tech-stack',
      factory: (el) => new TechStackComponent(el)
    }
  }

  private getSelfHostingProjectConfig(): ComponentConfig {
    return {
      selector: 'infrastructure',
      factory: (el) => new ProjectCardComponent(el, 
        this._selfHostingProjectFolder
      )
    }
  }

  private getContactConfig(): ComponentConfig {
    return {
      selector: 'contact',
      factory: (el) => new ContactComponent(el)
    }
  }
}
