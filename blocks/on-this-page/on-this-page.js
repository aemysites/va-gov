/**
 * On this page — template-slotted. Authored: a heading and a list of in-page links.
 * Every authored element is moved, in order, into a <nav> landmark; the arrow icon is CSS.
 * @param {Element} block the on-this-page block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > nav')) return;
  const nav = document.createElement('nav');
  nav.className = 'otp';
  const elements = [...block.querySelectorAll(':scope > div > div > *')];
  elements.forEach((el) => nav.append(el));
  const heading = nav.querySelector('h2, h3');
  if (heading && heading.id) nav.setAttribute('aria-labelledby', heading.id);
  block.replaceChildren(nav);
}
