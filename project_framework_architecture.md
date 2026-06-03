---
name: project-framework-architecture
description: "Complete reference for the custom zero-dependency TypeScript frontend framework used in this portfolio project — base classes, services, templating, routing, build pipeline, and conventions."
metadata: 
  node_type: memory
  type: project
  originSessionId: 6afcc717-8ae3-40f9-9beb-d92b2c481cd3
---

# Custom Frontend Framework — Architecture Reference

A production-grade, zero-runtime-dependency frontend framework. TypeScript + Sass + esbuild only. No React, Vue, Angular, jQuery, axios. Designed for maintainable small-scale personal apps.

**Why:** Avoid heavyweight framework overhead while keeping component architecture, routing, i18n, templating, and DX (TypeScript, hot reload, scaffolding).  
**How to apply:** When suggesting changes, always stay within the framework's patterns. Do not suggest adding npm runtime packages — everything should be achievable with what exists.

---

## Directory Layout

```
src/
  core/          ← Framework internals (DO NOT modify without good reason)
  libs/          ← Reusable UI utilities (overlays, pipes, guards)
  app/           ← Application code
    main.ts      ← Entry point (init sequence)
    routes.ts    ← Route definitions
    views/       ← Page-level classes (extend View)
    components/  ← Reusable UI classes (extend Component)
    services/    ← App singletons (extend Service)
tools/
  builder/       ← Build pipeline (esbuild, sass, template merging, hashing, compression)
  dev/           ← Dev server with watch + live reload
  generator/     ← Scaffolding CLI for new components/views/services
```

---

## Base Classes

### `BaseComponent<T extends HTMLElement>`
`src/core/base-classes/base-component/base-component.ts`

Core rendering engine. All UI classes ultimately extend this.

**Lifecycle hooks (override as needed):**
- `onBeforeRender()` / `onAfterRender()`
- `onBeforeDestroy()` / `onAfterDestroy()`

**Key methods:**
- `render()` — generate HTML, sanitize, compose children, hydrate data attributes
- `destroy()` — cleanup events, children, bus subscriptions
- `hydrate()` — parse `data-i18n` and `data-pipe` attributes
- `compose()` — recursively init child components from `data-component` selectors
- `childConfigs()` — override to declare child component factories
- `catalogConfig(...)` — helper to generate a list of components from an array
- `listen<K>(event, handler)` — subscribe to `AppEventBus` (auto-unsubscribed on destroy)
- `listenToRenderEvents(events[])` — re-render this component when any listed event fires

### `Component<TConfig, TElement>`
`src/core/base-classes/component/component.ts`  
Extends `BaseComponent`. Use this for all reusable components.

**Adds:**
- `templateFn` — function `(config) => string` that returns the component's HTML
- `config` object with typed defaults (merged via `ConfigHelper.normalize()`)
- `props` system — sync HTML attribute / form values to component state via `data-bind`
- `getValues()` — extract all `data-bind` values from the DOM
- `generateTemplate()` — merges config + defaults, calls templateFn

### `Service<T>`
`src/core/base-classes/service/service.ts`  
Singleton base. All services inherit this.

- `Service.getInstance<T>()` — creates or returns the single instance
- All methods are auto-bound to the instance
- `onDestroy()` hook for cleanup
- `Service.destroyAll()` — called on `beforeunload`

### `View<T>`
`src/core/base-classes/view/view.ts`  
Extends `BaseComponent`. Use for page-level components (one per route).

**Adds:**
- `onEnter()` / `onExit()` — navigation lifecycle hooks (called by router)
- `getRouteParam(key)` / `setRouteParams(params)` / `hasRouteParam(key)`
- `shouldUpdateMetaContent()` — return `{ title, description }` for `<head>` updates
- Class name auto-converts: `HomeView` → selector `home-view`

---

## Templating System (Data Attributes)

All binding is declarative via HTML data attributes. No JSX, no template literals with logic (logic lives in the class).

| Attribute | Purpose |
|---|---|
| `data-component="selector"` | Mount point for a child component |
| `data-event="event:handler:tokens"` | Bind DOM event to a class method |
| `data-bind="key"` | Two-way data binding for form inputs / textContent |
| `data-i18n="section.key"` | Translate text content or placeholder |
| `data-pipe="pipeName:args\|pipe2"` | Transform a value through a pipe chain |
| `data-pipe-source="value"` | Override input value for a pipe |
| `data-optional="value"` | Remove element from DOM if value is falsy |

