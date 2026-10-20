export interface INavDomElements {
  navbar: HTMLElement | null;
  anchors: Element[];
  toggler: Element | null;
  navAnchorsContainer: Element | null;
}

export interface INavToggleClasses {
  open: string,
  hidden: string,
  active: string
}

export class NavToggleHelper {
  private static readonly _toggleClasses: INavToggleClasses = {
    open: 'open',
    hidden: 'hidden',
    active: 'active'
  };
  private static _lastScrollY = window.scrollY;
  private static _clickJustOccurred = false;
  private static _clickTimeout: number | null = null; 
  // Share of the viewport height, from the top, where the current section is read
  private static readonly _highlightLine = 0.25;

  public static get toggleClasses(): INavToggleClasses {
    return this._toggleClasses;
  }

  public static toggleNav(): void {
    const { navAnchorsContainer, toggler } = this.getDomElements();
    if (!navAnchorsContainer || !toggler) return;
    toggler.classList.toggle(this._toggleClasses.open);
    navAnchorsContainer.classList.toggle(this._toggleClasses.open);
    const isOpen = toggler.classList.contains(this._toggleClasses.open);
    toggler.setAttribute('aria-expanded', String(isOpen));
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

  // Highlights the link of the section a line at the top quarter of the viewport is in, or
  // of the last section above it: content between linked sections (e.g. Featured, after
  // Home) belongs to the link before it. Near the top, so that a short section (About)
  // jumped to from its link is the one highlighted. At the very bottom, the last link:
  // its section may never reach the line.
  public static highlightCurrent(): void {
    const { anchors } = this.getDomElements();
    const sections = anchors
      .map(anchor => ({ anchor, el: document.getElementById(anchor.getAttribute('href')?.slice(1) ?? '') }))
      .filter((section): section is { anchor: HTMLAnchorElement; el: HTMLElement } => section.el !== null);
    if (!sections.length) return;

    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
    const y = window.scrollY + window.innerHeight * this._highlightLine;
    const current = atBottom
      ? sections.at(-1)!
      : [...sections].reverse().find(({ el }) => el.getBoundingClientRect().top + window.scrollY <= y) ?? sections[0]!;

    anchors.forEach((anchor: Element) => anchor.classList.toggle(this._toggleClasses.active, anchor === current.anchor));
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
    const navbar = document.getElementById('header');
    const navAnchorsContainer = document.getElementById('navbar-anchors');
    const anchors = Array.from(navAnchorsContainer!.querySelectorAll('a'));
    const toggler = document.querySelector('.navbar__toggle-navbar');
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