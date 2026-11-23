import { View, html } from '../../../core/index.js';
import { AboutMeComponent } from '../../components/about/about.component.js';
import { ContactComponent } from '../../components/contact/contact.component.js';
import { FeaturedProjectComponent } from '../../components/featured-project/featured-project.component.js';
import { HeroComponent } from '../../components/hero/hero.component.js';
import { InfosComponent } from '../../components/infos/infos.component.js';
import { ResumeCardComponent } from '../../components/contact/resume-card/resume-card.component.js';
import { ProjectsComponent } from '../../components/projects/projects.component.js';
import { TechStackComponent } from '../../components/tech-stack/tech-stack.component.js';
import { openProjectAfterScroll } from '../../components/project/project-modal/project-modal.js';
import { isProjectFolder } from '../../services/project/project.service.js';
import { PROJECT_PARAM, setProjectParam } from '../../services/project/project-url.helper.js';

const template = html`__TEMPLATE_PLACEHOLDER__`;

export class HomeView extends View {
  constructor() {
    super({template, tagName: 'div', viewName: 'home'});
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return this.getChildConfigs();
  }

  // `?project=<folder>`: jumps to the project's card and opens its modal.
  // The param leaves the URL right away, before the router records the URL it rendered
  // (else a later back/forward would rebuild the view); the modal puts it back while open.
  public override onEnter(): void {
    const folder = this.getQueryParam(PROJECT_PARAM);
    if (folder === undefined) return;
    setProjectParam(null);
    if (!isProjectFolder(folder)) return;
    // After the router's own scroll (to the hash, else the top)
    setTimeout(() => {
      if (!this.isDestroyed) openProjectAfterScroll(folder, { scrollToCard: true });
    }, 0);
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
