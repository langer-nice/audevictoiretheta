document.addEventListener('DOMContentLoaded', function() {
  // Event delegation so it works on any page and with dynamically added content
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.show-more');
    if (!btn) return;

    // Prevent default for anchors/buttons
    if (btn.tagName === 'A' || btn.tagName === 'BUTTON') {
      e.preventDefault();
    }

    const card = btn.closest('.card');
    if (!card) return;

    const willOpen = !card.classList.contains('open');
    card.classList.toggle('open', willOpen);
    btn.setAttribute('aria-expanded', String(willOpen));

    // Toggle button label text
    const label = btn.querySelector('span');
    if (label) {
      label.textContent = willOpen ? 'Lire moins' : 'Lire plus';
    }

    // Toggle icon between plus and minus
    const icon = btn.querySelector('i');
    if (icon) {
      icon.classList.toggle('fa-plus', !willOpen);
      icon.classList.toggle('fa-minus', willOpen);
    }

    // Smoothly center the opened card after CSS transition
    if (willOpen) {
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }), 350);
    }
  }, false);
});