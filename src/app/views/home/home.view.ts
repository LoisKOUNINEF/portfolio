import { View, html } from '../../../core/index.js';
import { EmptyComponent } from '../../components/common/empty/empty.component.js';
import { AboutMeComponent } from '../../components/about/about.component.js';
import { ContactComponent } from '../../components/contact/contact.component.js';
import { HeroComponent } from '../../components/hero/hero.component.js';
import { InfosComponent } from '../../components/infos/infos.component.js';
import { OtherThingsComponent } from '../../components/other-things/other-things.component.js';
import { ProjectCardComponent } from '../../components/project/project-card/project-card.component.js';
import { ShowMoreComponent } from '../../components/project/show-more/show-more.component.js';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component.js';

const template = html`__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
  private readonly _allProjects: ProjectFolderName[] = ['nutin', 'paris-2024', 'pixels-mansion', /*'run-for-the-bun'*/];
  private readonly _mainProjectsCount = 2;
  private _selfHostingProjectFolder: ProjectFolderName = 'self-hosting';

  constructor() {
    super({template, tagName: 'div', viewName: 'home'});
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return this.getChildConfigs();
  }

  private getChildConfigs(): Nutin.ComponentConfig[] {
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
  private getHeroConfig(): Nutin.ComponentConfig {
    return {
      selector: 'hero',
      factory: (el) => new HeroComponent(el)
    }
  }

  private getAboutMeConfig(): Nutin.ComponentConfig {
    return {
      selector: 'about',
      factory: (el) => new AboutMeComponent(el)
    }
  }

  private getMainProjectsCatalog(): Nutin.ComponentConfig[] {
    return this.createCatalogComponents({
      items: this._allProjects.slice(0, this._mainProjectsCount),
      selector: 'main-projects-catalog',
      elementName: 'main-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getShowMoreBtnConfig(): Nutin.ComponentConfig {
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

  private getAdditionalProjectsCatalog(): Nutin.ComponentConfig[] {
    const additional = this._allProjects.slice(this._mainProjectsCount);
    if (!additional.length) return [];
    return this.createCatalogComponents({
      items: additional,
      selector: 'additional-projects-catalog',
      elementName: 'additional-project',
      component: ProjectCardComponent,
      elementTag: 'article'
    });
  }

  private getStackConfig(): Nutin.ComponentConfig {
    return {
      selector: 'tech-stack',
      factory: (el) => new TechStackComponent(el)
    }
  }

  private getSelfHostingProjectConfig(): Nutin.ComponentConfig {
    return {
      selector: 'infrastructure',
      factory: (el) => new ProjectCardComponent(el, 
        this._selfHostingProjectFolder
      )
    }
  }

  private getContactConfig(): Nutin.ComponentConfig {
    return {
      selector: 'contact',
      factory: (el) => new ContactComponent(el)
    }
  }

  private getInfosConfig(): Nutin.ComponentConfig {
    return {
      selector: 'infos',
      factory: (el) => new InfosComponent(el)
    }
  }

  private getOtherThingsConfig(): Nutin.ComponentConfig {
    return {
      selector: 'other-things',
      factory: (el) => new OtherThingsComponent(el)
    }
  }
}
