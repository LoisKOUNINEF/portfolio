import { AppEventBus, ComponentConfig, I18nService } from '../../../../core/index.js';
import {notify, PopoverView} from '../../../../libs/index.js';
import { InfoCardComponent } from '../../common/index.js';
import {Language} from "../../../../core/services/i18n/languages.js";

const resumePopoverTemplate = () => `__TEMPLATE_PLACEHOLDER__`;

export const displayResumePop = () => {
  const lang = I18nService.currentLanguage;
  const pop = new PopoverView({
    template: resumePopoverTemplate(),
    components: resumePopoverComponents(lang),
  });
  pop.render();
};

const downloadStarted = (): void => {
  const messages: Record<Language, string> = {
    fr: 'Téléchargement lancé',
    en: 'Download started',
  };
  const currentLang = I18nService.currentLanguage;
  const message = messages[currentLang] || messages['fr'] || 'Download started';
  notify(message);
  AppEventBus.emit('popover-close')
};

const resumePopoverComponents = (lang: string): ComponentConfig[] => {
  const colorHref = `./assets/resumes/resume-lois-kouninef-${lang}.pdf`;
  const monoHref = `./assets/resumes/resume-lois-kouninef-printable-${lang}.pdf`;
  const colorFilename = lang === 'en' ? 'Lois_Kouninef_Resume_Color.pdf' : 'Lois_Kouninef_CV_Couleur.pdf';
  const monoFilename = lang === 'en' ? 'Lois_Kouninef_Resume_Mono.pdf' : 'Lois_Kouninef_CV_Mono.pdf';

  return [
    {
      selector: 'resume-color-card',
      factory: (el) => new InfoCardComponent(el, {
        icon: '',
        iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
        labelKey: 'resume-popover.color-label',
        subtextKey: 'resume-popover.color-subtext',
        href: colorHref,
        download: colorFilename,
        target: '_self',
        callback: () => downloadStarted(),
      }, { className: 'resume-popover__card' })
    },
    {
      selector: 'resume-mono-card',
      factory: (el) => new InfoCardComponent(el, {
        icon: '',
        iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
        labelKey: 'resume-popover.mono-label',
        subtextKey: 'resume-popover.mono-subtext',
        href: monoHref,
        download: monoFilename,
        target: '_self',
        callback: () => downloadStarted(),
      }, { className: 'resume-popover__card resume-mono-card' })
    },
  ];
};