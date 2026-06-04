import { Navigation, ComponentConfig, View } from '../../../core/index.js';
import { ButtonComponent, PictureComponent } from '../../../libs/index.js';

const template = `__TEMPLATE_PLACEHOLDER__`;

export class NotFoundView extends View {
  constructor() {
    super({template});
    this.hideGlobals();
  }

  public onExit(): void {
    this.revealGlobals();    
  }

  childConfigs(): ComponentConfig[] {
    const btnClass = 'not-found__back-btn';
    return [
      {
        selector: 'other-things-thumbnail',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: './assets/images/404.avif', type: 'image/avif' },
            { src: './assets/images/404.webp', type: 'image/webp' },
          ],
          fallback: './assets/images/404.jpg',
          alt: 'Page not found illustration — carved books.',
          loading: 'eager',
        })
      },
      { 
        selector: 'back-to-home',
        factory: (el) => new ButtonComponent(el, { i18nKey: 'not-found.redirect', callback: () => this.handleHome(), className: btnClass 
        })
      },
    ]
  }

  private handleHome(): void {
    Navigation.navigateTo('/');
  }

  private hideGlobals() {
    const navbar = document.getElementById('navbar') as HTMLElement;
    navbar.style = 'display: none';
    const footer = document.getElementById('footer') as HTMLElement;
    footer.style = 'display: none';
  }

  private revealGlobals() {
    const navbar = document.getElementById('navbar') as HTMLElement;
    navbar.style = 'display: block';
    const footer = document.getElementById('footer') as HTMLElement;
    footer.style = 'display: block';
  }
}
