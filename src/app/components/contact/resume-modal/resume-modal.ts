import { Overlays, ComponentConfig, I18nService } from '../../../../core/index.js';
import {notify, ModalView} from '../../../../libs/index.js';
import { InfoCardComponent } from '../../common/index.js';
import {Language} from "../../../../core/services/i18n/languages.js";

const resumeModalTemplate = () => `__TEMPLATE_PLACEHOLDER__`;

export const displayResumeModal = () => {
  const lang = I18nService.currentLanguage;
  const modal = new ModalView({
    template: resumeModalTemplate(),
    components: resumeModalComponents(lang),
  });
  modal.render();
};

const downloadStarted = (): void => {
  const messages: Record<Language, string> = {
    fr: 'Téléchargement lancé',
    en: 'Download started',
  };
  const currentLang = I18nService.currentLanguage;
  const message = messages[currentLang] || messages['fr'] || 'Download started';
  notify(message);
  Overlays.modalClosed();
};

const resumeModalComponents = (lang: string): ComponentConfig[] => {
  const colorHref = `./assets/resumes/resume-lois-kouninef-${lang}.pdf`;
  const monoHref = `./assets/resumes/resume-lois-kouninef-printable-${lang}.pdf`;
  const colorFilename = lang === 'en' ? 'Lois_Kouninef_Resume_Color.pdf' : 'Lois_Kouninef_CV_Couleur.pdf';
  const monoFilename = lang === 'en' ? 'Lois_Kouninef_Resume_Mono.pdf' : 'Lois_Kouninef_CV_Mono.pdf';

  return [
    {
      selector: 'resume-color-card',
      factory: (el) => new InfoCardComponent(el, {
        iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
        labelKey: 'resume-modal.color-label',
        subtextKey: 'resume-modal.color-subtext',
        href: colorHref,
        download: colorFilename,
        callback: () => downloadStarted(),
      }, { className: 'resume-modal__card' })
    },
    {
      selector: 'resume-mono-card',
      factory: (el) => new InfoCardComponent(el, {
        iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
        labelKey: 'resume-modal.mono-label',
        subtextKey: 'resume-modal.mono-subtext',
        href: monoHref,
        download: monoFilename,
        callback: () => downloadStarted(),
      }, { className: 'resume-modal__card resume-mono-card' })
    },
  ];
};