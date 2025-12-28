import { AnchorManager, Component, ComponentProps, IAnchorConfig } from '../../../../core/index.js';

/**
 * ```typescript
 * interface IAnchorConfig {
  // prefix href with '#' for internal anchor
  href: string;
  target?: string;
  textContent?: string;
  i18nKey?: string;
  className?: string;
  style?: string;
  // use regular pipe syntax for arguments / chaining
  pipes?: string;
  tagName?: keyof HTMLElementTagNameMap;
}
```
*/
export class AnchorComponent extends Component<HTMLAnchorElement, IAnchorConfig> {

  constructor(mountTarget: HTMLElement, config: IAnchorConfig, props?: ComponentProps) {
    super({
      mountTarget,
      tagName: config.tagName,
      config,
      normalizeKeys: ['style', 'pipes', 'className'],
      props
    });
    new AnchorManager(config, this.element);
  }
}
