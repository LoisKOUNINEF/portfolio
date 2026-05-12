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

export const displayImagePop = () => {
  const pop = new PopoverView({
    template: imagePopoverTemplate(),
    components: imagePopoverComponents(),
    catalogs: imagePopoverCatalogs(),
  });
  pop.render();
  updateSlides();
}

const imagePopoverTemplate = () => `__TEMPLATE_PLACEHOLDER__`;

const imagePopoverComponents = (): ComponentConfig[] => [
  {
    selector: 'prev-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '‹',
      callback: () => displayPrev(),
      className: 'image-carousel__button image-carousel__button--prev'
    }),
  },
  {
    selector: 'next-button',
    factory: (el) => new ButtonComponent(el, {
      textContent: '›',
      callback: () => displayNext(),
      className: 'image-carousel__button image-carousel__button--next',
    }),
  }
];

const imagePopoverCatalogs = (): CatalogConfig[] => [
  {
    selector: `carousel-pictures`,
    component: PictureComponent,
    array: carouselImagesSrc(),
    elementName: `carousel-picture`,
    props: { className: 'image-carousel__slide' }
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
    slide.querySelector('.image-carousel__slide')?.classList.toggle('active', i === currentIndex);
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