# FocusableElementComponent — Implementation Plan

## 1. Problem statement

`InfoCardComponent` currently handles three conceptually distinct use cases in a single class,
with imperative constructor-time logic that mixes visual, semantic, and behavioural concerns:

| Caller | Mode | Current element | Current issue |
|---|---|---|---|
| infos (location, availability, languages) | Static display | `<div>` | Fine, but shares config fields it doesn't use |
| contact (email, LinkedIn, GitHub) | External link | `<a>` | Missing `rel`, no new-tab warning |
| resume-popover (PDF downloads) | Link + callback | `<a>` | Missing `rel`; callback listener not tracked |
| contact (resume popup) | Callback only | `<div role="button">` | No `aria-label`; keydown listener not tracked |

Additional problems:
- `icon: ''` is always an empty string — all callers use `iconSrc` exclusively.
- `id?: string` is declared but unused by every caller.
- `setCallback()` and `setTabNav()` add `addEventListener` calls in the constructor
  without pushing to `this.eventListeners`, so they are never cleaned up by the framework's
  destroy/re-render lifecycle.
- `setLinkAttributes()` mutates the DOM imperatively in the constructor rather than in a
  lifecycle hook, so a re-render triggered by `language-changed` would not re-apply them if
  config could ever change.
- The accessible name for the `role="button"` case relies on child text being computed by AT;
  no explicit `aria-label` is set.
- `c-external-link` is applied unconditionally to the subtext span, even on non-link cards.

---

## 2. Goal

Replace `InfoCardComponent` with a **stateless** `FocusableElementComponent` that:

1. Derives all element semantics (tag, role, tabindex, ARIA attributes, rel) purely from
   config at render time — no mutable instance fields, no imperative constructor side-effects.
2. Produces accessibility-correct output for each interaction mode.
3. Uses the framework's tracked event system (`this.eventListeners`) so every listener is
   cleaned up automatically on re-render and destroy.
4. Removes vestigial fields (`icon`, `id`).

"Stateless" here means: given the same config, every `render()` call produces identical DOM.
No internal flags like `_isOpen` or `_hasBeenClicked`. The component does not track its own
interaction history.

---

## 3. Interface: `IFocusableElementConfig`

```typescript
export interface IFocusableElementConfig {
  iconSrc: string;         // path to SVG/image; element hidden when empty (data-optional)
  labelKey: string;        // i18n key for the main label
  subtextKey: string;      // i18n key for the secondary line (hidden when empty via CSS :empty)
  href?: string;           // presence → link mode
  target?: string;         // "_blank" etc.; only meaningful when href is set
  download?: string;       // filename hint; only meaningful when href is set
  callback?: () => void;   // presence without href → action mode
  ariaLabel?: string;      // explicit accessible name override; auto-derived when absent
}
```

**Removed from `IInfoCardConfig`:**
- `icon` — always `''` in every caller; `iconSrc` is the actual field used.
- `id` — declared but never passed by any caller.

**Added:**
- `ariaLabel?: string` — lets callers provide an explicit accessible name when the
  `labelKey` translation is insufficient (e.g. icon-only cards).

---

## 4. Interaction modes

Mode is derived from config — no explicit discriminant field is needed.

### 4.1 Display mode
**Condition:** no `href`, no `callback`.  
**Element:** `<div>` (the default tagName from `Component`).  
**Accessibility:** No additional ARIA. The card is purely informational; it does not need to
be in the tab order. Do not add `tabindex`.  
**Callers:** `InfosComponent` (location, availability, languages cards).

### 4.2 Action mode
**Condition:** `callback` is set, `href` is absent.  
**Element:** `<div>` — semantically a generic container, given interactive meaning via ARIA.  
**ARIA:**
- `role="button"` — tells AT this element behaves like a button.
- `tabindex="0"` — places it in the natural tab order.
- `aria-label` — see §5 below.

