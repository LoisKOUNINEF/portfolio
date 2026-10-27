import { Component, html } from '../../../core/index.js';
import { InfoCardComponent } from '../common/info-card/info-card.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

// Contact cards (InfoCardComponent), also used by the résumé card: border and shadow on hover,
// the label's ::after stretched over the card so a click anywhere follows the link
export const contactCardClass = 'relative cursor-pointer no-underline text-inherit transition-[transform,box-shadow,border-color] duration-fast hover:[box-shadow:0_7px_10px_color-mix(in_srgb,var(--primary),transparent_86%)] hover:border-border hover:[&_.info-card-label]:text-text-muted hover:[&_.info-card-subtext]:text-text-muted focus-visible:outline-offset-2 focus-visible:outline-2 focus-visible:outline-primary [&_.info-card-label]:after:absolute [&_.info-card-label]:after:inset-0 [&_.info-card-label]:after:rounded-large';

// Lifted on hover, pressed on click: the résumé card only
export const cardLiftClass = 'hover:[transform:translateY(-2px)] active:[transform:translateY(1px)]';

export class ContactComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'email-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/mock-emojis/envelope.svg',
          labelKey: 'contact.email',
          subtextKey: 'contact.email-subtext',
          href: 'mailto:loiskouninef@gmail.com',
        }, { className: contactCardClass })
      },
      {
        selector: 'linkedin-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/mock-emojis/handshake.svg',
          labelKey: 'contact.linkedin',
          subtextKey: 'contact.linkedin-subtext',
          href: 'https://www.linkedin.com/in/lo%C3%AFs-kouninef/',
          target: '_blank',
        }, { className: contactCardClass })
      },
      {
        selector: 'github-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/external/github.svg',
          labelKey: 'contact.github',
          subtextKey: 'contact.github-subtext',
          href: 'https://github.com/LoisKOUNINEF/',
          target: '_blank',
        }, { className: contactCardClass })
      },
    ];
  }
}
