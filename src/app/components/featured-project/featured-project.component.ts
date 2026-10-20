import { Component, I18nService, html } from '../../../core/index.js';
import { AnchorComponent } from '../common/anchor/anchor.component.js';
import { PictureComponent } from '../common/picture/picture.component.js';

const templateFn = () => html`__TEMPLATE_PLACEHOLDER__`;

/**
 * Short presentation of Nutin; its link targets the Nutin card in Projects → Tools,
 * whose panel <a11y-tabs> selects before the jump.
 */
export class FeaturedProjectComponent extends Component {
  private readonly _imageSrc = './assets/images/projects/nutin';

  constructor(mountTarget: HTMLElement) {
    super({ templateFn, mountTarget, tagName: 'section' });
    this.listenToRenderEvents(['language-changed']);
  }

  public registerChildren(): Nutin.ComponentConfig[] {
    return [
      {
        selector: 'featured-project-picture',
        factory: (el) => new PictureComponent(el, {
          sources: [
            { src: `${this._imageSrc}.avif`, type: 'image/avif' },
            { src: `${this._imageSrc}.webp`, type: 'image/webp' },
          ],
          fallback: `${this._imageSrc}.jpg`,
          alt: I18nService.translate('featured-project.image-alt'),
        }),
      },
      {
        selector: 'featured-project-link',
        factory: (el) => new AnchorComponent(el, {
          href: '#nutin',
          i18nKey: 'featured-project.link',
          className: 'featured-project__link',
        }),
      },
    ];
  }
}
