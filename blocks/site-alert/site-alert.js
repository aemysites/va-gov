/**
 * Site alert (information banner) — template-slotted. Authored: the alert heading and its
 * body paragraph(s); every authored element is moved, in order, into the content slot.
 * The info icon and the close control are presentational and built here.
 * @ew-exempt "Information Alert" (sr-only heading prefix) and the close button's
 * aria-label are UI labels of the source va-banner, not authored copy.
 * @param {Element} block the site-alert block
 */
const INFO_ICON = '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 '
  + '15h-2v-6h2v6zm0-8h-2V7h2v2z"/>';
const CLOSE_ICON = '<path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 '
  + '13.41 17.59 19 19 17.59 13.41 12z"/>';

function svg(className, paths) {
  const ns = 'http://www.w3.org/2000/svg';
  const el = document.createElementNS(ns, 'svg');
  el.setAttribute('viewBox', '0 0 24 24');
  el.setAttribute('aria-hidden', 'true');
  if (className) el.setAttribute('class', className);
  el.innerHTML = paths;
  return el;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .site-alert-body')) return;
  const body = document.createElement('div');
  body.className = 'site-alert-body';
  const content = document.createElement('div');
  content.className = 'site-alert-content';
  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => content.append(el));
  const heading = content.querySelector('h2, h3, h4');
  if (heading) {
    const prefix = document.createElement('span');
    prefix.className = 'sr-only';
    prefix.textContent = 'Information Alert';
    heading.before(prefix);
  }
  body.append(svg('site-alert-icon', INFO_ICON), content);

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'site-alert-close';
  close.setAttribute('aria-label', 'Close Information Alert notification');
  close.append(svg('', CLOSE_ICON));
  close.addEventListener('click', () => {
    block.hidden = true;
  });

  block.setAttribute('role', 'region');
  block.setAttribute('aria-label', 'Information banner');
  block.replaceChildren(body, close);
}
