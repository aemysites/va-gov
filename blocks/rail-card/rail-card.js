/**
 * Rail card (promo) — template-slotted. Authored: an image and a body (heading with link,
 * paragraph). Pictures/images are moved into the media slot, every other authored element
 * into the body slot, in order.
 * @param {Element} block the rail-card block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .rail-card-body')) return;
  const mediaSlot = document.createElement('div');
  mediaSlot.className = 'rail-card-media';
  const body = document.createElement('div');
  body.className = 'rail-card-body';
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => {
    const isMedia = el.tagName === 'PICTURE' || el.tagName === 'IMG'
      || (el.querySelector('picture, img') && !el.textContent.trim());
    (isMedia ? mediaSlot : body).append(el);
  });
  block.replaceChildren();
  if (mediaSlot.children.length) block.append(mediaSlot);
  block.append(body);
}