### Event Tokens (used in `data-event`)

Tokens are resolved to real values at bind time:

| Token | Resolves to |
|---|---|
| `@id` | `element.id` |
| `@value` | `element.value` |
| `@checked` | `element.checked` |
| `@event` | The native Event object |
| `@target` | `event.target` |
| `@x` / `@y` | Mouse coordinates |
| `@key` / `@code` | Keyboard key/code |
| `@textContent` | `element.textContent` |
| `@html` | `element.innerHTML` |
| `@attr:name` | `element.getAttribute('name')` |
| `@dataset:key` | `element.dataset.key` |
| `"literal"` / `'literal'` | String literal |
| number | Numeric literal |

---

## Core Services

### EventBus
`src/core/services/event-bus/event-bus.ts`

Global pub/sub. Events are **type-safe** via `EventMap` in `src/core/internals.d.ts`.

```typescript
AppEventBus.subscribe('language-changed', handler);
AppEventBus.emit('language-changed', payload);
AppEventBus.off('language-changed', handler);
AppEventBus.once('language-changed', handler);
```

**Framework events:** `navigate`, `reload`, `before-render`, `after-render`, `before-destroy`, `after-destroy`, `view-mount`, `view-unmount`, `popover-opened`, `popover-closed`, `language-changed`

**Adding app events:** Extend `AppEventMap` in `src/app/globals.d.ts`.

**Convenience facades:**
- `Navigation.navigateTo(path)` / `Navigation.reload()`
- `Overlays.onPopoverOpened(cb)` / `Overlays.onPopoverClosed(cb)`

### Router
`src/core/services/router/router.ts`

Client-side routing with History API.

```typescript
// routes.ts
export const routes: Routes = {
  '/': () => new HomeView(),
  '/projects/:id': {
    view: () => new ProjectView(),
    guards: [Guards.requireAuth()]
  },
  '/404': () => new NotFoundView()
};

// main.ts
const router = AppRouter(routes);  // singleton factory
```

- Supports path params: `/users/:id`, optional: `/posts/:id?`
- Guards: `(params) => boolean | string | Promise<boolean|string>` — return redirect path to redirect
- Old view destroyed (`onExit`), new view rendered (`onEnter`), scroll reset
- `router.navigate(path)` programmatic navigation

### HttpClient
`src/core/services/http-client/http-client.ts`

Fetch wrapper. Base URL + default headers + interceptors + timeout.

```typescript
const http = HttpClient.getInstance();
const data = await http.get<MyType>('/api/endpoint');
await http.post('/api/endpoint', body);
```

Throws `HttpError` (has `.status`, `.statusText`) on non-2xx responses.

### I18nService
`src/core/services/i18n/i18n.ts`

Localization from `/locales/{lang}.json`.

```typescript
const i18n = I18nService.getInstance();
i18n.translate('section.key', 'fallback');
i18n.getTranslationObject<T>('section');
await i18n.setCurrentLanguage('fr');
await i18n.initTranslations();  // called in main.ts
```

- Dot-notation keys: `"nav.home"`
- Fallback: missing keys in non-default language fall back to default language
- Emits `'language-changed'` on switch

### PipeRegistry
`src/core/services/pipe-registry/pipe-registry.ts`

Register custom transforms for `data-pipe` attributes.

```typescript
PipeRegistry.register('myPipe', (value, ...args) => transformedString);
PipeRegistry.apply('myPipe', value, args);
```

Built-in pipes (registered in `src/libs/pipes/pipes.ts`):  
`currency`, `date`, `number`, `uppercase`, `lowercase`, `capitalize`, `capitalizeAll`, `truncate`, `default`, `json`

---

## UI Libraries (`src/libs/`)

### PopoverView (Modal/Dialog)
`src/libs/overlays/popover/popover.ts`

Extends `View`. Full-featured modal with focus trap, backdrop, animation, scroll lock.

```typescript
const modal = new MyPopoverView(hostElement);
modal.render();  // opens
modal.destroy(); // closes
```

Features: close button + callback, dynamic buttons via `ButtonManager`, Escape key, click-outside-to-close, accessibility (tab trap, focus return, ARIA).

### Snackbar (`notify`)
`src/libs/overlays/snackbar/snackbar.ts`

Toast notification queue.

```typescript
notify('Saved!', { type: 'success', duration: 3000 });
notify('Error', { type: 'error', position: 'top-right' });
notify('Info', { type: 'info', action: { label: 'Undo', callback: fn } });
```

