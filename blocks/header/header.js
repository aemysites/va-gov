import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/*
 * VA.gov header — template-slotted chrome (decode tier: template-slotted).
 * Reads the authored /nav document and MOVES its elements into the gated prototype's header DOM
 * (gov banner, crisis line + modal, logo row with search / contact / sign in, mega menu,
 * mobile header + drawer). Sections are classified by content, not by index:
 *   banner  — paragraphs only (desktop line, toggle label, mobile line, two explanations)
 *   crisis  — has tel:/sms: links (trigger line, modal h3, intro, list, resources line)
 *   tools   — has the home link (logo label, Search, Contact us, Sign in, Menu)
 *   mega    — has an h2 (panel title); h4 present = hub panel, else column panel
 *   links   — a bare list (top-level links: Find a VA Location, My VA, My HealtheVet)
 * The desktop tree owns every authored element; the mobile header and drawer are presentational
 * clones with Experience Workspace instrumentation stripped (EW4). Panel titles (h2) and hub
 * titles (h3) move into their trigger buttons; mobile drill-down views are built from clones.
 * @ew-exempt <p> mobile-only clones of banner/crisis/sign-in — presentational copies (EW4)
 */

const ICON = {
  chevron: '<svg viewBox="6 6 12 12" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59L12 13.17L7.41 8.59L6 10L12 16L18 10L16.59 8.59Z"></path></svg>',
  arrow: '<svg viewBox="7 1 17 17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"></path></svg>',
  va: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.6 35.2" role="img"><title>VA</title><g fill="#FFF"><path d="M11.1 35.2L0 0h8.6l4.2 14.9c1.2 4.2 2.2 8.2 3.1 12.6h.1c.9-4.2 1.9-8.4 3.1-12.4L23.5 0h8.3L20.2 35.2h-9.1zM36.6 26.2l-2.5 9h-8L36.6 0h10.2l10.8 35.2h-8.5l-2.7-9h-9.8zm8.8-6l-2.2-7.5c-.6-2.1-1.2-4.7-1.7-6.8h-.1c-.5 2.1-1 4.8-1.6 6.8l-2 7.5h7.6z"></path></g></svg>',
  menu: '<svg viewBox="1 2 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" d="M4 17V15H22V17H4ZM4 12V10H22V12H4ZM4 7V5H22V7H4Z"></path></svg>',
  search: '<svg viewBox="2 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"></path></svg>',
  x: '<svg viewBox="3 3 16 16" width="15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" fill-rule="evenodd" clip-rule="evenodd" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"></path></svg>',
  plus: '<svg viewBox="0 2 20 20" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="i-plus"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"></path></svg>',
  minus: '<svg viewBox="0 2 20 20" width="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="i-minus"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M19 13H5V11H19V13Z"></path></svg>',
  chevronRight: '<svg viewBox="-1 2 17 17" width="22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" fill-rule="evenodd" clip-rule="evenodd" d="M9.99997 6L8.58997 7.41L13.17 12L8.58997 16.59L9.99997 18L16 12L9.99997 6Z"></path></svg>',
  back: '<svg viewBox="8 5 13 13" width="17" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" fill-rule="evenodd" clip-rule="evenodd" d="M14 6L15.41 7.41L10.83 12L15.41 16.59L14 18L8.00003 12L14 6Z"></path></svg>',
  searchSubmit: '<svg viewBox="2 0 20 22" width="18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#fff" fill-rule="evenodd" clip-rule="evenodd" d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"></path></svg>',
  allLink: '<svg class="all-link-arrow" width="11" height="11" viewBox="0 0 444.819 444.819" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path fill="#004795" d="M352.025 196.712L165.885 10.848C159.028 3.615 150.468 0 140.185 0s-18.84 3.62-25.696 10.848l-21.7 21.416c-7.045 7.043-10.567 15.604-10.567 25.692 0 9.897 3.52 18.56 10.566 25.98L231.544 222.41 92.785 361.168c-7.04 7.043-10.563 15.604-10.563 25.693 0 9.9 3.52 18.566 10.564 25.98l21.7 21.417c7.043 7.043 15.612 10.564 25.697 10.564 10.09 0 18.656-3.52 25.697-10.564L352.025 248.39c7.046-7.423 10.57-16.084 10.57-25.98.002-10.09-3.524-18.655-10.57-25.698z"></path></svg>',
  close: '<svg viewBox="2 2 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="#005ea2" d="m8.4 17 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L17 8.4 15.6 7 12 10.6 8.4 7 7 8.4l3.6 3.6L7 15.6 8.4 17Zm3.6 5a10.1 10.1 0 0 1-9.21-6.1A9.74 9.74 0 0 1 2 12a10.1 10.1 0 0 1 6.1-9.21A9.74 9.74 0 0 1 12 2a10.1 10.1 0 0 1 9.21 6.1c.53 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9a10.1 10.1 0 0 1-5.31 5.31A9.74 9.74 0 0 1 12 22Z"></path></svg>',
};
const ICONS = `${window.hlx?.codeBasePath || ''}/icons`;
const SEARCH_ACTION = 'https://www.va.gov/search/';

