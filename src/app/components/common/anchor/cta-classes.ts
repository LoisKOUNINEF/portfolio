// Classes for an AnchorComponent styled as a call-to-action button.
// They target the <a> inside <a11y-anchor> (display: contents, so the links are the flex items)
export const ctaClass = 'block no-underline py-small px-large border-2 border-primary rounded-large text-medium font-semibold text-center transition-[background-color,color,transform] duration-fast ease-in-out will-change-transform hover:[transform:translateY(-2px)] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 max-medium:flex-[1_1_calc(50%-0.5rem)] motion-reduce:transition-none motion-reduce:hover:[transform:none]';

export const ctaFilledClass = `${ctaClass} bg-primary text-background hover:bg-transparent hover:text-primary`;

export const ctaOutlineClass = `${ctaClass} bg-transparent text-primary hover:bg-[color-mix(in_srgb,var(--primary),transparent_90%)]`;

// Arrow after the label for links leaving the site; masked so it takes the text color (hover included)
export const ctaExternalClass = "after:content-[''] after:inline-block after:w-[1rem] after:h-[1rem] after:ml-small after:align-[-2px] after:bg-current after:[mask:url(/assets/images/svgs/external/external-link.svg)_center/contain_no-repeat]";
