import { PopoverView } from "../../../../libs/index.js";
import { CatalogConfig, ComponentConfig } from "../../../../core/index.js";
import { ButtonComponent, IPictureConfig, PictureComponent } from "../../common/index.js";

export interface IImagePopConfig extends IPictureConfig {
  viewName?: string;
}

const assetsBase = './assets/images/other-things/';
const carouselImages = ['board', 'marbles'];
const carouselImagesSrc = () => {
  return carouselImages.map((s: string) => {
    return {
      imageSrc: assetsBase + s,
      imageAlt: s + ' illustration',
      // captionI18nKey: 'other-things.' + s + '-caption'
    }
  })
}

export const displayCarouselPop = () => {
  const pop = new PopoverView({
    template: carouselPopoverTemplate(),
    components: carouselPopoverComponents(),
    catalogs: carouselPopoverCatalogs(),
  });
  pop.render();
  updateSlides();
}

const carouselPopoverTemplate = () => `__TEMPLATE_PLACEHOLDER__`;

const carouselPopoverComponents = (): ComponentConfig[] => [
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

const carouselPopoverCatalogs = (): CatalogConfig[] => [
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