import { Service } from '../../../../core/index.js';

export class ThemeTogglerService extends Service<ThemeTogglerService> {
  private _isLightTheme: boolean;
  private readonly _lightTheme = 'light';
  private readonly _darkTheme = 'dark';
  private readonly _localStorageName = 'preferred-theme';

  constructor() {
    super();
    this._isLightTheme = this.lightTheme();
    // No transition on load: the page would fade from the default theme
    this.initTheme(false);
  }

  public get isLightTheme(): boolean {
    return this._isLightTheme;
  }

  public toggleTheme(): void {
    this._isLightTheme = !this._isLightTheme;
    this.savePreferences();
    this.initTheme();
  }

  public initTheme(transition = true) {
    const theme = this._isLightTheme ? this._lightTheme : this._darkTheme;
    document.body.classList.remove('light-theme', 'dark-theme', 'theme-transition');
    document.body.classList.add(`${theme}-theme`);
    if (transition) document.body.classList.add('theme-transition');
  }

  private lightTheme(): boolean {
    return this.getThemeFromStorage() === this._lightTheme;
  }

  private savePreferences() {
    const pref = this._isLightTheme ? this._lightTheme : this._darkTheme;
    // Storage can be blocked (privacy settings): the choice then lasts for this page only
    try {
      localStorage.setItem(this._localStorageName, pref);
    } catch { /* not persisted */ }
  }

  private getThemeFromStorage(): string {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(this._localStorageName);
    } catch { /* blocked storage: fall back to the system preference */ }
    return stored || this.getSystemPreference();
  }

  private getSystemPreference(): string {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? this._darkTheme
      : this._lightTheme;
  }

}

export const themeTogglerService = ThemeTogglerService.getInstance();
