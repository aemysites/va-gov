// Render a VA.gov benefit-hub prototype from its captured composed-tree page
// (stardust/current/pages/<slug>.flat.html — live Playwright render, shadow roots inlined).
// Content is carried verbatim; markup is re-authored (never the live DOM).
// usage: node stardust/replica/build/render-hub.mjs <slug> [--json]   → stardust/prototypes/<slug>-proposed.html
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const slug = process.argv[2];
if (!slug) { console.error('usage: render-hub.mjs <slug> [--json]'); process.exit(2); }
const ROOT = new URL('../../../', import.meta.url).pathname;
const $ = cheerio.load(fs.readFileSync(`${ROOT}stardust/current/pages/${slug}.flat.html`, 'utf8'));
const page = JSON.parse(fs.readFileSync(`${ROOT}stardust/current/pages/${slug}.json`, 'utf8'));
const icons = JSON.parse(fs.readFileSync(`${ROOT}stardust/current/assets/media/icons.json`, 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const svg = (i) => icons[i].html.replace(/ (class|aria-hidden|role|focusable|id|aria-labelledby)="[^"]*"/g, '').replace('<svg', '<svg aria-hidden="true"');
const ICON = { chevron: svg(4), arrowDown: svg(3), plus: svg(5), minus: svg(6), mail: svg(7), x: svg(8), facebook: svg(9), youtube: svg(10), instagram: svg(11) };
const HUB_SVG = { 'health-care': svg(2) };

// inline content: keep text-level semantics only, links verbatim
function inline(el) {
  return $(el).contents().map((i, n) => {
    if (n.type === 'text') return esc(n.data.replace(/\s+/g, ' '));
    if (n.type !== 'tag') return '';
    const t = n.tagName;
    if (t === 'a') return `<a href="${attr($(n).attr('href') || '')}">${inline(n).trim()}</a>`;
    if (['strong', 'b', 'em', 'i', 'span', 'time', 'va-link', 'abbr'].includes(t)) {
      const inner = inline(n);
      if (t === 'strong' || t === 'b') return `<strong>${inner}</strong>`;
      if (t === 'em' || t === 'i') return `<em>${inner}</em>`;
      return inner;
    }
    // the composed-tree serializer writes <br></br>, which parses as two breaks: keep one
    if (t === 'br') return n.prev && n.prev.type === 'tag' && n.prev.tagName === 'br' ? '' : '<br>';
    if (t === 'va-icon' || t === 'svg') return '';
    return inline(n);
  }).get().join('');
}

// ---- model ----
const art = $('main article').first();
const hubIconCls = ($('main article .hub-icon').attr('class') || '').match(/background-color--hub-([a-z-]+)/);
const model = {
  slug,
  url: page.url,
  title: page.title,
  description: page.description,
  crumbs: $('va-breadcrumbs li').map((i, li) => ({ text: txt($(li).find('a')), href: $(li).find('a').attr('href') })).get(),
  hubKey: hubIconCls ? hubIconCls[1] : null,
  h1: txt(art.find('h1').first()),
  intro: inline(art.find('p.va-introtext').first()).trim(),
  otp: art.find('va-on-this-page nav li a').map((i, a) => ({ href: $(a).attr('href'), text: txt(a) })).get(),
  otpTitle: txt(art.find('va-on-this-page h2').first()) || null,
  alerts: art.children('va-alert').map((i, al) => {
    const h = $(al).find('h2').first();
    const id = h.attr('id') || '';
    h.find('.usa-sr-only').remove();
    return { id, heading: txt(h), paras: $(al).find('.usa-alert__body p').map((j, p) => inline(p).trim()).get() };
  }).get(),
  sections: art.children('div').filter((i, d) => $(d).children('section').length).map((i, d) => {
    const sec = $(d).children('section').first();
    return {
      id: sec.find('h2').first().attr('id') || '',
      heading: txt(sec.find('h2').first()),
      items: sec.find('ul > li').map((j, li) => ({
        href: $(li).find('a').first().attr('href'),
        text: txt($(li).find('a').first()),
        desc: $(li).find('p.va-nav-linkslist-description').length ? inline($(li).find('p.va-nav-linkslist-description').first()).trim() : null,
      })).get(),
    };
  }).get(),
  related: (() => {
    const r = art.children('section.merger-majorlinks').first();
    if (!r.length) return null;
    return {
      id: r.find('h2').first().attr('id') || '',
      heading: txt(r.find('h2').first()),
      items: r.find('ul > li').map((j, li) => ({ href: $(li).find('a').first().attr('href'), text: txt($(li).find('a').first()), desc: $(li).find('p').length ? inline($(li).find('p').first()).trim() : null })).get(),
    };
  })(),
  lastUpdated: txt(art.find('.last-updated time').first()),
  card: (() => {
    const c = $('#hub-rail va-card').first();
    if (!c.length) return null;
    return { img: c.find('img').attr('src'), alt: c.find('img').attr('alt') || '', href: c.find('h2 a').attr('href'), heading: txt(c.find('h2 a')), text: inline(c.find('p').first()).trim() };
  })(),
  accordion: $('#hub-rail va-accordion-item').map((i, it) => {
    const content = $(it).find('.usa-accordion__content').first();
    const blocks = [];
    content.find('h3, ul, > div, section > div').each((j, b) => {
      if (b.tagName === 'h3') blocks.push({ t: 'h3', html: inline(b).trim() });
      else if (b.tagName === 'ul') blocks.push({ t: 'ul', items: $(b).children('li').map((k, li) => ({ html: inline(li).trim(), icon: $(li).find('va-icon').length > 0 })).get() });
      else if ($(b).find('a').length && !$(b).find('ul,h3').length) blocks.push({ t: 'p', html: inline(b).trim(), icon: $(b).find('va-icon').length > 0 });
    });
    return { id: $(it).attr('id') || null, header: txt($(it).find('.va-accordion__header')), blocks };
  }).get(),
  portraits: {
    alt: $('main picture img').attr('alt') || 'Veteran portraits',
  },
};
if (process.argv.includes('--json')) { console.log(JSON.stringify(model, null, 1)); process.exit(0); }

// ---- render ----
const socialIcon = (html) => {
  const t = html.replace(/<[^>]+>/g, '');
  if (/Email/i.test(t)) return ICON.mail;
  if (/Twitter|\bX\b/.test(t)) return ICON.x;
  if (/Facebook/.test(t)) return ICON.facebook;
  if (/YouTube/.test(t)) return ICON.youtube;
  if (/Instagram/.test(t)) return ICON.instagram;
  return '';
};
const li = (it) => `<li><span class="lh"><a href="${attr(it.href)}">${esc(it.text)}${ICON.chevron}</a></span>${it.desc ? `\n<p>${it.desc}</p>` : ''}</li>`;
const lastUpdated = (cls) => `<div class="last-updated ${cls}"><div class="last-updated__row"><div><p>Last updated: <time>${esc(model.lastUpdated)}</time></p></div><div class="fb"><button type="button" class="btn-outline">Feedback</button></div></div></div>`;
const accBlocks = (b) => b.map((x) => {
  if (x.t === 'h3') return `<h3>${x.html}</h3>`;
  if (x.t === 'p') return `<div class="ico-link">${x.icon ? socialIcon(x.html) : ''}${x.html}</div>`;
  return `<ul>${x.items.map((i) => `<li${i.icon ? ' class="ico-link"' : ''}>${i.icon ? socialIcon(i.html) : ''}${i.html}</li>`).join('')}</ul>`;
}).join('\n');

const main = `
<div class="container"><div class="breadcrumbs"><nav aria-label="Breadcrumb"><ol>
${model.crumbs.map((c, i) => `<li class="${i === model.crumbs.length - 1 ? 'current' : ''}"><a href="${attr(i === model.crumbs.length - 1 ? '#content' : c.href)}"${i === model.crumbs.length - 1 ? ' aria-current="page"' : ''}>${esc(c.text)}</a></li>`).join('\n')}
<span class="mobile-back"><a href="${attr(model.crumbs[0].href)}">${esc(model.crumbs[0].text)}</a></span>
</ol></nav></div></div>
<main id="content">
<div class="interior">
<div class="container">
<div class="hub-row">
<article class="hub-main">
<div class="hub-title"><span class="hub-icon-wrap"><span class="hub-icon hub-icon--${model.hubKey}">${HUB_SVG[slug] || ''}</span></span>
<h1>${esc(model.h1)}</h1></div>
<p class="intro">${model.intro}</p>
${model.otp.length ? `<nav class="otp" aria-labelledby="on-this-page"><h2 id="on-this-page">${esc(model.otpTitle || 'On this page')}</h2><ul>
${model.otp.map((o) => `<li><a href="${attr(o.href)}">${ICON.arrowDown}<span>${esc(o.text)}</span></a></li>`).join('\n')}
</ul></nav>` : ''}
${model.alerts.map((a) => `<div class="alert" role="region" aria-labelledby="${a.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg><div class="alert__body">
<h2 id="${a.id}"><span class="sr-only">Information Alert&nbsp;</span>${esc(a.heading)}</h2>
${a.paras.map((p) => `<p>${p}</p>`).join('\n')}
</div></div>`).join('\n')}
${model.sections.map((s) => `<div class="hub-section"><div class="stars-wrap"><div class="stars"></div></div>
<section><h2 id="${s.id}">${esc(s.heading)}</h2>
<ul class="link-list">
${s.items.map(li).join('\n')}
</ul></section></div>`).join('\n')}
${model.related ? `<section class="related"><h2 id="${model.related.id}">${esc(model.related.heading)}</h2>
<ul class="link-list">
${model.related.items.map((it) => `<li><strong><a href="${attr(it.href)}">${esc(it.text)}</a></strong>${it.desc ? `\n<p>${it.desc}</p>` : ''}</li>`).join('\n')}
</ul></section>` : ''}
${lastUpdated('desk')}
</article>
<aside class="hub-rail" id="hub-rail">
${model.card ? `<div class="rail-card"><img src="assets/img/${model.card.img.split('/').pop() === 'health-care.png' ? 'hub-promo-health-care.png' : model.card.img.split('/').pop() === 'housing.png' ? 'hub-promo-housing.png' : model.card.img.split('/').pop() === 'life-insurance.png' ? 'hub-promo-life-insurance.png' : model.card.img.split('/').pop()}" alt="${attr(model.card.alt)}" width="318" height="212" loading="lazy">
<div class="rail-card__body"><h2><a href="${attr(model.card.href)}">${esc(model.card.heading)}</a></h2>
<p>${model.card.text}</p></div></div>` : ''}
<div class="acc" data-acc>
<ul class="acc-tools"><li><button type="button" data-acc-all="open" aria-label="Expand all accordions">${ICON.plus}Expand all</button></li><li><button type="button" data-acc-all="close" aria-label="Collapse all accordions">${ICON.minus}Collapse all</button></li></ul>
${model.accordion.map((a, i) => `<div class="acc-item"${a.id ? ` id="${a.id}"` : ''}><h2><button type="button" class="acc-btn" aria-expanded="true" aria-controls="acc-${i}">${esc(a.header)}</button></h2>
<div class="acc-panel" id="acc-${i}">
${accBlocks(a.blocks)}
</div></div>`).join('\n')}
</div>
</aside>
</div>
${lastUpdated('mob')}
</div>
<div class="portraits"><picture>
<source srcset="assets/img/veterans-banner-mobile-1.png 640w, assets/img/veterans-banner-mobile-2.png 920w" media="(max-width: 767px)">
<source srcset="assets/img/veterans-banner-tablet-1.png 1008w, assets/img/veterans-banner-tablet-2.png 1887w" media="(max-width: 1008px)">
<img src="assets/img/veterans-banner-desktop-1.png" srcset="assets/img/veterans-banner-desktop-1.png 1280w, assets/img/veterans-banner-desktop-2.png 2494w" alt="${attr(model.portraits.alt)}" width="1280" height="161">
</picture></div>
</div>
</main>`;

const header = fs.readFileSync(`${ROOT}stardust/replica/build/partials/header.html`, 'utf8');
const footer = fs.readFileSync(`${ROOT}stardust/replica/build/partials/footer.html`, 'utf8');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(model.title)}</title>
<meta name="description" content="${attr(model.description || '')}">
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="assets/canon.css">
<link rel="stylesheet" href="assets/hub.css">
</head>
<body>
${header}
${main}
${footer}
<script src="assets/chrome.js"></script>
<script src="assets/hub.js"></script>
</body>
</html>
`;
fs.writeFileSync(`${ROOT}stardust/prototypes/${slug}-proposed.html`, html);
console.log(`render-hub: ${slug} → stardust/prototypes/${slug}-proposed.html (${model.sections.length} sections, ${model.sections.reduce((n, s) => n + s.items.length, 0)} links, otp ${model.otp.length}, alerts ${model.alerts.length}, accordion ${model.accordion.length})`);