**Keyboard contract:** activating via Enter or Space must call `callback()` and call
`event.preventDefault()` (Space scrolls the page by default).  
**Callers:** `ContactComponent` resume card, any future card that triggers an overlay or
in-page action without navigating.

### 4.3 Link mode
**Condition:** `href` is set.  
**Element:** `<a>` — pass `tagName: 'a'` to the base `Component`.  
**Attributes set at render time (in `onBeforeRender`):**
- `href` — always.
- `target` — when provided.
- `rel="noopener noreferrer"` — whenever `target` is set (security + AT context).
- `download` — when provided.
- `aria-label` — see §5 below.

**Note on `target: '_self'`:** this value is the browser default for `<a>` and is never
needed explicitly. It has been removed from all callers. Without `target`, neither `rel` nor
the new-tab `aria-label` suffix is applied — which is correct for same-tab download links.

**Callback on links:** `resume-popover` passes both `href` and `callback` (triggers
`downloadStarted()`). The callback is attached as a click listener tracked in
`this.eventListeners`; the browser still follows the `<a>` href normally.  
**Callers:** `ContactComponent` (email, LinkedIn, GitHub), `resume-popover` (PDF downloads).

---

## 5. Accessible name strategy

The accessible name is always set explicitly via `aria-label`. Relying on child text nodes
is fragile when AT computes the name from a mix of label + subtext strings.

**Derivation at render time (in `onBeforeRender`):**

```
ariaLabel =
  config.ariaLabel                                    // explicit override wins
  ?? I18nService.translate(config.labelKey, '')       // translated label
  ?? config.href                                      // last resort for links
```

**New-tab suffix (link mode, `target` set):**  
Append `I18nService.translate('common.new-tab', '(opens in new tab)')` to the resolved
`ariaLabel`. This uses the key added earlier in `src/app/components/common/locales/`.

Because callers that re-render on `language-changed` (e.g. `ContactComponent`) re-construct
child components on each render, the `I18nService.translate()` call always sees the current
language.

---

## 6. Event handling and the stateless design

### Why `onAfterRender` instead of `data-event`

`EventHelper.bindEvents` uses `element.querySelectorAll('[data-event]')` — it scans
**children** of `this.element`, not `this.element` itself. Because the interactive target IS
`this.element` (the root `<div role="button">` or `<a>`), `data-event` cannot be used here.

### Lifecycle placement

All event listeners go in `onAfterRender`. The framework calls:
```
autoBindEvents()   ← destroys all tracked listeners, re-adds data-event bindings
onAfterRender()    ← our listeners added here and pushed to this.eventListeners
```
On the next `render()` call, `autoBindEvents()` calls `EventHelper.destroyEvents(this.eventListeners)`
and clears the array — cleaning up both `data-event` bindings AND any listeners we pushed in
`onAfterRender`. No leaks across re-renders or destroys.

### Action mode listeners (click + keyboard)

```
onAfterRender():
  if not action mode → return

  click handler   → calls this.config.callback()
  keydown handler → if key is Enter or Space: preventDefault(), call this.config.callback()

  both pushed to this.eventListeners
```

### Link mode with callback

```
onAfterRender():
  if not (link mode AND callback present) → return

  click handler → calls this.config.callback()
  pushed to this.eventListeners
```
The `<a>` href navigation happens normally; the callback fires alongside it.

---

## 7. Template

All CSS classes are renamed from `info-card*` to `focusable-element*`.

```html
<span class="focusable-element__icon">
  <img class="focusable-element__icon-img" src="${_config.iconSrc}" alt="" data-optional="src">
</span>
<span class="focusable-element__content">
  <span class="focusable-element__label" data-i18n="${_config.labelKey}"></span>
  <span class="focusable-element__subtext${isExternalHref(_config.href) ? ' c-external-link' : ''}" data-i18n="${_config.subtextKey}"></span>
</span>
```

**`alt=""`** on the image is correct — the icon is decorative; the accessible name comes
from `aria-label` on the parent element.

