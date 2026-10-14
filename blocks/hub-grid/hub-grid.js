/**
 * Hub grid — reconstructive. Authored: a section heading, then one entry per benefit hub
 * (a heading carrying the hub icon `:hub-<name>:` and the hub link, then its description).
 * Elements are classified by content, never by row index: the most frequent heading level
 * segments the entries, a heading of a higher level before the first entry is the band
 * heading, and every other element joins the current entry (leftovers before the first
 * entry stay with the band head).
 * @param {Element} block the hub-grid block
 */
function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .hub-grid-items')) return;
  const elements = [...block.querySelectorAll(':scope > div > div > *')];
  const counts = {};
  elements.filter((el) => /^H[1-6]$/.test(el.tagName))
    .forEach((el) => { counts[el.tagName] = (counts[el.tagName] || 0) + 1; });
  const itemTag = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0] || 'H3';

  const head = div('hub-grid-head');
  const items = div('hub-grid-items');
  let item = null;
  elements.forEach((el) => {
    if (el.tagName === itemTag) {
      item = div('hub-grid-item');
      items.append(item);
      item.append(el);
    } else if (item) {
      item.append(el);
    } else {
      head.append(el);
    }
  });
  block.replaceChildren(...(head.children.length ? [head, items] : [items]));
}
