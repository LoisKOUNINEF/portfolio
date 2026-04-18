import { AppEventBus, Component, ComponentConfig } from '../../../core/index.js';
import { BaseCardComponent } from '../common/index.js';

const templateFn = () => `__TEMPLATE_PLACEHOLDER__`;

export class InfosComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
    AppEventBus.subscribe('language-changed', () => this.render());
  }

  public childConfigs(): ComponentConfig[] {
    return [
      {
        selector: 'location-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/pin.svg',
          labelKey: 'infos.location-label',
          subtextKey: 'infos.location-subtext',
        })
      },
      {
        selector: 'availability-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/calendar.svg',
          labelKey: 'infos.availability-label',
          subtextKey: 'infos.availability-subtext',
        })
      },
      {
        selector: 'languages-card',
        factory: (el) => new BaseCardComponent(el, {
          icon: '',
          iconSrc: '/assets/images/svgs/mock-emojis/dialog.svg',
          labelKey: 'infos.languages-label',
          subtextKey: 'infos.languages-subtext',
        })
      },
    ];
  }
}