**`c-external-link`** is applied to the subtext span only when the card points to an actual
external link. "External" is defined as an `href` starting with `http://`, `https://`, or
`//`. This is evaluated at template render time via `isExternalHref`, a module-level helper
defined in the `.ts` file before `templateFn`:

```typescript
const isExternalHref = (href?: string): boolean =>
  !!href && /^(https?:)?\/\//.test(href);
```

Because the `.html` file is inlined into `templateFn` as a template literal at build time,
`isExternalHref` is in scope when the template is evaluated.

Applied to callers:
- `mailto:` — `false` (internal protocol, not `//` or `http`)
- `https://linkedin.com/...` — `true`
- `https://github.com/...` — `true`
- `./assets/resumes/...` — `false` (relative path, local resource)

---

## 8. Component class — skeleton

```typescript
const isExternalHref = (href?: string): boolean =>
  !!href && /^(https?:)?\/\//.test(href);

const templateFn = (config: IFocusableElementConfig) => `__TEMPLATE_PLACEHOLDER__`;

export class FocusableElementComponent extends Component<HTMLElement, IFocusableElementConfig> {
  constructor(mountTarget: HTMLElement, config: IFocusableElementConfig, props?: ComponentProps) {
    const { className, ...restProps } = props ?? {};
    super({
      templateFn,
      mountTarget,
      config,
      tagName: config.href ? 'a' : 'div',
      normalizeKeys: ['href', 'target', 'download', 'iconSrc'],
      props: restProps,
    });
    this.element.classList.add('focusable-element');
    if (className) {
      className.split(' ').filter(Boolean).forEach(c => this.element.classList.add(c));
    }
  }

  protected override onBeforeRender(): void {
    super.onBeforeRender();          // Component.applyProps()
    this.applySemantics();
  }

  protected override onAfterRender(): void {
    this.applyEventListeners();
  }

  private isActionMode(): boolean {
    return !!this.config.callback && !this.config.href;
  }

  private isLinkMode(): boolean {
    return !!this.config.href;
  }

  private applySemantics(): void {
    const label = this.resolveAriaLabel();

    if (this.isActionMode()) {
      this.element.setAttribute('role', 'button');
      this.element.setAttribute('tabindex', '0');
      if (label) this.element.setAttribute('aria-label', label);
    }

    if (this.isLinkMode()) {
      const el = this.element as HTMLAnchorElement;
      el.href = this.config.href!;
      if (this.config.target) {
        el.target = this.config.target;
        el.rel = 'noopener noreferrer';
      }
      if (this.config.download) el.download = this.config.download;
      if (label) el.setAttribute('aria-label', label);
    }
  }

  private resolveAriaLabel(): string {
    const base = this.config.ariaLabel
      || I18nService.translate(this.config.labelKey, '')
      || this.config.href
      || '';

    if (this.config.target && this.isLinkMode()) {
      const suffix = I18nService.translate('common.new-tab', '(opens in new tab)');
      return `${base} ${suffix}`.trim();
    }

    return base;
  }

  private applyEventListeners(): void {
    if (this.isActionMode()) {
      const click: EventListener = () => this.config.callback!();
      const keydown: EventListener = (e) => {
        const ke = e as KeyboardEvent;
        if (ke.key === 'Enter' || ke.key === ' ') {
          ke.preventDefault();
          this.config.callback!();
        }
      };
      this.element.addEventListener('click', click);
      this.element.addEventListener('keydown', keydown);
      this.eventListeners.push(
        [this.element, 'click', click],
        [this.element, 'keydown', keydown],
      );
    }

    if (this.isLinkMode() && this.config.callback) {
      const click: EventListener = () => this.config.callback!();
      this.element.addEventListener('click', click);
      this.eventListeners.push([this.element, 'click', click]);
    }
  }
}
```

---

## 9. Link accessibility additions

Both link and action modes gain accessibility attributes that `InfoCardComponent` lacked:

