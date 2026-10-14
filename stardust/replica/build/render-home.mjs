// Render the VA.gov home-page prototype from its captured composed-tree page
// (stardust/current/pages/index.flat.html — live Playwright render, shadow roots inlined).
// Content is carried verbatim; markup is re-authored (never the live DOM).
// usage: node stardust/replica/build/render-home.mjs [--json]   → stardust/prototypes/index-proposed.html
import * as cheerio from 'cheerio';
import fs from 'node:fs';

const ROOT = new URL('../../../', import.meta.url).pathname;
const $ = cheerio.load(fs.readFileSync(`${ROOT}stardust/current/pages/index.flat.html`, 'utf8'));
const page = JSON.parse(fs.readFileSync(`${ROOT}stardust/current/pages/index.json`, 'utf8'));
const icons = JSON.parse(fs.readFileSync(`${ROOT}stardust/current/assets/media/icons.json`, 'utf8'));
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const txt = (el) => $(el).text().replace(/\s+/g, ' ').trim();
const svg = (i) => icons[i].html.replace(/ (class|aria-hidden|aria-labelledby|role|focusable|id)="[^"]*"/g, '').replace(/<title[^>]*>.*?<\/title>/, '').replace('<svg', '<svg aria-hidden="true"');
const ICON = { close: svg(18), arrow: svg(19), search: svg(21), chevron: svg(4) };
// hub icons in page order: health care, disability, education, careers, pension, housing,
// life insurance, burials, records, service members, family, department
const HUB_ICONS = [2, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32].map(svg);

function inline(el) {
  return $(el).contents().map((i, n) => {
    if (n.type === 'text') return esc(n.data.replace(/\s+/g, ' '));
    if (n.type !== 'tag') return '';
    const t = n.tagName;
    if (t === 'a') return `<a href="${attr($(n).attr('href') || '')}">${inline(n).trim()}</a>`;
    if (t === 'strong' || t === 'b') return `<strong>${inline(n)}</strong>`;
    if (t === 'em' || t === 'i') return `<em>${inline(n)}</em>`;
    if (t === 'br') return '<br>';
    if (t === 'va-icon' || t === 'svg') return '';
    return inline(n);
  }).get().join('');
}

// ---- model ----
const main = $('main#content');
const banner = $('va-banner').first();
const hero = main.find('.homepage-hero__wrapper');
const heroCard = hero.find('.va-flex').first();
const tasks = main.find('[class*="JEykya__wrapper"]');
const blog = main.find('.homepage-blog');
const explore = main.find('section').first();
const email = main.find('.homepage-email-update-wrapper');
const model = {
  title: page.title,
  description: page.description,
  banner: {
    heading: txt(banner.find('h3').clone().find('.usa-sr-only').remove().end()),
    paras: banner.find('.usa-alert__body p').map((i, p) => inline(p).trim()).get(),
  },
  hero: {
    eyebrow: txt(hero.find('h1')),
    heading: txt(hero.find('h2').first()),
    text: inline(hero.find('p').first()).trim(),
    action: { href: hero.find('va-link-action a').attr('href'), text: txt(hero.find('va-link-action .link-text')) },
    card: {
      heading: txt(heroCard.find('h2')),
      button: txt(heroCard.find('button')),
      link: { href: heroCard.find('va-link a').attr('href'), text: txt(heroCard.find('va-link a')) },
    },
  },
  search: {
    heading: txt(tasks.find('#search-tools-header')),
    label: txt(tasks.find('form label')),
    button: txt(tasks.find('.usa-search__submit-text')),
    toolsHeading: txt(tasks.find('h3').first()),
    tools: tasks.find('.homepage-common-tasks__search-tools li a').map((i, a) => ({ href: $(a).attr('href'), text: txt($(a).find('.link-text')) })).get(),
  },
  top: {
    heading: txt(tasks.find('[class*="columnRight"] h2')),
    links: tasks.find('.homepage-common-tasks__list li a').map((i, a) => ({ href: $(a).attr('href'), text: txt(a) })).get(),
  },
  news: {
    img: { alt: blog.find('img').attr('alt') || '' },
    eyebrow: txt(blog.find('h2')),
    heading: txt(blog.find('h3')),
    text: inline(blog.find('p').first()).trim(),
    more: { href: blog.find('p').last().find('a').attr('href'), text: txt(blog.find('p').last().find('a')) },
  },
  explore: {
    heading: txt(explore.find('h2').first()),
    hubs: explore.find('h3').map((i, h) => ({
      key: (($(h).find('va-icon').attr('class') || '').match(/background-color--(hub-[a-z-]+|primary-darker)/) || [])[1] || 'primary-darker',
      href: $(h).find('a').attr('href'), text: txt($(h).find('a')), desc: inline($(h).next('p')).trim(),
    })).get(),
  },
  feedback: txt(main.find('#mdFormButton button')),
  signup: {
    heading: txt(email.find('#form-question')),
    label: txt(email.find('#input-label').clone().find('span').remove().end()),
    required: txt(email.find('.usa-label--required')),
    button: txt(email.find('va-button button')),
    portraitsAlt: email.find('picture img').attr('alt') || 'Veteran portraits',
  },
};
if (process.argv.includes('--json')) { console.log(JSON.stringify(model, null, 1)); process.exit(0); }

