import { ComponentConfig, View } from '../../../core/index.js';
import {  
  AboutMeComponent,
  ContactComponent,
  HeroComponent,
  ProjectCardComponent,
  TechStackComponent
} from '../../components/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
  private _mainProjectsFolders: ProjectFolderName[] = [ 'nutin', 'paris-2024', 'pixels-mansion' ];
  private _selfHostingProjectFolder: ProjectFolderName = 'self-hosting';

  constructor() {
    super({template, tagName: 'div'});
  }

  public childConfigs(): ComponentConfig[] {
    return this.getChildConfigs();
  }

  private getChildConfigs(): ComponentConfig[] {
    return [
      this.getHeroConfig(),
      this.getAboutMeConfig(),
      ...this.getMainProjectsCatalog(),
      this.getStackConfig(),
      this.getSelfHostingProjectConfig(),
      this.getContactConfig(),
    ]
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
      array: this._mainProjectsFolders,
      selector: 'main-projects-catalog',
      elementName: 'main-project',
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
