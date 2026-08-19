import { Navigation, ComponentConfig, View } from '../../../core/index.js';
import { ButtonComponent, PictureComponent } from '../../../libs/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class NotFoundView extends View {
  constructor() {
    super({template, viewName: 'not-found'});
    this.hideGlobals();
  }

  public onExit(): void {
    this.revealGlobals();    
  }

  childConfigs(): ComponentConfig[] {
    const btnClass = 'not-found__back-btn';
    return [
      {
        selector: 'not-found-image',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: ' /assets/images/404.avif', type: 'image/avif' },
            { src: ' /assets/images/404.webp', type: 'image/webp' },
          ],
          fallback: '/assets/images/404.jpg',
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
    this.hideHeader();
    this.hideFooter();
  }

  private revealGlobals(): void {
    this.revealHeader();
    this.revealFooter();
  }

  private handleHome(): void {
    Navigation.navigateTo('/');
  }
}
