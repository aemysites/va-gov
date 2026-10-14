/**
 * Link list (hub teaser list) — reconstructive. Rows are classified by content:
 * a row holding a heading (and no other link) is the list heading; a row holding a link
 * is one item — its first linked paragraph becomes the item title, every other authored
 * element of the row follows it. Rows with neither are kept, in order, with the previous
 * item (or after the heading). Variant `related`: grey box, no star divider, no arrows.
 * @param {Element} block the link-list block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .link-list-body')) return;
  const body = document.createElement('div');
  body.className = 'link-list-body';
  const list = document.createElement('ul');
  list.className = 'link-list-items';
  let lastItem = null;

  [...block.children].forEach((row) => {
    const elements = [...row.querySelectorAll(':scope > div > *')];
    const heading = elements.find((el) => /^H[1-6]$/.test(el.tagName));
    const titleEl = elements.find((el) => el !== heading && el.querySelector('a'));
    if (!titleEl) {
      elements.forEach((el) => (lastItem || body).append(el));
      return;
    }
    const li = document.createElement('li');
    const title = document.createElement('div');
    title.className = 'lh';
    title.append(titleEl);
    li.append(title);
    elements.filter((el) => el !== titleEl).forEach((el) => li.append(el));
    list.append(li);
    lastItem = li;
  });

  if (list.children.length) body.append(list);
  block.replaceChildren(body);
  if (!block.classList.contains('related')) {
    const wrap = document.createElement('div');
    wrap.className = 'stars-wrap';
    const stars = document.createElement('div');
    stars.className = 'stars';
    wrap.append(stars);
    block.prepend(wrap);
  }
}
