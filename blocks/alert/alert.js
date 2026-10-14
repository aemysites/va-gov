/**
 * Alert (informational) — template-slotted. Authored: heading, body paragraphs and an
 * optional link paragraph. Everything is moved, in order, into the body wrapper; the info
 * icon is CSS.
 * Variant `additional-info` (collapsed disclosure, as the source's va-additional-info):
 * row 1 = heading (+ lead), row 2 = the toggle text, rows 3+ = the disclosure panel.
 * The toggle paragraph is MOVED into a presentational wrapper; an empty overlay <button>
 * (named by that paragraph via aria-labelledby) toggles the panel — no <summary>/<button>
 * hosts authored text (EW7). With fewer than 3 rows the variant renders like the default.
 * tel: links authored with a title (differing from the link text) get it as their aria-label
 * (DA keeps title, not aria-label).
 * @param {Element} block the alert block
 */
let uid = 0;

function chevron() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS(ns, 'path');
  path.setAttribute('d', 'M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z');
  svg.append(path);
  return svg;
}

function disclosure(rows, body) {
  uid += 1;
  const [lead, trigger, ...panelRows] = rows;
  lead.querySelectorAll(':scope > div > *').forEach((el) => body.append(el));
  const more = document.createElement('div');
  more.className = 'alert-more';
  const toggle = document.createElement('div');
  toggle.className = 'alert-more-toggle';
  const label = document.createElement('div');
  label.className = 'alert-more-label';
  label.id = `alert-more-label-${uid}`;
  trigger.querySelectorAll(':scope > div > *').forEach((el) => label.append(el));
  const panel = document.createElement('div');
  panel.className = 'alert-more-body';
  panel.id = `alert-more-body-${uid}`;
  panelRows.forEach((row) => {
    row.querySelectorAll(':scope > div > *').forEach((el) => panel.append(el));
  });
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'alert-more-button';
  button.setAttribute('aria-labelledby', label.id);
  button.setAttribute('aria-controls', panel.id);
  button.setAttribute('aria-expanded', 'false');
  panel.hidden = true;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    more.classList.toggle('is-open', open);
  });
  toggle.append(label, chevron(), button);
  more.append(toggle, panel);
  body.append(more);
}

export default function decorate(block) {
  if (block.querySelector(':scope > .alert-body')) return;
  const body = document.createElement('div');
  body.className = 'alert-body';
  const rows = [...block.children];
  if (block.classList.contains('additional-info') && rows.length >= 3) {
    disclosure(rows, body);
  } else {
    [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => body.append(el));
  }
  // decorateButtons() copies link text into title; only an authored, differing title is a label
  body.querySelectorAll('a[href^="tel:"][title]').forEach((a) => {
    if (a.title === a.textContent) return;
    a.setAttribute('aria-label', a.title);
    a.removeAttribute('title');
  });
  block.setAttribute('role', 'region');
  const heading = body.querySelector('h2, h3, h4');
  if (heading && heading.id) block.setAttribute('aria-labelledby', heading.id);
  block.replaceChildren(body);
}
