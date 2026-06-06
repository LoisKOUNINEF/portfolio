import { ComponentConfig, View } from '../../../core/index.js';
import { EmptyComponent } from '../../../libs/index.js';
import {
  AboutMeComponent,
  ContactComponent,
  HeroComponent, InfosComponent,
  OtherThingsComponent,
  ProjectCardComponent,
  ShowMoreComponent,
  TechStackComponent
} from '../../components/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
  private readonly _allProjects: ProjectFolderName[] = ['nutin', 'paris-2024', 'pixels-mansion', /*'run-for-the-bun'*/];
  private readonly _mainProjectsCount = 2;
  private _selfHostingProjectFolder: ProjectFolderName = 'self-hosting';

  constructor() {
    super({template, tagName: 'div', viewName: 'home'});
  }

  public childConfigs(): ComponentConfig[] {
    return this.getChildConfigs();
  }

  private getChildConfigs(): ComponentConfig[] {
    return [
      this.getHeroConfig(),
      this.getAboutMeConfig(),
      ...this.getMainProjectsCatalog(),
      this.getShowMoreBtnConfig(),
      ...this.getAdditionalProjectsCatalog(),
      this.getStackConfig(),
      this.getSelfHostingProjectConfig(),
      this.getContactConfig(),
      this.getInfosConfig(),
      this.getOtherThingsConfig()
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
      array: this._allProjects.slice(0, this._mainProjectsCount),
      selector: 'main-projects-catalog',
      elementName: 'main-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getShowMoreBtnConfig(): ComponentConfig {
    const selector = 'show-more-btn';
    const additional = this._allProjects.slice(this._mainProjectsCount);
    if (!additional.length) {
      return {
        selector: selector,
        factory: (el) => new EmptyComponent(el)
      }
    }
    return {
      selector: selector,
      factory: (el) => new ShowMoreComponent(el, additional.length)
    };
  }

  private getAdditionalProjectsCatalog(): ComponentConfig[] {
    const additional = this._allProjects.slice(this._mainProjectsCount);
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

  private getInfosConfig(): ComponentConfig {
    return {
      selector: 'infos',
      factory: (el) => new InfosComponent(el)
    }
  }

  private getOtherThingsConfig(): ComponentConfig {
    return {
      selector: 'other-things',
      factory: (el) => new OtherThingsComponent(el)
    }
  }
}
