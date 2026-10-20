import 'a11y-elements/components/anchor';
import 'a11y-elements/components/focusable';
import 'a11y-elements/components/picture';
import 'a11y-elements/overlays/modal';
import 'a11y-elements/overlays/snackbar';
import { AppRouter, initI18n, registerGlobals, registerPipes } from '../core/index.js';
import { FooterComponent } from './components/global/footer/footer.component.js';
import { NavbarComponent } from './components/global/navbar/navbar.component.js';
import { appRoutes } from './routes.js';

class App {
  constructor() {
    registerPipes();
    registerGlobals({
      before: [{ component: NavbarComponent, id: 'navbar' }],
      after: [{ component: FooterComponent, id: 'site-footer' }],
    });
    AppRouter(appRoutes);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initI18n();
  new App();
});
