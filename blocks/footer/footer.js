import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * VA.gov footer — template-slotted chrome (decode tier: template-slotted).
 * Reads the authored /footer document and MOVES its elements into the gated prototype's footer:
 * desktop link columns, language row, VA logo, bottom links; below 768 the columns become
 * accordions. Sections are classified by content:
 *   crisis  — a paragraph without links (mobile crisis-line trigger)
 *   columns — sections with h2 + lists (all but the last heading section)
 *   lang    — the last heading section (Language assistance)
 *   banner  — the home link (logo; its label stays as visually-hidden text)
 *   bottom  — a bare list (legal links)
 * Desktop owns the authored elements; the accordions are presentational clones (EW4).
 * A list item without a link in the columns becomes a crisis-line button (its nodes move).
 * @ew-exempt <ul> accordion copies of the column lists — presentational clones (EW4)
 */

const ICONS = `${window.hlx?.codeBasePath || ''}/icons`;
const ARROW = '<svg viewBox="7 1 17 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"></path></svg>';

function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null) node.setAttribute(k, v);
  });
  kids.flat().forEach((k) => { if (k) node.append(k); });
  return node;
}

/** Presentational copy: strips Experience Workspace instrumentation and ids (EW4). */
function ghost(node) {
  if (!node) return null;
  const copy = node.cloneNode(true);
  [copy, ...copy.querySelectorAll('*')].forEach((n) => {
    n.removeAttribute('data-prose-index');
    n.removeAttribute('data-image-index');
    n.removeAttribute('id');
  });
  return copy;
}

function isHome(a) {
  try {
    const u = new URL(a.getAttribute('href'), window.location);
    return u.pathname === '/' && (u.origin === window.location.origin || a.getAttribute('href') === '/');
  } catch {
    return false;
  }
}

function readSections(fragment) {
  return [...fragment.querySelectorAll(':scope > .section')].map((section) => {
    const items = [];
    section.querySelectorAll(':scope > .default-content-wrapper').forEach((w) => {
      items.push(...w.children);
    });
    return items;
  }).filter((items) => items.length);
}

/** Splits a column's flat elements into heading + following nodes parts. */
function parts(items) {
  const out = [];
  items.forEach((n) => {
    if (n.matches('h1, h2, h3, h4, h5, h6') || !out.length) out.push({ head: null, nodes: [] });
    const part = out[out.length - 1];
    if (n.matches('h1, h2, h3, h4, h5, h6')) part.head = n;
    else part.nodes.push(n);
  });
  return out;
}

/** List items without a link become crisis-line buttons (authored nodes move inside). */
function crisisButtons(list) {
  list.querySelectorAll(':scope > li').forEach((li) => {
    if (li.querySelector('a')) return;
    const btn = el('button', { type: 'button', class: 'linkbtn crisis-open' });
    btn.append(...li.childNodes);
    li.append(btn);
  });
  list.querySelectorAll('a[href="tel:+1711"]').forEach((a) => a.setAttribute('aria-label', 'TTY: 7 1 1.'));
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);
  if (!fragment) return;

  let crisis = null;
  let banner = null;
  let bottom = null;
  const headed = [];
  readSections(fragment).forEach((items) => {
    const links = items.flatMap((n) => [...n.querySelectorAll('a')]);
    if (items.some((n) => n.matches('h1, h2, h3, h4, h5, h6'))) headed.push(items);
    else if (links.some(isHome)) banner = items;
    else if (!links.length && items.some((n) => n.matches('p'))) crisis = items;
    else bottom = items;
  });
  const lang = headed.length > 1 ? headed.pop() : null;
  const columns = headed.map(parts);

  // desktop columns (own the authored elements)
  const cols = el('div', { class: 'f-cols' }, columns.map((col) => el(
    'div',
    { class: 'f-group' },
    col.map((part, i) => {
      part.nodes.filter((n) => n.matches('ul, ol')).forEach(crisisButtons);
      const cls = ['f-part'];
      if (i > 0) cls.push('f-part-sub');
      if (col.length > 1 && i < col.length - 1) cls.push('f-part-mid');
      return el('div', { class: cls.join(' ') }, part.head, part.nodes);
    }),
  )));

  // mobile accordions (presentational clones)
  const acc = el('ul', { class: 'f-acc' });
  if (crisis) {
    acc.append(el('li', {}, el(
      'div',
      { class: 'f-acc-crisis' },
      el('button', { type: 'button', class: 'crisis-open' }, el('span', {}, crisis)),
    )));
    const arrow = document.createElement('span');
    arrow.innerHTML = ARROW;
    acc.querySelector('.f-acc-crisis button').append(arrow.firstElementChild);
  }
  const accItem = (id, label, nodes, headingWrap = false) => {
    const btn = el('button', {
      type: 'button', class: 'f-acc-btn', 'aria-expanded': 'false', 'aria-controls': id,
    }, label);
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('li').querySelector('.f-acc-panel').classList.toggle('is-open', open);
    });
    const panel = el('div', { class: 'f-acc-panel', id }, nodes);
    return el('li', {}, headingWrap ? el('h2', { class: 'f-acc-h' }, btn) : btn, panel);
  };
  const label = (node) => document.createTextNode(node ? node.textContent : '');
  // the multi-part column (crisis / answers / call / visit) becomes the leading "Contact us" item
  const contactIdx = columns.findIndex((col) => col.length > 1);
  if (contactIdx >= 0) {
    const col = columns[contactIdx];
    const contactLink = col.flatMap((p) => p.nodes)
      .flatMap((n) => [...n.querySelectorAll('a')])
      .find((a) => /contact-us/.test(a.href));
    const nodes = col.filter((p) => !p.nodes.some((n) => n.querySelector('.crisis-open')))
      .flatMap((p) => [ghost(p.head), ...p.nodes.map(ghost)]);
    acc.append(accItem('f-contact', label(contactLink), nodes));
  }
  columns.forEach((col, i) => {
    if (i === contactIdx) return;
    acc.append(accItem(`f-col-${i}`, label(col[0].head), col.flatMap((p) => p.nodes.map(ghost))));
  });

  const langParts = lang ? parts(lang) : [];
  if (langParts.length) {
    const [lp] = langParts;
    acc.append(accItem('f-lang', label(lp.head), lp.nodes.map(ghost), true));
  }

  const langRow = lang ? el('div', { class: 'f-lang' }, lang) : null;
  let bannerRow = null;
  if (banner) {
    const a = banner.flatMap((n) => [...n.querySelectorAll('a')]).find(isHome);
    const sr = el('span', { class: 'sr-only' }, ...a.childNodes);
    a.append(sr, el('img', {
      src: `${ICONS}/va-logo-white.png`, alt: '', width: '200', height: '49', loading: 'lazy',
    }));
    bannerRow = el('div', { class: 'f-banner' }, banner);
  }
  const bottomRow = bottom ? el('div', { class: 'f-bottom' }, bottom) : null;

  const root = el(
    'div',
    { class: 'va-footer' },
    el('div', { class: 'f-inner' }, cols, acc, langRow, bannerRow, bottomRow),
  );
  block.replaceChildren(root);
}
