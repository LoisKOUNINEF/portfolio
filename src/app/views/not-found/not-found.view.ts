import { I18nService, Navigation, View, hideGlobals, html, revealGlobals } from '../../../core/index.js';
import { ButtonComponent } from '../../components/common/button/button.component.js';
import { PictureComponent } from '../../components/common/picture/picture.component.js';

const template = html`__TEMPLATE_PLACEHOLDER__`;

const GLOBAL_IDS = ['navbar', 'site-footer'];

export class NotFoundView extends View {
  constructor() {
    super({template, viewName: 'not-found'});
    this.hideGlobals();
  }

  public override documentTitle(): string {
    return I18nService.translate('not-found.meta.title', 'Page Not Found');
  }

  public onExit(): void {
    this.revealGlobals();    
  }

  registerChildren(): Nutin.ComponentConfig[] {
    const btnClass = 'not-found__back-btn';
    return [
      {
        selector: 'not-found-image',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: '/assets/images/404.avif', type: 'image/avif' },
            { src: '/assets/images/404.webp', type: 'image/webp' },
          ],
          fallback: '/assets/images/404.jpg',
          width: 900,
          height: 699,
          alt: 'Page not found illustration — Black and white picture of a man standing on the edge of a wall. From the movie "Das Cabinet des Doktor Caligari", R. Wiene, 1920.',
          loading: 'eager',
        })
      },
      { 
        selector: 'back-to-home',
        factory: (el) => new ButtonComponent(el, 
          { i18nKey: 'not-found.redirect', callback: () => this.handleHome(), className: btnClass }
        )
      },
    ]
  }

  private hideGlobals(): void {
    hideGlobals(GLOBAL_IDS);
  }

  private revealGlobals(): void {
    revealGlobals(GLOBAL_IDS);
  }

  private handleHome(): void {
    Navigation.navigateTo('/');
  }
}