### Guards
`src/libs/guards/guards.ts`

```typescript
Guards.custom((params) => condition || '/redirect-path')
Guards.requireAuth()   // checks localStorage token
```

---

## Composition Patterns

### Parent Declaring Children

```typescript
childConfigs(): ComponentConfig[] {
  return [
    { selector: 'hero', factory: (el) => new HeroComponent(el) },
    { selector: 'footer-links', factory: (el) => new FooterLinksComponent(el) },
  ];
}

// In template:
// <div data-component="hero"></div>
```

### Catalog (Array → Component List)

```typescript
childConfigs(): ComponentConfig[] {
  return [
    ...this.catalogConfig({
      array: this.projects,
      selector: 'project-card',
      component: ProjectCardComponent,
      elementName: 'project'
    })
  ];
}
// Generates data-component="project-card-0", "project-card-1", etc.
```

### Event-Driven Re-render

```typescript
constructor(el: HTMLElement) {
  super(el);
  this.listenToRenderEvents(['language-changed', 'theme-changed']);
}
```

### Dynamic Buttons

```typescript
// In component config or popover
buttons: ButtonManager.create([
  { label: 'Confirm', callback: this.handleConfirm, variant: 'primary' },
  { label: 'Cancel', callback: this.handleCancel }
])
```

---

## Security

Three sanitization trust levels on `render()`:

| Level | Behavior |
|---|---|
| `'strict'` | Remove iframes, objects, `data:` URLs, `javascript:` URLs |
| `'normal'` (default) | Remove `<script>` tags and inline event handlers |
| `'trusted'` | No sanitization |

All event token values are HTML-escaped by default via `SecurityHelper.escapeHtml()`.

---

## Build Pipeline (`tools/builder/`)

**Dev** (`npm run dev`): TypeScript check → template merge → Sass → watch + live reload  
**Prod** (`npm run build`): same + esbuild bundle/minify → content-hash filenames → gzip + brotli

Key steps:
1. Copy static assets → `dist/`
2. Merge HTML templates: `__TEMPLATE_PLACEHOLDER__` in `.ts` files is replaced with minified HTML at build time
3. Build i18n: combine locale JSON files
4. Compile Sass → `dist/styles.css`
5. Validate `index.html` (meta tags, script tags)
6. ESBuild bundle (prod only, with `keepNames: true` for View class name → selector conversion)
7. Hash filenames + compress (prod only)

**Generator** (`tools/generator/`): `npm run generate` — scaffold component/view/service with boilerplate.

---

## Type System

**`src/core/internals.d.ts`** — Framework-level types and EventMap:
```typescript
interface EventMap extends FrameworkEventMap, AppEventMap {}
```

**`src/app/globals.d.ts`** — App-level types:
```typescript
interface AppEventMap { 'my-event': MyPayloadType }
type ProjectFolderName = 'project-a' | 'project-b';
type TechSvgKey = 'typescript' | 'react' | ...;
```

Add new global event types to `AppEventMap` — they become type-safe everywhere.

---

## App Init Sequence (`src/app/main.ts`)

```typescript
document.addEventListener('DOMContentLoaded', async () => {
  registerPipes();              // register built-in + custom pipes
  const router = AppRouter(routes);
  new NavbarComponent(navEl).render();
  new FooterComponent(footerEl).render();
  await I18nService.getInstance().initTranslations();
  router.init();                // start routing
});

window.addEventListener('beforeunload', () => Service.destroyAll());
```

---

## Conventions

- **Imports**: Relative imports with `.js` extension. Use the highest-level barrel files only (GOOD: `import { Component } from '../../core/index.js'`; BAD: `import { Component } from '../../core/base-classes/component/component.js'`).
- **Naming**: `HomeView` → selector `home-view`; `ProjectCardComponent` → selector `project-card-component`
- **One class per file**, filename matches class name in kebab-case
- **Services are singletons** — never `new MyService()`, always `MyService.getInstance()`. Services generated by the generator don't export the class, only the `getInstance()` const, in camel case (Example: `class MyCustomService extends Service<MyCustomService>{} export const myCustomService = MyCustomService.getInstance();`)
- **Templates return pure HTML strings** — no side effects in templateFn
- **No inline styles in templates** — everything via CSS classes. *Note: inline styles are supported, but aren't recommended.*
- **i18n keys** follow dot notation: `"section.key"`
- **Route 404** must always be defined as `'/404'`
