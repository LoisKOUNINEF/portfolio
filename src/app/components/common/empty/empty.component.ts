import { Component, html, raw } from '../../../../core/index.js';

export interface IEmptyConfig {
  isOptional: boolean;
}

const templateFn = (config: IEmptyConfig) => html`<div ${config.isOptional ? raw('data-optional') : ''}></div>`;

export class EmptyComponent extends Component {
  constructor(mountTarget: HTMLElement, config: IEmptyConfig = { isOptional: true }) {
    super({ templateFn, mountTarget, config });
  }
}
