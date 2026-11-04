import { Component, html } from '../../../../../core/index.js';

// Full class names, so Tailwind finds them (colors: --color-tag-* in styles/tailwind.css)
const tagColors: Record<string, string> = {
  green: 'bg-tag-green-bg text-tag-green',
  blue: 'bg-tag-blue-bg text-tag-blue',
  teal: 'bg-tag-teal-bg text-tag-teal',
  purple: 'bg-tag-purple-bg text-tag-purple',
  orange: 'bg-tag-orange-bg text-tag-orange',
  red: 'bg-tag-red-bg text-tag-red',
  pink: 'bg-tag-pink-bg text-tag-pink',
  yellow: 'bg-tag-yellow-bg text-tag-yellow',
  cyan: 'bg-tag-cyan-bg text-tag-cyan',
  indigo: 'bg-tag-indigo-bg text-tag-indigo',
  lime: 'bg-tag-lime-bg text-tag-lime',
  brown: 'bg-tag-brown-bg text-tag-brown',
  grey: 'bg-tag-grey-bg text-tag-grey',
};

// Unknown or missing colors fall back to grey
const tagColor = (color?: string): string => tagColors[color ?? 'grey'] ?? tagColors.grey!;

const templateFn = (_config: IProjectTag) => html`__TEMPLATE_PLACEHOLDER__`;


export class ProjectTagComponent extends Component {
  constructor(mountTarget: HTMLElement, config: IProjectTag) {
    super({templateFn, mountTarget, config});
  }
}
