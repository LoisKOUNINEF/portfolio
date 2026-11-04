import { I18nService, html } from '../../../../core/index.js';
import { notify } from 'a11y-elements/overlays/snackbar';
import { ModalHost } from '../../common/modal-host/modal-host.js';
import { InfoCardComponent } from '../../common/info-card/info-card.component.js';

const resumeModalTemplate = () => html`__TEMPLATE_PLACEHOLDER__`;

// Download cards (InfoCardComponent): content centered, lifted on hover
const resumeCardClass = 'cursor-pointer no-underline w-3/4 self-center justify-between transition-[transform,box-shadow,border-color] duration-fast max-medium:w-full [&_.info-card-content]:text-center [&_.info-card-content]:grow max-medium:[&_.info-card-content]:pl-0 [&_.info-card-icon]:self-center hover:[transform:translateY(-2px)] hover:[box-shadow:0_7px_10px_color-mix(in_srgb,var(--primary),transparent_86%)] hover:border-primary hover:[&_.info-card-label]:text-text-muted hover:[&_.info-card-subtext]:text-text-muted active:[transform:translateY(1px)] focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary focus-visible:[&_.info-card-label]:text-text focus-visible:[&_.info-card-subtext]:text-text';

export const displayResumeModal = () => {
  const lang = I18nService.currentLanguage;
  const modal = new ModalHost({
    template: resumeModalTemplate(),
    components: resumeModalComponents(lang),
  });
  modal.render();
};

const downloadStarted = (): void => {
  const messages: Record<Nutin.Language, string> = {
    fr: 'Téléchargement lancé',
    en: 'Download started',
  };
  const currentLang = I18nService.currentLanguage;
  const message = messages[currentLang] || messages['fr'] || 'Download started';
  notify(message);
};

const resumeModalComponents = (lang: string): Nutin.ComponentConfig[] => {
  const colorHref = `/assets/resumes/resume-lois-kouninef-${lang}.pdf`;
  const monoHref = `/assets/resumes/resume-lois-kouninef-printable-${lang}.pdf`;
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
      }, { className: resumeCardClass })
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
      }, { className: `${resumeCardClass} [&_.info-card-icon-img]:[filter:grayscale(1)]` })
    },
  ];
};