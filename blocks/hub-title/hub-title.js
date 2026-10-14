/**
 * Hub title — template-slotted. Authored rows (any order): an icon paragraph
 * (`:hub-<name>:`), the page <h1>, and the intro paragraph(s).
 * The icon and the <h1> are moved into the title row; every other authored
 * element is moved, in order, into the intro wrapper.
 * @param {Element} block the hub-title block
 */
export default function decorate(block) {
  if (block.querySelector('.hub-title-row')) return;
  const row = document.createElement('div');
  row.className = 'hub-title-row';
  const iconWrap = document.createElement('div');
  iconWrap.className = 'hub-icon-wrap';
  const intro = document.createElement('div');
  intro.className = 'hub-intro';

  const elements = [...block.querySelectorAll(':scope > div > div > *')];
  elements.forEach((el) => {
    if (el.querySelector('.icon') && !el.textContent.replace(/\s/g, '')) {
      iconWrap.append(el);
    } else if (el.tagName === 'H1') {
      row.append(el);
    } else {
      intro.append(el);
    }
  });
  if (iconWrap.children.length) row.prepend(iconWrap);
  block.replaceChildren(row);
  if (intro.children.length) block.append(intro);
}
