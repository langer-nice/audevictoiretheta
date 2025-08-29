document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('#mes-formations .show-more').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const card = btn.closest('.card');
      card.classList.toggle('open');
      // Optionally scroll into view
      if(card.classList.contains('open')) {
        setTimeout(() => card.scrollIntoView({behavior:'smooth', block:'center'}), 350);
      }
    });
  });
});