| Case | Added |
|---|---|
| Any link with `target` | `rel="noopener noreferrer"` |
| Link with `target` | `aria-label` suffixed with new-tab notice |
| All interactive modes | Explicit `aria-label` from `labelKey` translation |
| External link subtext | `c-external-link` utility class |

This mirrors the fixes made to `AnchorManager`, applied here at the component level because
`FocusableElementComponent` sets link attributes directly on the element (not via `AnchorManager`).

---

## 10. Files

| Action | File |
|---|---|
| **Create** | `src/app/components/common/focusable-element/focusable-element.component.ts` |
| **Create** | `src/app/components/common/focusable-element/focusable-element.component.html` |
| **Create** | `src/app/components/common/focusable-element/focusable-element.component.scss` (renamed from `info-card.component.scss`; all class names updated from `.info-card*` to `.focusable-element*`) |
| **Delete** | `src/app/components/common/info-card/` (entire directory) |
| **Update** | `src/app/components/common/index.ts` — replace `InfoCardComponent` export with `FocusableElementComponent` |
| **Update** | `src/app/components/contact/contact.component.ts` — see §11.1 |
| **Update** | `src/app/components/contact/resume-popover/resume-popover.ts` — see §11.2 |
| **Update** | `src/app/components/infos/infos.component.ts` — see §11.3 |

Note: callers that pass `className` strings containing `info-card` to `props` (none currently
do) would need updating. Only the SCSS selectors and the component's own `classList.add` call
use the `info-card` name — both are handled in the files above.

---

## 11. Caller migrations

### 11.1 `ContactComponent`

All four cards migrate directly. Config changes: remove `icon: ''` from every card.

```typescript
// LinkedIn (link mode, external)
new FocusableElementComponent(el, {
  iconSrc: '/assets/images/svgs/mock-emojis/handshake.svg',
  labelKey: 'contact.linkedin',
  subtextKey: 'contact.linkedin-subtext',
  href: 'https://www.linkedin.com/in/lo%C3%AFs-kouninef/',
  target: '_blank',
}, { className: 'contact__link-card' })

// Resume popup (action mode)
new FocusableElementComponent(el, {
  iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
  labelKey: 'contact.resume',
  subtextKey: 'contact.resume-subtext',
  callback: () => displayResumePop(),
}, { className: 'contact__link-card contact__resume-card' })
```

Email and GitHub cards follow the same pattern as LinkedIn (link mode, no `target` for email).

### 11.2 `resume-popover.ts`

Both download cards: `href + download + callback`. `target: '_self'` removed — it was the
browser default and is unnecessary. Without `target`, neither `rel` nor the new-tab suffix
applies, which is correct for same-tab downloads.

```typescript
new FocusableElementComponent(el, {
  iconSrc: '/assets/images/svgs/mock-emojis/download.svg',
  labelKey: 'resume-popover.color-label',
  subtextKey: 'resume-popover.color-subtext',
  href: colorHref,
  download: colorFilename,
  callback: () => downloadStarted(),
}, { className: 'resume-popover__card' })
```

### 11.3 `InfosComponent`

All three cards are display mode (no `href`, no `callback`). No ARIA or event handling added.

```typescript
new FocusableElementComponent(el, {
  iconSrc: '/assets/images/svgs/mock-emojis/pin.svg',
  labelKey: 'infos.location-label',
  subtextKey: 'infos.location-subtext',
})
```

---

## 12. Open questions

1. **`ariaLabel` on display-mode cards**: Display cards (infos) have no interaction and no
   `aria-label` set. If a future caller places a display card inside a live region or a context
   where AT should announce it explicitly, `ariaLabel` can be passed. No action needed now.

2. **Focus ring styling**: The `action` mode div needs a visible `:focus-visible` ring.
   Confirm the existing global focus ring styles cover `.focusable-element[role="button"]`,
   or add a dedicated rule to `focusable-element.component.scss`.
