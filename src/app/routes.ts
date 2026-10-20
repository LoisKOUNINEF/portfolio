import { HomeView } from './views/home/home.view.js';
import { NotFoundView } from './views/not-found/not-found.view.js';

// URL-only: not linked from the site, kept out of the sitemap (config/seo.json)
const otherThingsView: Nutin.ViewFactory = () =>
  import('./views/other-things/other-things.view.js').then((m) => new m.OtherThingsView());

export const appRoutes: Nutin.Routes = {
  '/': () => new HomeView(),
  '/404': () => new NotFoundView(),
  '/other-things': otherThingsView,
}