// ---- render ----
const m = model;
const actionLink = (l, cls) => `<a class="action-link ${cls}" href="${attr(l.href)}"><span class="action-link__icon">${ICON.arrow}</span><span>${esc(l.text)}</span></a>`;
const body = `<section class="site-alert" aria-label="Information banner" id="site-alert">
<div class="site-alert__body"><svg class="site-alert__icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg><div class="site-alert__content">
<h3 class="site-alert__heading"><span class="sr-only">Information Alert </span>${esc(m.banner.heading)}</h3>
${m.banner.paras.map((p) => `<p>${p}</p>`).join('\n')}
</div></div>
<button type="button" class="site-alert__close" aria-label="Close Information Alert ${attr(m.banner.heading)} notification">${ICON.close}</button>
</section>
<main id="content">
<div class="home-hero"><div class="home-container"><div class="home-row">
<div class="home-col"><div class="home-hero__lead">
<h1 class="home-hero__eyebrow">${esc(m.hero.eyebrow)}</h1>
<h2 class="home-hero__heading">${esc(m.hero.heading)}</h2>
<p>${m.hero.text}</p>
${actionLink(m.hero.action, 'action-link--reverse')}
</div></div>
<div class="home-col home-hero__aside"><div class="home-hero__card">
<h2>${esc(m.hero.card.heading)}</h2>
<button type="button" class="btn-primary">${esc(m.hero.card.button)}</button>
<p><a href="${attr(m.hero.card.link.href)}">${esc(m.hero.card.link.text)}</a></p>
</div></div>
</div></div></div>
<div class="home-tasks"><div class="home-container"><div class="home-row">
<div class="home-col home-tasks__left"><div class="home-tasks__inner">
<h2 id="search-tools-header">${esc(m.search.heading)}</h2>
<form class="home-search" role="search" action="/search/" method="get">
<label class="sr-only" for="search-field">${esc(m.search.label)}</label>
<input id="search-field" name="query" type="search" autocomplete="off">
<button type="submit"><span class="home-search__text">${esc(m.search.button)}</span>${ICON.search.replace('<svg', '<svg class="home-search__icon"')}</button>
</form>
<h3>${esc(m.search.toolsHeading)}</h3>
<ul class="action-list">
${m.search.tools.map((l) => `<li>${actionLink(l, 'action-link--secondary')}</li>`).join('\n')}
</ul>
</div></div>
<div class="home-col home-tasks__right"><div class="home-tasks__inner">
<h2>${esc(m.top.heading)}</h2>
<ul class="top-pages">
${m.top.links.map((l) => `<li><a href="${attr(l.href)}">${esc(l.text)}</a></li>`).join('\n')}
</ul>
</div></div>
</div></div></div>
<div class="home-news"><div class="home-news__inner">
<div class="home-news__image"><img src="assets/img/Health-and-benefits-distro-graphics_sq.jpg" alt="${attr(m.news.img.alt)}"></div>
<div class="home-news__text">
<h2>${esc(m.news.eyebrow)}</h2>
<h3>${esc(m.news.heading)}</h3>
<p class="home-news__lede">${m.news.text}</p>
<p><a class="home-news__more" href="${attr(m.news.more.href)}">${esc(m.news.more.text)}${ICON.chevron}</a></p>
</div>
</div></div>
<section class="home-explore">
<h2>${esc(m.explore.heading)}</h2>
${[0, 3, 6, 9].map((s) => `<div class="home-explore__row">
${m.explore.hubs.slice(s, s + 3).map((h) => `<div class="home-explore__col">
<h3><span class="hub-icon hub-icon--${h.key.replace(/^hub-/, '')}">${HUB_ICONS[m.explore.hubs.indexOf(h)]}</span><a href="${attr(h.href)}">${esc(h.text)}</a></h3>
<p>${h.desc}</p>
</div>`).join('\n')}
</div>`).join('\n')}
</section>
<div class="home-container"><div class="last-updated home-feedback"><div class="home-feedback__row"><button type="button" class="btn-outline">${esc(m.feedback)}</button></div></div></div>
<div class="home-signup">
<form class="home-signup__form" id="email-signup-form" action="https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify" method="post">
<h2 id="form-question">${esc(m.signup.heading)}</h2>
<label for="inputField">${esc(m.signup.label)}<span class="required"> ${esc(m.signup.required)}</span></label>
<input id="inputField" name="email" type="email" required>
<button type="submit" class="btn-primary">${esc(m.signup.button)}</button>
</form>
<div class="home-signup__portraits"><div class="portraits"><picture>
<source srcset="assets/img/veterans-banner-mobile-1.png 640w, assets/img/veterans-banner-mobile-2.png 920w" media="(max-width: 767px)">
<source srcset="assets/img/veterans-banner-tablet-1.png 1008w, assets/img/veterans-banner-tablet-2.png 1887w" media="(max-width: 1008px)">
<img src="assets/img/veterans-banner-desktop-1.png" srcset="assets/img/veterans-banner-desktop-1.png 1280w, assets/img/veterans-banner-desktop-2.png 2494w" alt="${attr(m.signup.portraitsAlt)}" width="1280" height="161">
</picture></div></div>
</div>
</main>`;

const header = fs.readFileSync(`${ROOT}stardust/replica/build/partials/header.html`, 'utf8');
const footer = fs.readFileSync(`${ROOT}stardust/replica/build/partials/footer.html`, 'utf8');
const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(m.title)}</title>
<meta name="description" content="${attr(m.description || '')}">
<link rel="icon" href="assets/favicon.ico">
<link rel="stylesheet" href="assets/canon.css">
<link rel="stylesheet" href="assets/home.css">
</head>
<body>
${header}
${body}
${footer}
<script src="assets/chrome.js"></script>
<script src="assets/home.js"></script>
</body>
</html>
`;
fs.writeFileSync(`${ROOT}stardust/prototypes/index-proposed.html`, html);
console.log(`render-home: index → stardust/prototypes/index-proposed.html (tools ${m.search.tools.length}, top ${m.top.links.length}, hubs ${m.explore.hubs.length})`);
