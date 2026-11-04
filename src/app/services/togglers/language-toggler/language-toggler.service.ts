import { I18nService, Service } from '../../../../core/index.js';
import { notify } from 'a11y-elements/overlays/snackbar';

export class LanguageTogglerService extends Service<LanguageTogglerService> {  
  public async toggleLang(): Promise<void> {
    const switchTo = I18nService.currentLanguage === 'en' ? 'fr' : 'en';
    await I18nService.setCurrentLanguage(switchTo);
    this.notifyChange();
  }

  private notifyChange() {
    const messages: Record<Nutin.Language, string> = {
      fr: 'Langue: Français',
      en: 'Language: English'
    };
    const currentLang = I18nService.currentLanguage;
    const message = messages[currentLang] || messages['fr'];
    notify(message!);
  }

}

export const languageTogglerService = LanguageTogglerService.getInstance();
