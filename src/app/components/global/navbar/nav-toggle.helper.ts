export interface INavDomElements {
  navbar: HTMLElement | null;
  anchors: Element[];
  toggler: Element | null | undefined;
  navAnchorsContainer: Element | null;
}

export interface INavToggleClasses {
  open: string,
  hidden: string,
  active: string
}

export class NavToggleHelper {
  private static readonly _label = 'nav-toggle';
  private static readonly _toggleClasses: INavToggleClasses = {
    open: 'open',
    hidden: 'hidden',
    active: 'active'
  };
  private static _lastScrollY = window.scrollY;
  private static _clickJustOccurred = false;
  private static _clickTimeout: number | null = null; 

  public static get label(): string {
    return this._label;
  }

  public static get toggleClasses(): INavToggleClasses {
    return this._toggleClasses;
  }

  public static toggleNav(): void {
    const { navAnchorsContainer, toggler } = this.getDomElements();
    if (!navAnchorsContainer || !toggler) return;
    toggler.classList.toggle(this._toggleClasses.open);
    navAnchorsContainer.classList.toggle(this._toggleClasses.open);
  }

	public static hideOnScrollDown(): void {
    if (this._clickJustOccurred) return;
    const { navbar, navAnchorsContainer } = this.getDomElements();
    const current = window.scrollY;

    if (current > this._lastScrollY && current > 100) {
      this.hideNav(navbar, navAnchorsContainer);
    } else {
      navbar?.classList.remove(this._toggleClasses.hidden);
    }
    this._lastScrollY = current;
  }

  public static highlightCurrent(): void {
    const { anchors } = this.getDomElements();
    const sections = anchors.map(anchor => {
      const id = anchor.getAttribute('href')?.replace('#', '');
      return { anchor, el: document.getElementById(id!) };
    });

    const y = window.scrollY + window.innerHeight / 2;

    sections.forEach(({ anchor, el }) => {
      const top = el?.offsetTop;
      const bottom = top! + el?.offsetHeight!;

      if (y >= top! && y < bottom) {
        anchors.forEach((el: Element) => el.classList.remove(this._toggleClasses.active));
        anchor.classList.add(this._toggleClasses.active);
      }
    });
  }

  public static setupAnchorListeners(): void {
    const { navbar, navAnchorsContainer } = this.getDomElements();
        
    navAnchorsContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hasAttribute('href') && anchor.getAttribute('href')?.startsWith('#')) {
        this.handleAnchorClick(navbar, navAnchorsContainer)
      }
    });
  }

  private static getDomElements(): INavDomElements {
    const navbar = document.getElementById('navbar');
    const navAnchorsContainer = document.getElementById('navbar-anchors');
    const anchors = Array.from(navAnchorsContainer!.querySelectorAll('div span a'));
    const toggler = document.querySelector(`label[for="${this._label}"]`)?.firstElementChild;
    return { navbar, anchors, toggler, navAnchorsContainer };
  }

  private static hideNav(
    navbar: INavDomElements["navbar"], 
    navAnchorsContainer: INavDomElements["navAnchorsContainer"]
  ): void {
    navbar?.classList.add(this._toggleClasses.hidden);
    if (navAnchorsContainer?.classList.contains(this._toggleClasses.open)) {
      this.toggleNav();
    }
  }

  private static handleAnchorClick(
    navbar: INavDomElements["navbar"], 
    navAnchorsContainer: INavDomElements["navAnchorsContainer"]
  ) {
    this._clickJustOccurred = true;
    if (this._clickTimeout) {
      clearTimeout(this._clickTimeout);
    }

    this._clickTimeout = setTimeout(() => {
      this._clickJustOccurred = false;
      this._clickTimeout = null;
    }, 1000) as unknown as number;

    this.hideNav(navbar, navAnchorsContainer);
  }
}