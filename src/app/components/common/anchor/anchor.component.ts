import 'a11y-elements/accessibility-components/anchor';
import { Component, ComponentProps } from '../../../../core/index.js';
import { AttributesHelper, IAttributesConfig } from '../../../../libs/index.js';

export interface IAnchorConfig extends IAttributesConfig {
  // prefix href with '#' for internal anchor
  href: string;
  target?: string;
}

/**
 * Renders a real `<a>` inside `<a11y-anchor>` (a11y-elements), which handles
 * new-tab `rel`/labelling and smooth-scroll + focus for internal `#` anchors.
 */
export class AnchorComponent extends Component<HTMLElement, IAnchorConfig> {
  constructor(mountTarget: HTMLElement, config: IAnchorConfig, props?: ComponentProps) {
    super({
      mountTarget,
      tagName: 'a11y-anchor',
      config,
      normalizeKeys: ['style', 'pipes', 'className'],
      props
    });
  }

  protected override onAfterRender(): void {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', this.config.href);
    if (this.config.target) anchor.setAttribute('target', this.config.target);
    AttributesHelper.setAttributes(anchor, this.config);
    this.element.replaceChildren(anchor);
  }
}
