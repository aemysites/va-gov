// VA.gov replica — home page behaviour: the information banner's close button.
(() => {
  const alert = document.getElementById('site-alert');
  const close = alert && alert.querySelector('.site-alert__close');
  if (close) close.addEventListener('click', () => { alert.hidden = true; });
})();
