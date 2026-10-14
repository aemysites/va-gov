/**
 * Home tasks — template-slotted two-column band. Authored: one row, two cells — the search
 * cell (heading, sub-heading, list of search tools) and the top-pages cell (heading, list).
 * Authored elements are moved, in order, into their column; each list is moved into a
 * wrapper that carries its paint. The site-search form (not authored) is placed after the
 * search cell's first heading; it submits to the source site search (dynamic-features.md,
 * chrome-search interim tier).
 * @ew-exempt "Search VA.gov" (sr-only input label) and "Search" (submit label) are UI labels.
 * @param {Element} block the home-tasks block
 */
const SEARCH_ACTION = 'https://www.va.gov/search/';
const SEARCH_ICON = '<path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 '
  + '16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 '
  + '9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>';

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function searchForm() {
  const form = document.createElement('form');
  form.className = 'home-tasks-search';
  form.action = SEARCH_ACTION;
  form.method = 'get';
  form.setAttribute('role', 'search');
  const label = document.createElement('label');
  label.className = 'sr-only';
  label.htmlFor = 'home-search-field';
  label.textContent = 'Search VA.gov';
  const input = document.createElement('input');
  input.id = 'home-search-field';
  input.name = 'query';
  input.type = 'search';
  const button = document.createElement('button');
  button.type = 'submit';
  const text = document.createElement('span');
  text.className = 'home-tasks-search-text';
  text.textContent = 'Search';
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('class', 'home-tasks-search-icon');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('aria-hidden', 'true');
  icon.innerHTML = SEARCH_ICON;
  button.append(text, icon);
  form.append(label, input, button);
  return form;
}

export default function decorate(block) {
  if (block.querySelector(':scope > .home-tasks-container')) return;
  const container = div('home-tasks-container');
  const row = div('home-tasks-row');
  const cells = [...block.querySelectorAll(':scope > div > div')];
  cells.forEach((cell, i) => {
    const col = div(`home-tasks-col ${i === 0 ? 'home-tasks-left' : 'home-tasks-right'}`);
    const inner = div('home-tasks-inner');
    [...cell.children].forEach((el) => {
      if (el.tagName === 'UL' || el.tagName === 'OL') {
        const list = div(i === 0 ? 'home-tasks-actions' : 'home-tasks-top');
        list.append(el);
        inner.append(list);
      } else {
        inner.append(el);
      }
    });
    if (i === 0) {
      const first = inner.querySelector(':scope > h2, :scope > h3');
      if (first) first.after(searchForm());
      else inner.prepend(searchForm());
    }
    col.append(inner);
    row.append(col);
  });
  container.append(row);
  block.replaceChildren(container);
}
