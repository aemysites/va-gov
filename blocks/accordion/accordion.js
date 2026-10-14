/**
 * Accordion (hub rail "Ask questions" / "Connect with us") — reconstructive. Each row is one
 * item: the row's heading is the item title, every other authored element is the panel.
 * The authored heading is moved into the item head and its text nodes into a label span; an
 * empty overlay <button> inside the heading (named by the label via aria-labelledby, as the
 * source's heading > button) toggles the panel. Items start expanded, as on the source.
 * @ew-exempt "Expand all" / "Collapse all" are UI control labels, not authored content.
 * @param {Element} block the accordion block
 */
const ICONS = {
  plus: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
  minus: 'M19 13H5v-2h14v2z',
};

let uid = 0;

function svgIcon(d) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', d);
  svg.append(path);
  return svg;
}

function setOpen(item, open) {
  const toggle = item.querySelector('.acc-toggle');
  const panel = item.querySelector('.acc-panel');
  toggle.setAttribute('aria-expanded', String(open));
  panel.hidden = !open;
  item.classList.toggle('is-closed', !open);
}

function toolButton(label, aria, icon, open, block) {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', aria);
  btn.append(svgIcon(icon), document.createTextNode(label));
  btn.addEventListener('click', () => {
    block.querySelectorAll('.acc-item').forEach((item) => setOpen(item, open));
  });
  li.append(btn);
  return li;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .acc-item')) return;
  const items = [];
  [...block.children].forEach((row) => {
    const elements = [...row.querySelectorAll(':scope > div > *')];
    if (!elements.length) return;
    uid += 1;
    const item = document.createElement('div');
    item.className = 'acc-item';
    const head = document.createElement('div');
    head.className = 'acc-head';
    const panel = document.createElement('div');
    panel.className = 'acc-panel';
    panel.id = `acc-panel-${uid}`;
    const heading = elements.find((el) => /^H[1-6]$/.test(el.tagName));
    const label = document.createElement('span');
    label.className = 'acc-label';
    label.id = `acc-label-${uid}`;
    if (heading) {
      label.append(...heading.childNodes);
      heading.append(label);
      head.append(heading);
    }
    elements.filter((el) => el !== heading).forEach((el) => panel.append(el));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'acc-toggle';
    toggle.setAttribute('aria-controls', panel.id);
    toggle.setAttribute('aria-labelledby', label.id);
    toggle.addEventListener('click', () => {
      setOpen(item, toggle.getAttribute('aria-expanded') !== 'true');
    });
    (heading || head).append(toggle);
    item.append(head, panel);
    setOpen(item, true);
    items.push(item);
  });

  const tools = document.createElement('ul');
  tools.className = 'acc-tools';
  tools.append(
    toolButton('Expand all', 'Expand all accordions', ICONS.plus, true, block),
    toolButton('Collapse all', 'Collapse all accordions', ICONS.minus, false, block),
  );
  block.replaceChildren(tools, ...items);
}
