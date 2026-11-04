import { ModalHost } from '../../common/modal-host/modal-host.js';
import { ButtonComponent } from '../../common/button/button.component.js';
import { IPictureConfig, PictureComponent } from '../../common/picture/picture.component.js';
import { I18nService, html } from '../../../../core/index.js';

export interface IImageModalConfig extends IPictureConfig {
  viewName?: string;
}

const assetsBase = '/assets/images/other-things/';
const carouselImages = ['board', 'marbles'];
const carouselImagesSrc = (): IImageModalConfig[] => {
  return carouselImages.map((s: string) => {
    const base = assetsBase + s;
    return {
      sources: [
        { src: `${base}.avif`, type: 'image/avif' },
        { src: `${base}.webp`, type: 'image/webp' },
      ],
      fallback: `${base}.jpg`,
      alt: I18nService.translate(`other-things.${s}-caption`),
      width: 1080,
      height: 1080,
    };
  });
}

// The open carousel's root element and current slide; each opening starts on the first slide
let carouselEl: HTMLElement | null = null;
let currentIndex = 0;

export const displayCarouselModal = () => {
  currentIndex = 0;
  const modal = new ModalHost({
    template: carouselModalTemplate(),
    components: carouselModalComponents(),
    catalogs: carouselModalCatalogs(),
    onClose: () => { carouselEl = null; },
  });
  carouselEl = modal.render();
  updateSlides();
}

const carouselModalTemplate = () => html`__TEMPLATE_PLACEHOLDER__`;

// Round prev/next buttons over the slide, vertically centered
const carouselButtonClass = 'absolute top-1/2 [transform:translateY(-50%)] z-2 size-10 border-none rounded-[50%] cursor-pointer flex items-center justify-center text-[1.5rem] leading-none bg-background/20 text-text dark:bg-text/20 dark:text-background transition-[background,scale] duration-fast ease-in-out hover:scale-110 hover:bg-background/60 dark:hover:bg-text/60';

const carouselModalComponents = (): Nutin.ComponentConfig[] => [
  {
    selector: 'prev-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '‹',
      ariaLabel: I18nService.translate('other-things.carousel-prev'),
      callback: () => displayPrev(),
      className: `${carouselButtonClass} left-medium`
    }),
  },
  {
    selector: 'next-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '›',
      ariaLabel: I18nService.translate('other-things.carousel-next'),
      callback: () => displayNext(),
      className: `${carouselButtonClass} right-medium`,
    }),
  }
];

const carouselModalCatalogs = (): Nutin.CatalogConfig[] => [
  {
    selector: `carousel-pictures`,
    component: PictureComponent,
    items: carouselImagesSrc(),
    elementName: `carousel-picture`,
    props: { className: 'carousel__slide' }
  },
];

function getSlides(): Element[] {
  const carousel = carouselEl?.querySelector('[data-catalog="carousel-pictures"]');
  return Array.from(carousel?.querySelectorAll('[data-index]') ?? []);
}

function updateSlides() {
  const slides = getSlides();
  slides.forEach((slide, i) => {
    slide.querySelector('.carousel__slide')?.classList.toggle('active', i === currentIndex);
  });
}

function displayPrev() {
  const total = getSlides().length;
  currentIndex = (currentIndex - 1 + total) % total;
  updateSlides();
}

function displayNext() {
  const total = getSlides().length;
  currentIndex = (currentIndex + 1) % total;
  updateSlides();
}
