import { AppEventBus, Component, I18nService } from '../../../core/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class ContactComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public override render(): HTMLElement {
    const link = document.getElementById('resume-link') as HTMLAnchorElement;
    link.href = `./assets/resumes/resume-${I18nService.currentLanguage}.pdf`;
    return super.render();
  }
}
