import { ModalView, ButtonComponent, IPictureConfig, PictureComponent } from "../../../../libs/index.js";
import { CatalogConfig, ComponentConfig } from "../../../../core/index.js";

export interface IImageModalConfig extends IPictureConfig {
  viewName?: string;
}

const assetsBase = './assets/images/other-things/';
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
      alt: `${s} illustration`,
    };
  });
}

export const displayCarouselModal = () => {
  const modal = new ModalView({
    template: carouselModalTemplate(),
    components: carouselModalComponents(),
    catalogs: carouselModalCatalogs(),
  });
  modal.render();
  updateSlides();
}

const carouselModalTemplate = () => `__TEMPLATE_PLACEHOLDER__`;

const carouselModalComponents = (): ComponentConfig[] => [
  {
    selector: 'prev-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '‹',
      callback: () => displayPrev(),
      className: 'carousel__button carousel__button--prev'
    }),
  },
  {
    selector: 'next-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '›',
      callback: () => displayNext(),
      className: 'carousel__button carousel__button--next',
    }),
  }
];

const carouselModalCatalogs = (): CatalogConfig[] => [
  {
    selector: `carousel-pictures`,
    component: PictureComponent,
    array: carouselImagesSrc(),
    elementName: `carousel-picture`,
    props: { className: 'carousel__slide' }
  },
];

let currentIndex = 0;

function getSlides(): Element[] {
  const carousel = document.querySelector('[data-catalog="carousel-pictures"]');
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