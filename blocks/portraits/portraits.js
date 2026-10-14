/**
 * Portraits banner — template-slotted art direction. Authored: one to three images of the
 * same banner. Each picture is moved into a slot classified by its aspect ratio (widest =
 * desktop, then tablet, then mobile; authored order when sizes are unknown) and CSS shows
 * one slot per breakpoint. A single image is shown at every width.
 * @param {Element} block the portraits block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .portraits-art')) return;
  const pics = [...block.querySelectorAll('picture')];
  const media = pics.length ? pics : [...block.querySelectorAll('img')];
  const ratio = (el) => {
    const img = el.tagName === 'IMG' ? el : el.querySelector('img');
    const w = Number(img && img.getAttribute('width'));
    const h = Number(img && img.getAttribute('height'));
    return w && h ? w / h : 0;
  };
  const ranked = media.map((el, i) => ({ el, i, r: ratio(el) }));
  if (ranked.every((m) => m.r)) ranked.sort((a, b) => b.r - a.r);
  const sets = [['all'], ['desktop', 'mobile'], ['desktop', 'tablet', 'mobile']];
  const names = sets[Math.min(ranked.length, 3) - 1] || sets[0];
  const slots = ranked.map((m, k) => {
    const slot = document.createElement('div');
    slot.className = `portraits-art portraits-${names[Math.min(k, names.length - 1)]}`;
    slot.append(m.el);
    return { slot, i: m.i };
  });
  slots.sort((a, b) => a.i - b.i);
  block.replaceChildren(...slots.map((s) => s.slot));
}
