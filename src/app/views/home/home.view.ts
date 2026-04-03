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
  private _visibleProjectsFolders: ProjectFolderName[] = ['nutin', 'paris-2024', 'pixels-mansion'];
  private _additionalProjectsFolders: ProjectFolderName[] = ['nutin', 'paris-2024', 'pixels-mansion'];
  private _selfHostingProjectFolder: ProjectFolderName = 'self-hosting';

  constructor() {
    super({template, tagName: 'div'});
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
      array: this._visibleProjectsFolders,
      selector: 'main-projects-catalog',
      elementName: 'main-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getShowMoreBtnConfig(): ComponentConfig | null {
    if (!this._additionalProjectsFolders.length) return null;
    return {
      selector: 'show-more-btn',
      factory: (el) => new ShowMoreComponent(el, this._additionalProjectsFolders.length)
    };
  }

  private getAdditionalProjectsCatalog(): ComponentConfig[] {
    if (!this._additionalProjectsFolders.length) return [];
    return this.catalogConfig({
      array: this._additionalProjectsFolders,
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
