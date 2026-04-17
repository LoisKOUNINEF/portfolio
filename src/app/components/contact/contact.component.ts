import { AppEventBus, Component, I18nService } from '../../../core/index.js';
import {notify} from "../../../libs/index.js";
import {Language} from "../../../core/services/i18n/languages.js";

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

  private resumeDownloaded = (): void => {
    const messages: Record<Language, string> = {
      fr: 'CV Téléchargé',
      en: 'Resume Downloaded'
    };
    const currentLang = I18nService.currentLanguage;
    const message = messages[currentLang] || messages['fr'];
    notify(message!, { type: 'success' });
  }
}
