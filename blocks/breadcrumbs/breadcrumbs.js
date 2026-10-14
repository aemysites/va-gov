/**
 * Breadcrumbs — template-slotted. Authored: one cell holding a list of links, root first,
 * current page last. The list is moved into a labelled <nav>; the last link is marked
 * aria-current. The mobile "back" item is a presentational clone of the parent link
 * (instrumentation stripped), shown below 768px in place of the trail, as on the source.
 * @param {Element} block the breadcrumbs block
 */
function stripInstrumentation(el) {
  [el, ...el.querySelectorAll('*')].forEach((node) => {
    [...node.attributes]
      .filter((attr) => attr.name.startsWith('data-') || attr.name === 'id')
      .forEach((attr) => node.removeAttribute(attr.name));
  });
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > nav')) return;
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Breadcrumb');
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => nav.append(el));
  const list = nav.querySelector('ol, ul');
  if (list) {
    const links = [...list.children]
      .filter((li) => li.tagName === 'LI')
      .map((li) => li.querySelector('a'));
    const current = links[links.length - 1];
    if (current) current.setAttribute('aria-current', 'page');
    const parent = links.length > 1 ? links[links.length - 2] : null;
    if (parent) {
      const back = document.createElement('li');
      back.className = 'mobile-back';
      back.append(stripInstrumentation(parent.cloneNode(true)));
      list.append(back);
    }
  }
  block.replaceChildren(nav);
}
