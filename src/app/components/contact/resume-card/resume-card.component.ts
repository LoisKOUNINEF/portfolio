import { InfoCardComponent } from '../../common/info-card/info-card.component.js';
import { contactCardClass } from '../contact.component.js';
import { displayResumeModal } from '../resume-modal/resume-modal.js';

// Contact's résumé card, mounted on its own by the home view so it can span the
// Contact and Infos columns. Same look as the contact cards, with a primary label.
export class ResumeCardComponent extends InfoCardComponent {
  constructor(mountTarget: HTMLElement) {
    super(mountTarget, {
      iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
      labelKey: 'contact.resume',
      subtextKey: 'contact.resume-subtext',
      callback: () => displayResumeModal(),
    }, { className: `${contactCardClass} [&_.info-card-label]:text-primary` });
    this.listenToRenderEvents(['language-changed']);
  }
}
