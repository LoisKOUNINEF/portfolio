import { Navigation, View, hideGlobals, html, revealGlobals } from '../../../core/index.js';
import { ButtonComponent } from '../../components/common/button/button.component.js';
import { OtherThingsComponent } from '../../components/other-things/other-things.component.js';

const template = html`__TEMPLATE_PLACEHOLDER__`;

// Replaced on this page by the fixed back button
const GLOBAL_IDS = ['navbar'];

// Reachable at /other-things and /secret only: no link points here
export class OtherThingsView extends View {
  constructor() {
    super({ template, viewName: 'other-things' });
    hideGlobals(GLOBAL_IDS);
  }

  public onExit(): void {
    revealGlobals(GLOBAL_IDS);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'other-things',
        factory: (el) => new OtherThingsComponent(el),
      },
      {
        selector: 'other-things-back',
        factory: (el) => new ButtonComponent(el, {
          i18nKey: 'other-things.back',
          className: 'other-things-view__back-btn',
          callback: () => Navigation.navigateTo('/'),
        }),
      },
    ];
  }
}
