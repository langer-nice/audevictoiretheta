
// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.mobile-toggle');
  const links = document.querySelector('.navlinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Newsletter demo handler (replace action URL in HTML to connect to your provider)
  document.querySelectorAll('form[data-demo="newsletter"]').forEach(form => {
    form.addEventListener('submit', (e) => {
      if (form.action.includes('example.com')) {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]')?.value || '';
        alert(`Merci! Nous avons bien noté votre email: ${email}\n\nRemplacez l'attribut action du formulaire par votre URL Mailchimp/Brevo/Sendinblue.`);
      }
    });
  });
});
