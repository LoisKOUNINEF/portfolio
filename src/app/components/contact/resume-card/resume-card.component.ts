import { InfoCardComponent } from '../../common/info-card/info-card.component.js';
import { displayResumeModal } from '../resume-modal/resume-modal.js';

// Contact's résumé card, mounted on its own by the home view so it can span the
// Contact and Infos columns. Styled by contact.component.scss.
export class ResumeCardComponent extends InfoCardComponent {
  constructor(mountTarget: HTMLElement) {
    super(mountTarget, {
      iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
      labelKey: 'contact.resume',
      subtextKey: 'contact.resume-subtext',
      callback: () => displayResumeModal(),
    }, { className: 'contact__link-card contact__resume-card' });
    this.listenToRenderEvents(['language-changed']);
  }
}
