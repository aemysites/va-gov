// Dump a composed-tree (shadow roots included) box + computed-style outline of a live or served page region.
// usage: node stardust/replica/build/tree.mjs <url> <width> <selector> [--out file] [--depth n]
import { chromium } from 'playwright';
import fs from 'node:fs';
import { newLiveContext, gotoLive, dismissOverlays, isLiveHttpUrl } from '../../scripts/diff/live-session.mjs';

const [url, width, sel] = process.argv.slice(2);
const opt = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = opt('--out'); const depth = +opt('--depth', 30);
const browser = await chromium.launch();
const ctx = await newLiveContext(browser, { viewport: { width: +width, height: 900 } });
const page = await ctx.newPage();
if (isLiveHttpUrl(url)) { await gotoLive(page, url); await dismissOverlays(page); } else await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(1500);
const lines = await page.evaluate(({ sel, depth }) => {
  const res = [];
  const kids = (n) => n.tagName === 'SLOT' ? n.assignedElements() : n.shadowRoot ? [...n.shadowRoot.children] : [...n.children];
  const walk = (el, d) => {
    if (d > depth || ['SCRIPT', 'STYLE', 'LINK', 'PATH', 'G', 'TEMPLATE'].includes(el.tagName.toUpperCase())) return;
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (cs.display === 'none') return;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.data).join('').replace(/\s+/g, ' ').trim().slice(0, 50);
    const cls = typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    const bg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' ? ` bg:${cs.backgroundColor}` : '';
    const bd = cs.borderTopWidth !== '0px' || cs.borderBottomWidth !== '0px' || cs.borderLeftWidth !== '0px' ? ` bd:${cs.borderTopWidth} ${cs.borderRightWidth} ${cs.borderBottomWidth} ${cs.borderLeftWidth} ${cs.borderLeftColor}` : '';
    const rad = cs.borderTopLeftRadius !== '0px' ? ` r:${cs.borderTopLeftRadius}` : '';
    res.push(`${'  '.repeat(d)}${el.tagName.toLowerCase()}${cls} [${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}]${bg} c:${cs.color} f:${cs.fontSize}/${cs.lineHeight} ${cs.fontWeight} ${cs.fontFamily.split(',')[0]} p:${cs.padding} m:${cs.margin}${bd}${rad} "${own}"`);
    kids(el).forEach((c) => walk(c, d + 1));
  };
  document.querySelectorAll(sel).forEach((e) => walk(e, 0));
  return res;
}, { sel, depth });
await browser.close();
const txt = lines.join('\n') + '\n';
if (out) { fs.writeFileSync(out, txt); console.log(`tree: ${lines.length} lines → ${out}`); } else process.stdout.write(txt);
