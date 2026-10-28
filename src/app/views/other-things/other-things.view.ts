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

  public override onExit(): void {
    revealGlobals(GLOBAL_IDS);
  }

  public override registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'other-things',
        factory: (el) => new OtherThingsComponent(el),
      },
      {
        selector: 'other-things-back',
        factory: (el) => new ButtonComponent(el, {
          i18nKey: 'other-things.back',
          // Fixed pill, top left: stands in for the navbar on this page
          className: 'py-small px-medium border border-border-strong rounded-pill bg-surface [box-shadow:0_2px_6px_color-mix(in_srgb,var(--text),transparent_85%)] text-primary text-medium font-semibold hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
          callback: () => Navigation.navigateTo('/'),
        }),
      },
    ];
  }
}
