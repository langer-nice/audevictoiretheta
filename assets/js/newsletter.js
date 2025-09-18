(function(){
  function loadBrevo(){
    if (document.querySelector('script[src^="https://sibforms.com/forms/end-form/build/main.js"]')) return;
    var s = document.createElement('script');
    s.src = 'https://sibforms.com/forms/end-form/build/main.js';
    s.defer = true;
    document.body.appendChild(s);
  }

  function configureBrevoMessages(){
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Veuillez choisir un code pays';
    window.LOCALE = 'fr';
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE =
      "Les informations que vous avez fournies ne sont pas valides. Veuillez vérifier le format du champ et réessayer.";
    window.REQUIRED_ERROR_MESSAGE = "Vous devez renseigner ce champ. ";
    window.GENERIC_INVALID_MESSAGE =
      "Les informations que vous avez fournies ne sont pas valides. Veuillez vérifier le format du champ et réessayer.";
    window.translation = {
      common: {
        selectedList: '{quantity} liste sélectionnée',
        selectedLists: '{quantity} listes sélectionnées',
        selectedOption: '{quantity} sélectionné',
        selectedOptions: '{quantity} sélectionnés',
      }
    };
    window.AUTOHIDE = Boolean(0);
  }

  function onVisible(el, cb){
    if (!('IntersectionObserver' in window)) { cb(); return; }
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e => {
        if(e.isIntersecting){
          cb();
          io.disconnect();
        }
      });
    }, {rootMargin: '200px'});
    io.observe(el);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var formContainer = document.getElementById('sib-form-container') || document.getElementById('sib-container') || document.querySelector('.sib-form');
    if (formContainer){
      configureBrevoMessages();
      onVisible(formContainer, loadBrevo);
    }
  });
})();
