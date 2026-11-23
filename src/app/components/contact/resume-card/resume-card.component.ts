import { I18nService } from '../../../../core/index.js';
import { notify } from 'a11y-elements/overlays/snackbar';
import { InfoCardComponent } from '../../common/info-card/info-card.component.js';
import { contactCardClass } from '../contact.component.js';

const resumeFilenames: Record<Nutin.Language, string> = {
  en: 'Lois_Kouninef_Fullstack_Web_Developer.pdf',
  fr: 'Lois_Kouninef_Developpeur_Web_Fullstack.pdf',
};

const downloadMessages: Record<Nutin.Language, string> = {
  en: 'Download started',
  fr: 'Téléchargement lancé',
};

const resumeLinkFor = (lang: Nutin.Language) => ({
  href: `/assets/resumes/resume-lois-kouninef-${lang}.pdf`,
  download: resumeFilenames[lang] ?? 'Lois_Kouninef_Fullstack_Web_Developer.pdf',
});

const downloadStarted = (): void => {
  notify(downloadMessages[I18nService.currentLanguage] ?? 'Download started');
};

// Contact's résumé card, mounted on its own by the home view so it can span the
// Contact and Infos columns. Same look as the contact cards, lifted on hover, with a primary label.
// Downloads the current language's résumé directly.
export class ResumeCardComponent extends InfoCardComponent {
  constructor(mountTarget: HTMLElement) {
    super(mountTarget, {
      iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
      labelKey: 'contact.resume',
      subtextKey: 'contact.resume-subtext',
      ...resumeLinkFor(I18nService.currentLanguage),
      callback: downloadStarted,
    }, { className: `${contactCardClass} [&_.info-card-label]:text-primary` });
    this.listenToRenderEvents(['language-changed']);
  }

  // Re-rendered on language change: point the link at that language's file
  protected override onBeforeRender(): void {
    super.onBeforeRender();
    Object.assign(this.config, resumeLinkFor(I18nService.currentLanguage));
  }
}
