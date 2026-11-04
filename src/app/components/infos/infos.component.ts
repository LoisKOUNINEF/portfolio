import { Component, html } from '../../../core/index.js';
import { InfoCardComponent } from '../common/info-card/info-card.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

export class InfosComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    this.listenToRenderEvents(['language-changed']);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'location-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/mock-emojis/pin.svg',
          labelKey: 'infos.location-label',
          subtextKey: 'infos.location-subtext',
        })
      },
      {
        selector: 'availability-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/mock-emojis/calendar.svg',
          labelKey: 'infos.availability-label',
          subtextKey: 'infos.availability-subtext',
        })
      },
      {
        selector: 'languages-card',
        factory: (el) => new InfoCardComponent(el, {
          iconSrc: '/assets/images/svgs/mock-emojis/dialog.svg',
          labelKey: 'infos.languages-label',
          subtextKey: 'infos.languages-subtext',
        })
      },
    ];
  }
}
