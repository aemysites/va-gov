/**
 * Home hero — template-slotted. Authored rows (any order): the lead cell (the <h1> eyebrow,
 * the heading, intro paragraph(s) and a link-only "action" paragraph) and the account card
 * cell (prompt heading, a bold CTA paragraph and further paragraphs). The cell holding the
 * <h1> is the lead; link-only paragraphs are classified by content and moved as their <p>.
 * @param {Element} block the home-hero block
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

function boldCta(el) {
  return linkOnly(el) && Boolean(el.querySelector('strong, em, a.button'));
}

export default function decorate(block) {
  if (block.querySelector(':scope > .home-hero-container')) return;
  const container = div('home-hero-container');
  const row = div('home-hero-row');
  const leadCol = div('home-hero-col');
  const lead = div('home-hero-lead');
  const asideCol = div('home-hero-col home-hero-aside');
  const card = div('home-hero-card');

  const cells = [...block.querySelectorAll(':scope > div > div')];
  const leadCell = cells.find((c) => c.querySelector('h1')) || cells[0];
  cells.forEach((cell) => {
    const isLead = cell === leadCell;
    [...cell.children].forEach((el) => {
      if (isLead && linkOnly(el)) {
        const action = div('home-hero-action');
        action.append(el);
        lead.append(action);
      } else if (isLead) {
        lead.append(el);
      } else if (boldCta(el)) {
        const cta = div('home-hero-cta');
        cta.append(el);
        card.append(cta);
      } else {
        card.append(el);
      }
    });
  });

  leadCol.append(lead);
  row.append(leadCol);
  if (card.children.length) {
    asideCol.append(card);
    row.append(asideCol);
  }
  container.append(row);
  block.replaceChildren(container);
}
