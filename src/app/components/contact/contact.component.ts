import {AppEventBus, Component, ComponentConfig, I18nService} from '../../../core/index.js';
import { BaseCardComponent } from '../common/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ContactComponent extends Component {
  private _resumeLink = `./assets/resumes/resume-lois-kouninef-${I18nService.currentLanguage}.pdf`;
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    AppEventBus.subscribe('language-changed', () => this.forceRender());
  }

  protected override forceRender(): void {
    this._resumeLink = `./assets/resumes/resume-lois-kouninef-${I18nService.currentLanguage}.pdf`;
    super.forceRender();
  }

  public childConfigs(): ComponentConfig[] {
    return [
      {
        selector: 'email-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/envelope.svg',
          labelKey: 'contact.email',
          subtextKey: 'contact.email-subtext',
          href: 'mailto:loiskouninef@gmail.com',
        }, { className: 'contact__link-card' })
      },
      {
        selector: 'linkedin-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/handshake.svg',
          labelKey: 'contact.linkedin',
          subtextKey: 'contact.linkedin-subtext',
          href: 'https://www.linkedin.com/in/lo%C3%AFs-kouninef/',
          target: '_blank',
        }, { className: 'contact__link-card' })
      },
      {
        selector: 'github-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/external/github.svg',
          labelKey: 'contact.github',
          subtextKey: 'contact.github-subtext',
          href: 'https://github.com/LoisKOUNINEF/',
          target: '_blank',
        }, { className: 'contact__link-card' })
      },
      {
        selector: 'resume-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
          labelKey: 'contact.resume',
          subtextKey: 'contact.resume-subtext',
          href: `./assets/resumes/resume-lois-kouninef-${I18nService.currentLanguage}.pdf`,
          download: 'loïs-kouninef-resume.pdf',
          target: '_self'
        }, { className: 'contact__link-card contact__resume-card' })
      },
    ];
  }
}
