// Inner markup of each project's card icon: 24×24 line icons, stroked with the current
// theme's primary color (see project-card.component.scss)
export const projectIcons: Record<ProjectFolderName, string> = {
  // a nut
  'nutin': '<path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z"/><circle cx="12" cy="12" r="3"/>',
  // accessibility figure
  'a11y-elements': '<circle cx="12" cy="4.5" r="1.5"/><path d="M5 8l7 1.5L19 8"/><path d="M12 9.5V14l-3 6"/><path d="M12 14l3 6"/>',
  // ticket
  'paris-2024': '<path d="M15 5v2M15 11v2M15 17v2"/><path d="M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2"/>',
  // gamepad
  'retro-cabinet': '<path d="M6 11h4M8 9v4"/><path d="M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.98 3.6L2.1 14.4A3 3 0 0 0 5.1 18c1 0 1.9-.5 2.4-1.3L9 15h6l1.5 1.7c.5.8 1.4 1.3 2.4 1.3a3 3 0 0 0 3-3.6l-.6-5.8A4 4 0 0 0 17.3 5z"/>',
  // sticky note
  'notelet': '<path d="M5 3h14a2 2 0 0 1 2 2v9l-7 7H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 21v-5a2 2 0 0 1 2-2h5"/><path d="M7 8h8M7 12h5"/>',
  // painter's palette
  'narrative-palettes': '<path d="M12 21a9 9 0 0 1 0-18c4.97 0 9 3.58 9 8 0 1.06-.47 2.08-1.32 2.83A4.5 4.5 0 0 1 16.5 15H14a2 2 0 0 0-1 3.75A1.3 1.3 0 0 1 12 21"/><circle cx="7.5" cy="10.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="16.5" cy="10.5" r="1"/>',
  // server rack
  'self-hosting': '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  // loop arrows
  'ci-cd': '<path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.5"/><path d="M20 4v4.5h-4.5"/><path d="M20 12a8 8 0 0 1-13.66 5.66L4 15.5"/><path d="M4 20v-4.5h4.5"/>',
  // envelope
  'mailer': '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
};
