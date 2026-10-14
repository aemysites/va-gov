/**
 * Last updated + feedback — template-slotted. Authored rows: the "Last updated" line,
 * then the feedback action label. The first row's elements go to the date slot, every
 * later row's elements to the action slot (painted as the outline button; the survey
 * vendor is not wired — stardust/dynamic-features.md).
 * Variant `action-only` (home page): there is no date row — every row goes to the action
 * slot and no date slot is rendered.
 * @param {Element} block the feedback block
 */
export default function decorate(block) {
  if (block.querySelector(':scope > .last-updated')) return;
  const wrap = document.createElement('div');
  wrap.className = 'last-updated';
  const row = document.createElement('div');
  row.className = 'last-updated-row';
  const date = document.createElement('div');
  date.className = 'last-updated-date';
  const fb = document.createElement('div');
  fb.className = 'fb';
  const action = document.createElement('div');
  action.className = 'btn-outline';
  const actionOnly = block.classList.contains('action-only');
  [...block.children].forEach((r, i) => {
    const slot = i === 0 && !actionOnly ? date : action;
    [...r.querySelectorAll(':scope > div > *')].forEach((el) => slot.append(el));
  });
  if (!actionOnly) row.append(date);
  if (action.children.length) {
    fb.append(action);
    row.append(fb);
  }
  wrap.append(row);
  block.replaceChildren(wrap);
}
