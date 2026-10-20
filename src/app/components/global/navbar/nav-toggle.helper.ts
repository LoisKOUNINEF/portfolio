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
  // Where the current section is read, as a share of the viewport height from the top:
  // `start` until the last screen of scroll, sliding to `end` at the bottom of the page
  private static readonly _highlightLine = { start: 0.25, end: 0.5 };
  // A clicked link's href, kept highlighted until the user scrolls themselves (see holdHighlight)
  private static _heldHref: string | null = null;
  // Inputs that mean the user is scrolling (or interacting) on their own
  private static readonly _userScrollEvents = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

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

  // Highlights the link of the section a reference line is in, or of the last section above
  // it: content between linked sections (e.g. Featured, after Home) belongs to the link
  // before it. The line sits at the top quarter of the viewport, so that a short section
  // (About) jumped to from its link is the one highlighted. Over the last screen of scroll
  // it slides down to the middle: the last section (Contact) can't scroll up to the top
  // quarter, but gets highlighted once it fills the end of the page. At the very bottom
  // (2px tolerance: zoomed pages scroll by fractions), the last link regardless.
  public static highlightCurrent(): void {
    const { anchors } = this.getDomElements();
    if (this._heldHref !== null) {
      this.setActive(anchors, anchors.find(anchor => anchor.getAttribute('href') === this._heldHref));
      return;
    }
    const sections = anchors
      .map(anchor => ({ anchor, el: document.getElementById(anchor.getAttribute('href')?.slice(1) ?? '') }))
      .filter((section): section is { anchor: HTMLAnchorElement; el: HTMLElement } => section.el !== null);
    if (!sections.length) return;

    const viewport = window.innerHeight;
    const remaining = Math.max(0, document.documentElement.scrollHeight - viewport - window.scrollY);
    const endProgress = viewport > 0 ? Math.max(0, 1 - remaining / viewport) : 0;
    const { start, end } = this._highlightLine;
    const y = window.scrollY + viewport * (start + (end - start) * endProgress);
    const current = remaining <= 2
      ? sections.at(-1)!
      : [...sections].reverse().find(({ el }) => el.getBoundingClientRect().top + window.scrollY <= y) ?? sections[0]!;

    this.setActive(anchors, current.anchor);
  }

  private static setActive(anchors: Element[], active: Element | undefined): void {
    if (!active) return;
    anchors.forEach((anchor: Element) => anchor.classList.toggle(this._toggleClasses.active, anchor === active));
  }

  // The clicked link stays highlighted until the user scrolls themselves: its section may
  // never reach the reference line (end of the page, very tall screens), and the smooth
  // scroll to it passes through other sections
  private static holdHighlight(anchor: HTMLAnchorElement): void {
    this._heldHref = anchor.getAttribute('href');
    this.highlightCurrent();
    const release = (): void => {
      this._heldHref = null;
      this._userScrollEvents.forEach(type => window.removeEventListener(type, release));
    };
    this._userScrollEvents.forEach(type => window.addEventListener(type, release, { passive: true }));
  }

  public static setupAnchorListeners(): void {
    const { navbar, navAnchorsContainer } = this.getDomElements();
        
    navAnchorsContainer?.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor && anchor.hasAttribute('href') && anchor.getAttribute('href')?.startsWith('#')) {
        this.handleAnchorClick(navbar, navAnchorsContainer);
        this.holdHighlight(anchor);
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