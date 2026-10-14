// Hub rail accordion: per-item toggle + expand/collapse all (va-accordion behaviour).
(function () {
  document.querySelectorAll('[data-acc]').forEach((acc) => {
    const set = (btn, open) => { btn.setAttribute('aria-expanded', String(open)); document.getElementById(btn.getAttribute('aria-controls')).hidden = !open; };
    acc.querySelectorAll('.acc-btn').forEach((b) => b.addEventListener('click', () => set(b, b.getAttribute('aria-expanded') !== 'true')));
    acc.querySelectorAll('[data-acc-all]').forEach((b) => b.addEventListener('click', () => acc.querySelectorAll('.acc-btn').forEach((x) => set(x, b.dataset.accAll === 'open'))));
  });
}());