/** Creates an element with attributes and children (nodes or generated UI strings). */
function el(tag, attrs = {}, ...kids) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== false) node.setAttribute(k, v === true ? '' : v);
  });
  kids.flat().forEach((k) => { if (k) node.append(k); });
  return node;
}

/** A static (non-authored) SVG icon. */
function svg(name) {
  const span = document.createElement('span');
  span.innerHTML = ICON[name];
  return span.firstElementChild;
}

function img(file, alt = '', cls = undefined) {
  return el('img', {
    src: `${ICONS}/${file}`, alt, class: cls, loading: 'lazy',
  });
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

/** Text of a node as a detached text node (for generated clone labels only). */
function ghostText(node) {
  return document.createTextNode(node ? node.textContent : '');
}

/** True for a link to the site root (relative or absolute same-origin). */
function isHome(a) {
  try {
    const u = new URL(a.getAttribute('href'), window.location);
    return u.pathname === '/' && (u.origin === window.location.origin || a.getAttribute('href') === '/');
  } catch {
    return false;
  }
}

function toggle(btn, panel, force) {
  const open = force !== undefined ? force : btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', String(open));
  if (panel) panel.classList.toggle('is-open', open);
  return open;
}

/** All authored elements of the fragment, grouped per section (metadata excluded). */
function readSections(fragment) {
  return [...fragment.querySelectorAll(':scope > .section')].map((section) => {
    const items = [];
    section.querySelectorAll(':scope > div').forEach((wrap) => {
      if (wrap.classList.contains('default-content-wrapper')) items.push(...wrap.children);
    });
    return items;
  }).filter((items) => items.length);
}

function classify(sections) {
  const roles = { mega: [] };
  sections.forEach((items) => {
    const has = (sel) => items.some((n) => n.matches(sel) || n.querySelector(sel));
    if (has('a[href^="tel:"], a[href^="sms:"]')) roles.crisis = items;
    else if (items.some((n) => n.matches('h2'))) roles.mega.push(items);
    else if (items.some((n) => [...n.querySelectorAll('a')].some(isHome))) roles.tools = items;
    else if (items.every((n) => n.matches('ul, ol'))) roles.links = items;
    else if (!roles.banner) roles.banner = items;
  });
  return roles;
}

function buildBanner(items = []) {
  const plain = items.filter((n) => n.matches('p') && !n.querySelector('strong'));
  const notes = items.filter((n) => n.matches('p') && n.querySelector('strong'));
  const [deskLine, toggleLabel, mobileLine] = plain;
  const icons = [['icon-dot-gov.svg', 'Dot gov'], ['icon-https.svg', 'SSL']];
  const content = (id, nodes) => el(
    'div',
    { class: 'gov-banner-content', id },
    nodes.map((p, i) => el('div', {}, img(icons[i % 2][0], icons[i % 2][1]), p)),
  );
  const mobile = [
    el(
      'div',
      { class: 'm-banner' },
      img('tiny-usa-flag.png', 'U.S. flag'),
      el(
        'button',
        {
          type: 'button', class: 'gov-toggle', 'aria-expanded': 'false', 'aria-controls': 'gov-banner-m',
        },
        mobileLine || ghost(deskLine),
        svg('chevron'),
      ),
    ),
    // the mobile banner carries its own authored copy (typographic apostrophes on the source)
    content('gov-banner-m', notes.length > 2 ? notes.slice(2, 4) : notes.map(ghost)),
  ];
  // desktop: the explanation opens inside the grey banner row, as on the source
  const desktop = el(
    'div',
    { class: 'd-banner-row' },
    el(
      'div',
      { class: 'd-banner' },
      img('tiny-usa-flag.png', 'U.S. flag'),
      deskLine,
      el(
        'button',
        {
          type: 'button', class: 'gov-toggle', 'aria-expanded': 'false', 'aria-controls': 'gov-banner-d',
        },
        el('span', {}, toggleLabel),
      ),
    ),
    content('gov-banner-d', notes.slice(0, 2)),
  );
  return { mobile, desktop };
}

function buildCrisis(items = []) {
  const trigger = items.find((n) => n.matches('p') && !n.querySelector('a'));
  const rest = items.filter((n) => n !== trigger);
  const heading = rest.find((n) => n.matches('h1, h2, h3, h4, h5, h6'));
  if (heading) heading.id = 'crisis-title';
  const mobile = el(
    'div',
    { class: 'm-crisis' },
    el('button', { type: 'button', class: 'crisis-open' }, el('span', {}, ghost(trigger)), svg('arrow')),
  );
  const button = el(
    'button',
    { type: 'button', class: 'd-crisis crisis-open' },
    el(
      'span',
      { class: 'd-crisis-inner' },
      el('span', { class: 'd-crisis-icon' }),
      el('span', { class: 'd-crisis-text' }, trigger),
      img('arrow-right-white.svg', '', 'd-crisis-arrow'),
    ),
  );
  // anchored below the banner row: the tab moves down when the gov banner opens (source)
  const desktop = el('div', { class: 'd-crisis-anchor' }, button);
  const close = el(
    'button',
    { type: 'button', class: 'crisis-modal-close', 'aria-label': 'Close this modal' },
    svg('close'),
  );
  const modal = el(
    'div',
    {
      class: 'crisis-modal', id: 'crisis-modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'crisis-title',
    },
    el('div', { class: 'crisis-modal-inner' }, close, el('div', { class: 'crisis-modal-body' }, rest)),
  );
  return {
    mobile, desktop, modal, close,
  };
}

/** A search form: label + input + submit, submitting to the source site search (interim). */
function searchForm(id, label, cls) {
  const input = el('input', {
    id, type: 'text', name: 'query', autocomplete: 'off',
  });
  const submit = el(
    'button',
    { type: 'submit', class: `${cls}-submit` },
    svg('searchSubmit'),
    el('span', { class: 'sr-only' }, ghostText(label)),
  );
  return el(
    'form',
    {
      class: cls, action: SEARCH_ACTION, method: 'get', role: 'search',
    },
    el('div', { class: `${cls}-field` }, input),
    submit,
  );
}

function buildTools(items = []) {
  const paras = items.filter((n) => n.matches('p'));
  const logoP = paras.find((p) => [...p.querySelectorAll('a')].some(isHome));
  const linkPs = paras.filter((p) => p !== logoP && p.querySelector('a'));
  const labels = paras.filter((p) => !p.querySelector('a'));
  const [searchLabel, menuLabel] = labels;
  const signInP = linkPs.find((p) => /sign-in/.test(p.querySelector('a').href)) || linkPs[linkPs.length - 1];
  const contactP = linkPs.find((p) => p !== signInP);

  // logo: the authored link is the logo; its label moves into a visually-hidden span
  const logoA = logoP ? [...logoP.querySelectorAll('a')].find(isHome) : el('a', { href: '/' });
  const logoLabel = el('span', { class: 'sr-only' }, ...logoA.childNodes);
  logoA.classList.add('d-logo');
  logoA.append(logoLabel, img('header-logo.png', ''));
  if (contactP) contactP.querySelector('a').classList.add('d-contact');
  if (signInP) {
    const a = signInP.querySelector('a');
    a.className = 'btn-primary';
    signInP.className = '';
  }

  const searchBtn = el(
    'button',
    {
      type: 'button', class: 'd-search-btn', 'aria-expanded': 'false', 'aria-controls': 'd-search',
    },
    el('span', {}, svg('search'), searchLabel),
  );
  const searchPanel = el(
    'div',
    { class: 'd-search-panel', id: 'd-search' },
    el('label', { class: 'sr-only', for: 'd-search-input' }, ghostText(searchLabel)),
    searchForm('d-search-input', searchLabel, 'd-search-form'),
  );
  const searchWrap = el('div', { class: 'd-search-wrap' }, searchBtn, searchPanel);

  const menuBtn = el(
    'button',
    {
      type: 'button', class: 'm-menu-btn', 'aria-expanded': 'false', 'aria-controls': 'm-drawer',
    },
    el('span', { class: 'm-menu-open' }, menuLabel, svg('menu')),
    el('span', { class: 'm-menu-close' }, 'Close', svg('x')),
  );
  const mobileSignIn = signInP ? ghost(signInP.querySelector('a')) : null;
  const mLogo = el('a', { class: 'm-logo', href: logoA.getAttribute('href'), 'aria-label': 'VA logo' }, svg('va'));
  const mobile = el(
    'div',
    { class: 'm-logo-row' },
    mLogo,
    el('div', { class: 'm-actions' }, mobileSignIn, menuBtn),
  );
  const desktop = el(
    'div',
    { class: 'd-logo-row' },
    el(
      'div',
      { class: 'd-logo-row-inner' },
      logoP || logoA,
      el('div', { class: 'd-toolbar' }, searchWrap, contactP, signInP),
    ),
  );
  return {
    mobile, desktop, searchBtn, searchPanel, menuBtn, contactP, searchLabel,
  };
}

const isMedia = (n) => n.matches('picture, img') || !!n.querySelector('picture, img');
const isLinkP = (n) => n.matches('p') && !!n.querySelector('a') && !isMedia(n);

/**
 * Splits a mega section. Hub panels (h4 present): per h3 hub a see-all paragraph, h4 + list
 * columns and a promo (media, link, text); a list after a promo is the panel's own link list.
 * Column panels: h3 + list groups, then one panel promo.
 */
function parseMega(items) {
  const title = items.find((n) => n.matches('h2'));
  const isHub = items.some((n) => n.matches('h4'));
  const groups = [];
  const extras = [];
  const panelPromo = [];
  let g = null;
  let col = null;
  items.forEach((n) => {
    if (n === title) return;
    if (n.matches('h3')) {
      g = {
        head: n, seeAll: null, columns: [], promo: [],
      };
      col = null;
      groups.push(g);
      return;
    }
    if (!g) {
      extras.push(n);
      return;
    }
    if (isHub) {
      if (n.matches('h4')) {
        col = [n];
        g.columns.push(col);
      } else if (n.matches('ul, ol') && col && col.length === 1) {
        col.push(n);
      } else if (n.matches('ul, ol')) {
        extras.push(n);
      } else if (!g.columns.length && !g.seeAll && isLinkP(n)) {
        g.seeAll = n;
      } else {
        g.promo.push(n);
      }
    } else if (n.matches('ul, ol') && !panelPromo.length) {
      g.columns.push([...(g.columns.pop() || [g.head]), n]);
    } else {
      panelPromo.push(n);
    }
  });
  return {
    title, isHub, groups, extras, promo: panelPromo,
  };
}

/** Promo card: media, then a text box with the link and the description. */
function promoCard(nodes, cls) {
  if (!nodes.length) return null;
  const media = nodes.filter(isMedia);
  const text = nodes.filter((n) => !isMedia(n));
  media.forEach((m) => m.querySelectorAll('img').forEach((i) => i.classList.add('mm-promo-img')));
  return el(
    'div',
    { class: `mm-marketing-container ${cls}` },
    media,
    el('div', { class: 'mm-marketing-text' }, text),
  );
}

const COLS = ['column-one', 'column-two', 'column-three'];

function buildMegaPanel(mega, idx, onHub) {
  const panel = el('div', { class: 'vetnav-panel', id: `vetnav-panel-${idx}` });
  if (mega.isHub) {
    const hubs = el('ul', { class: 'vetnav-hubs' });
    mega.groups.forEach((g, i) => {
      const btn = el(
        'button',
        {
          type: 'button', class: 'vetnav-level2', 'aria-expanded': 'false', 'aria-controls': `vetnav-hub-${idx}-${i}`,
        },
        g.head,
      );
      const arrow = svg('allLink');
      if (g.seeAll) g.seeAll.querySelector('a').append(arrow);
      const body = el(
        'div',
        { class: 'vetnav-hub', id: `vetnav-hub-${idx}-${i}` },
        g.seeAll ? el('div', { class: 'panel-bottom-link' }, g.seeAll) : null,
        g.columns.map((c, ci) => el('div', { class: `vetnav-column ${COLS[ci] || ''}` }, c)),
        el('div', { class: 'vetnav-column column-three' }, promoCard(g.promo, 'mm-marketing-white')),
      );
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        onHub(panel, btn, body);
      });
      hubs.append(el('li', { class: 'mm-link-container' }, btn, body));
    });
    panel.append(hubs, ...mega.extras.map((x) => {
      x.classList.add('vetnav-extras');
      return x;
    }));
  } else {
    panel.classList.add('vetnav-columns');
    const names = ['main-column', ...COLS];
    mega.groups.forEach((g, i) => {
      panel.append(el('div', { class: `vetnav-column ${names[i] || ''}` }, g.columns.flat()));
    });
    panel.append(el(
      'div',
      { class: 'vetnav-column column-three' },
      promoCard(mega.promo, 'mm-marketing-gray'),
      mega.extras,
    ));
  }
  return panel;
}

