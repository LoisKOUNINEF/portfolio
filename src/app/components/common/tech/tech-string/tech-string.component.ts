import { Component, html } from '../../../../../core/index.js';
import { getLabel } from '../tech-metadata.helper.js';

const templateFn = (_config: { labels: string }) => html`__TEMPLATE_PLACEHOLDER__`;

export class TechStringComponent extends Component {
  constructor(mountTarget: HTMLElement, config: ITech[]) {
    const labels = getLabel(config.slice(0, 3));
    super({ templateFn, mountTarget, config: { 
      labels
    }});
  }
}
