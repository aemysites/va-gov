/**
 * Email sign-up — template-slotted form. Authored: the form heading, the field label
 * paragraph (an <em> marks the required hint) and a bold CTA paragraph whose link is the
 * subscription endpoint. Authored nodes are moved into the form by role (heading, label,
 * CTA); the input and the hidden GovDelivery fields are built here. The form posts to the
 * same GovDelivery action as the source (dynamic-features.md, form-email-signup); the CTA
 * link submits the form, so the authored text never moves into a <button>.
 * @param {Element} block the email-signup block
 */
const FALLBACK_ACTION = 'https://public.govdelivery.com/accounts/USVACHOOSE/subscribers/qualify';

function div(className) {
  const el = document.createElement('div');
  el.className = className;
  return el;
}

function hidden(name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  return input;
}

function linkOnly(el) {
  const a = el.tagName === 'P' && el.querySelector('a');
  return Boolean(a) && el.textContent.trim() === a.textContent.trim();
}

export default function decorate(block) {
  if (block.querySelector(':scope > form')) return;
  const form = document.createElement('form');
  form.className = 'email-signup-form';
  form.method = 'post';
  form.acceptCharset = 'UTF-8';
  const head = div('email-signup-head');
  const label = div('email-signup-label');
  const field = div('email-signup-field');
  const action = div('email-signup-action');

  [...block.querySelectorAll(':scope > div > div > *')].forEach((el) => {
    if (/^H[1-6]$/.test(el.tagName)) head.append(el);
    else if (linkOnly(el)) action.append(el);
    else label.append(el);
  });

  const cta = action.querySelector('a');
  form.action = (cta && cta.href) || FALLBACK_ACTION;
  const input = document.createElement('input');
  input.type = 'email';
  input.name = 'email';
  input.id = 'email-signup-input';
  input.required = true;
  input.autocomplete = 'email';
  input.inputMode = 'email';
  input.maxLength = 130;
  const labelText = label.querySelector('p');
  if (labelText) {
    labelText.id = labelText.id || 'email-signup-label';
    input.setAttribute('aria-labelledby', labelText.id);
  }
  label.addEventListener('click', () => input.focus());
  field.append(input);
  form.append(
    hidden('utf8', '✓'),
    hidden('category_id', 'USVACHOOSE_C1'),
    head,
    label,
    field,
    action,
  );
  if (cta) {
    cta.setAttribute('role', 'button');
    cta.addEventListener('click', (e) => {
      e.preventDefault();
      form.requestSubmit();
    });
  }
  block.replaceChildren(form);
}