/** Mobile drawer (< 768): search, accordion menus with drill-down views, links. */
function buildDrawer(megas, linksList, tools) {
  const drawer = el('nav', { class: 'm-drawer', id: 'm-drawer', 'aria-label': 'Menu' });
  const main = el('div', { class: 'm-drawer-main' });
  const drill = el('div', { class: 'm-drill', hidden: true });
  const label = tools.searchLabel;
  main.append(
    el('label', { class: 'm-search-label', for: 'm-search-input' }, ghostText(label)),
    searchForm('m-search-input', label, 'm-search-form'),
  );
  const list = el('ul', { class: 'm-nav' });
  let lastDrill = null;
  const openDrill = (btn, links) => {
    const back = el('button', { type: 'button', class: 'm-back' }, svg('back'), 'Back to menu');
    back.addEventListener('click', () => {
      drill.hidden = true;
      drill.replaceChildren();
      main.hidden = false;
      if (lastDrill) lastDrill.focus();
    });
    drill.replaceChildren(el(
      'ul',
      {},
      el('li', { class: 'm-back-item' }, back),
      links.map((a) => el('li', { class: 'm-link' }, ghost(a))),
    ));
    lastDrill = btn;
    main.hidden = true;
    drill.hidden = false;
    back.focus();
  };
  megas.forEach((mega, i) => {
    const sub = el('ul', { class: 'm-acc-panel', id: `m-acc-${i}`, hidden: true });
    const btn = el(
      'button',
      {
        type: 'button', class: 'm-acc-btn', 'aria-expanded': 'false', 'aria-controls': `m-acc-${i}`,
      },
      el('span', {}, ghostText(mega.title)),
      svg('plus'),
      svg('minus'),
    );
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      sub.hidden = !open;
    });
    mega.groups.forEach((g) => {
      const scope = mega.isHub ? [g.seeAll, ...g.columns.flat()] : g.columns.flat();
      const links = scope.filter(Boolean).flatMap((n) => [...n.querySelectorAll('a')]);
      const hubBtn = el('button', { type: 'button', class: 'm-hub' }, el('span', {}, ghostText(g.head)), svg('chevronRight'));
      hubBtn.addEventListener('click', () => openDrill(hubBtn, links));
      sub.append(el('li', {}, hubBtn));
    });
    mega.extras.forEach((x) => x.querySelectorAll('a').forEach((a) => sub.append(el('li', { class: 'm-sub-link' }, ghost(a)))));
    list.append(el('li', { class: 'm-acc' }, btn, sub));
  });
  const direct = linksList ? [...linksList.querySelectorAll('a')] : [];
  if (tools.contactP) direct.push(tools.contactP.querySelector('a'));
  direct.forEach((a) => list.append(el('li', { class: 'm-link' }, ghost(a))));
  main.append(list);
  drawer.append(main, drill);
  return drawer;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  if (!fragment) return;
  const roles = classify(readSections(fragment));

  const banner = buildBanner(roles.banner);
  const crisis = buildCrisis(roles.crisis);
  const tools = buildTools(roles.tools);
  const megas = roles.mega.map(parseMega);
  const linksList = roles.links ? roles.links.find((n) => n.matches('ul, ol')) : null;
  const drawer = buildDrawer(megas, linksList, tools);

  // desktop primary nav: each trigger owns its panel (Tab moves from the trigger into it)
  const navList = el('ul', { class: 'd-nav-list' });
  const triggers = [];
  const panels = [];
  const selectHub = (panel, btn, body) => {
    panel.querySelectorAll('.vetnav-level2').forEach((b) => b.setAttribute('aria-expanded', String(b === btn)));
    panel.querySelectorAll('.vetnav-hub').forEach((h) => h.classList.toggle('is-open', h === body));
    panel.classList.add('is-expanded');
  };
  megas.forEach((mega, i) => {
    const trigger = el(
      'button',
      {
        type: 'button', class: 'lvl1', 'aria-expanded': 'false', 'aria-controls': `vetnav-panel-${i}`,
      },
      mega.title,
    );
    const panel = buildMegaPanel(mega, i, selectHub);
    triggers.push(trigger);
    panels.push(panel);
    navList.append(el('li', { class: 'd-nav-item' }, trigger, panel));
  });
  if (linksList) {
    linksList.querySelectorAll(':scope > li').forEach((li, i) => {
      if (i === 1) li.classList.add('push');
    });
    navList.append(el('li', { class: 'd-nav-links' }, linksList));
  }

  const root = el(
    'div',
    { class: 'va-header' },
    el('a', { class: 'skip-link', href: '#content' }, 'Skip to Content'),
    el(
      'div',
      { class: 'va-header-mobile' },
      banner.mobile,
      crisis.mobile,
      tools.mobile,
      drawer,
    ),
    el(
      'div',
      { class: 'va-header-desktop' },
      el('div', { class: 'd-top' }, banner.desktop, crisis.desktop),
      tools.desktop,
      el(
        'div',
        { class: 'd-nav-wrap' },
        el('div', { class: 'd-menu-rule' }),
        el('nav', { class: 'd-nav', 'aria-label': 'Primary' }, navList),
      ),
    ),
    crisis.modal,
  );
  block.replaceChildren(root);
  const main = document.querySelector('main');
  if (main && !document.getElementById('content')) main.id = 'content';

  // behaviour (from the header contract)
  root.querySelectorAll('.gov-toggle').forEach((b) => b.addEventListener('click', () => {
    toggle(b, document.getElementById(b.getAttribute('aria-controls')));
  }));
  // desktop disclosure closes on a click outside the banner row (source; not on mobile)
  const deskToggle = root.querySelector('.d-banner .gov-toggle');
  document.addEventListener('click', (e) => {
    if (!deskToggle || e.target.closest('.d-banner-row')) return;
    if (deskToggle.getAttribute('aria-expanded') === 'true') {
      toggle(deskToggle, document.getElementById(deskToggle.getAttribute('aria-controls')), false);
    }
  });

  const { modal } = crisis;
  let lastFocus = null;
  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };
  document.addEventListener('click', (e) => {
    const opener = e.target.closest('.crisis-open');
    if (!opener) return;
    lastFocus = opener;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    crisis.close.focus();
  });
  crisis.close.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const { searchBtn, searchPanel } = tools;
  const closePanel = (t) => {
    const panel = panels[triggers.indexOf(t)];
    toggle(t, panel, false);
    panel.classList.remove('is-expanded');
    panel.querySelectorAll('.vetnav-level2').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    panel.querySelectorAll('.vetnav-hub').forEach((h) => h.classList.remove('is-open'));
  };
  const closeAll = (except) => {
    triggers.forEach((t) => { if (t !== except) closePanel(t); });
    if (except !== searchBtn) toggle(searchBtn, searchPanel, false);
  };
  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAll(searchBtn);
    if (toggle(searchBtn, searchPanel)) searchPanel.querySelector('input').focus();
  });
  triggers.forEach((t) => t.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAll(t);
    if (t.getAttribute('aria-expanded') === 'true') closePanel(t);
    else {
      toggle(t, panels[triggers.indexOf(t)], true);
      panels[triggers.indexOf(t)].querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
    }
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = triggers.find((t) => t.getAttribute('aria-expanded') === 'true');
    closeAll();
    if (open) open.focus();
    if (modal.classList.contains('is-open')) closeModal();
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.d-nav') && !e.target.closest('.d-search-wrap')) closeAll();
  });
  tools.menuBtn.addEventListener('click', () => toggle(tools.menuBtn, drawer));
}
