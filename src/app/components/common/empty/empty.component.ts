import { Component } from '../../../../core/index.js';

const templateFn = () => `<div></div>`;

export class EmptyComponent extends Component {
  constructor(mountTarget: HTMLElement) {
    super({templateFn, mountTarget});
  }
}
