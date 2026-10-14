/**
 * News promo — template-slotted. Authored: one row with an image cell and a text cell
 * (label heading, story heading, lede paragraph(s) and a link-only "more" paragraph).
 * Cells are classified by content (picture/img = media); text elements are moved, in
 * order, into the text slot; paragraphs are grouped into the lede or the "more" wrapper by
 * content (a paragraph that is only a link is the "more" link).
 * @param {Element} block the news-promo block
 */
function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function linkOnly(el) {
  const a = el.tagName === 'P' && el.querySelector('a');
  return Boolean(a) && el.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > .news-promo-inner')) return;
  const inner = div('news-promo-inner');
  const media = div('news-promo-image');
  const text = div('news-promo-text');
  let lede = null;
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => {
    const isMedia = el.matches('picture, img')
      || (el.tagName === 'P' && el.querySelector('picture, img') && !el.textContent.trim());
    if (isMedia) {
      media.append(el);
    } else if (el.tagName === 'P' && linkOnly(el)) {
      const more = div('news-promo-more');
      more.append(el);
      text.append(more);
      lede = null;
    } else if (el.tagName === 'P') {
      if (!lede) {
        lede = div('news-promo-lede');
        text.append(lede);
      }
      lede.append(el);
    } else {
      text.append(el);
      lede = null;
    }
  });
  if (media.children.length) inner.append(media);
  inner.append(text);
  block.replaceChildren(inner);
}
