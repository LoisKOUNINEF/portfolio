import { View, html } from '../../../core/index.js';
import { AboutMeComponent } from '../../components/about/about.component.js';
import { ContactComponent } from '../../components/contact/contact.component.js';
import { FeaturedProjectComponent } from '../../components/featured-project/featured-project.component.js';
import { HeroComponent } from '../../components/hero/hero.component.js';
import { InfosComponent } from '../../components/infos/infos.component.js';
import { ResumeCardComponent } from '../../components/contact/resume-card/resume-card.component.js';
import { ProjectsComponent } from '../../components/projects/projects.component.js';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component.js';

const template = html`__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
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
      this.getFeaturedProjectConfig(),
      this.getProjectsConfig(),
      this.getStackConfig(),
      this.getContactConfig(),
      this.getInfosConfig(),
      this.getResumeCardConfig(),
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

  private getFeaturedProjectConfig(): Nutin.ComponentConfig {
    return {
      selector: 'featured-project',
      factory: (el) => new FeaturedProjectComponent(el)
    }
  }

  private getProjectsConfig(): Nutin.ComponentConfig {
    return {
      selector: 'projects',
      factory: (el) => new ProjectsComponent(el)
    }
  }

  private getStackConfig(): Nutin.ComponentConfig {
    return {
      selector: 'tech-stack',
      factory: (el) => new TechStackComponent(el)
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

  private getResumeCardConfig(): Nutin.ComponentConfig {
    return {
      selector: 'resume-card',
      factory: (el) => new ResumeCardComponent(el)
    }
  }
}
