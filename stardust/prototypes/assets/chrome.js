// VA.gov replica chrome behaviour: gov banner disclosure, crisis-line modal, desktop mega menu
// (click-opened, per the header contract), header search panel, mobile drawer, footer accordions.
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const toggle = (btn, panel, force) => {
    const open = force !== undefined ? force : btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open));
    if (panel) panel.classList.toggle('is-open', open);
    return open;
  };

  $$('.gov-toggle').forEach((b) => b.addEventListener('click', () => toggle(b, document.getElementById(b.getAttribute('aria-controls')))));

  const modal = $('#crisis-modal');
  let lastFocus = null;
  const closeModal = () => { modal.classList.remove('is-open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
  $$('.crisis-open').forEach((b) => b.addEventListener('click', () => {
    lastFocus = b; modal.classList.add('is-open'); document.body.style.overflow = 'hidden'; $('.crisis-modal__close', modal).focus();
  }));
  $('.crisis-modal__close', modal).addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  const searchBtn = $('.d-search-btn');
  const searchPanel = $('#d-search');
  searchBtn.addEventListener('click', () => { if (toggle(searchBtn, searchPanel)) $('input', searchPanel).focus(); });

  const closeAll = (except) => {
    $$('.d-nav .lvl1[aria-expanded]').forEach((b) => { if (b !== except) toggle(b, $(`#panel-${b.dataset.panel}`), false); });
    if (except !== searchBtn) toggle(searchBtn, searchPanel, false);
  };
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeAll(); if (modal.classList.contains('is-open')) closeModal(); } });
  document.addEventListener('click', (e) => { if (!e.target.closest('.va-header__desktop')) closeAll(); });

  const link = (l) => `<li><a href="${l.href}">${l.text}</a></li>`;
  fetch(new URL('megamenu.json', document.currentScript ? document.currentScript.src : $('script[src*="chrome.js"]').src))
    .then((r) => r.json()).then((m) => {
      const hubBtns = m.benefits.hubs.map((h, i) => `<li><button type="button" aria-expanded="${i === 0}" data-hub="${i}">${h.title}</button></li>`).join('');
      const hubPanels = m.benefits.hubs.map((h, i) => {
        const half = Math.ceil(h.links.length / 2);
        return `<div class="d-panel__hub${i === 0 ? ' is-open' : ''}" data-hub="${i}"><div><h3>${h.headings[0] || ''}</h3><ul>${h.links.slice(0, half).map(link).join('')}</ul></div><div><h3>${h.headings[1] || ''}</h3><ul>${h.links.slice(half).map(link).join('')}</ul></div></div>`;
      }).join('');
      $('#panel-benefits').innerHTML = `<div class="d-panel__hubs"><ul>${hubBtns}</ul><ul>${m.benefits.footerLinks.map(link).join('')}</ul></div>${hubPanels}`;
      $$('#panel-benefits .d-panel__hubs button').forEach((b) => b.addEventListener('click', () => {
        $$('#panel-benefits .d-panel__hubs button').forEach((o) => o.setAttribute('aria-expanded', String(o === b)));
        $$('#panel-benefits .d-panel__hub').forEach((p) => p.classList.toggle('is-open', p.dataset.hub === b.dataset.hub));
      }));
      const per = Math.ceil(m.about.links.length / 3);
      $('#panel-about').innerHTML = m.about.headings.map((h, i) => `<div class="d-panel__col"><h3>${h}</h3><ul>${m.about.links.slice(i * per, (i + 1) * per).map(link).join('')}</ul></div>`).join('');

      const drawer = $('#m-drawer');
      drawer.innerHTML = `<ul>
        <li class="m-drawer__item"><a href="/">Home</a></li>
        <li class="m-drawer__item"><button type="button" data-sub="b">${m.benefits.title}</button></li>
        <li class="m-drawer__item"><button type="button" data-sub="a">${m.about.title}</button></li>
        <li class="m-drawer__item"><a href="https://www.va.gov/find-locations/">Find a VA Location</a></li>
        <li class="m-drawer__item"><a href="https://www.va.gov/contact-us/">Contact us</a></li></ul>
        <div class="m-drawer__panel" data-sub="b"><button type="button" class="m-drawer__back">Back to menu</button>${m.benefits.hubs.map((h) => `<h3>${h.title}</h3>${h.links.map((l) => `<a href="${l.href}">${l.text}</a>`).join('')}`).join('')}</div>
        <div class="m-drawer__panel" data-sub="a"><button type="button" class="m-drawer__back">Back to menu</button>${m.about.links.map((l) => `<a href="${l.href}">${l.text}</a>`).join('')}</div>`;
      $$('[data-sub]', drawer).forEach((b) => b.tagName === 'BUTTON' && b.addEventListener('click', () => {
        $('ul', drawer).hidden = true; $(`.m-drawer__panel[data-sub="${b.dataset.sub}"]`, drawer).classList.add('is-open');
      }));
      $$('.m-drawer__back', drawer).forEach((b) => b.addEventListener('click', () => {
        $$('.m-drawer__panel', drawer).forEach((p) => p.classList.remove('is-open')); $('ul', drawer).hidden = false;
      }));
    }).catch(() => {});

  $$('.d-nav .lvl1[data-panel]').forEach((b) => b.addEventListener('click', (e) => {
    e.stopPropagation(); closeAll(b); toggle(b, $(`#panel-${b.dataset.panel}`));
  }));
  const menuBtn = $('.m-menu-btn');
  menuBtn.addEventListener('click', () => toggle(menuBtn, $('#m-drawer')));
  $$('.f-acc-btn').forEach((b) => b.addEventListener('click', () => toggle(b, document.getElementById(b.getAttribute('aria-controls')))));
}());
