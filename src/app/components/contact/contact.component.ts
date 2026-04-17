import {AppEventBus, Component, ComponentConfig, I18nService} from '../../../core/index.js';
import {ExternalLinkComponent} from "../common/index.js";

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ContactComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public override render(): HTMLElement {
    const link = document.getElementById('resume-link') as HTMLAnchorElement;
    link.href = `./assets/resumes/resume-lois-kouninef-${I18nService.currentLanguage}.pdf`;
    return super.render();
  }

  public childConfigs(): ComponentConfig[] {
    return [this.getGithubLinkConfig()];
  }

  private getGithubLinkConfig(): ComponentConfig {
    return {
      selector: 'github-icon',
      factory: (el) => new ExternalLinkComponent(el, {
        svgKey: 'github',
        url: 'github.com/LoisKOUNINEF/'
      })
    }
  }
}
