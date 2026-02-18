// Simple EmailJS integration for the contact form
(function(){
  // Replace these with your EmailJS values
  const SERVICE_ID = 'YOUR_SERVICE_ID';
  const TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
  const PUBLIC_KEY = 'YOUR_PUBLIC_KEY';

  const form = document.getElementById('contactForm');
  const submitButton = document.getElementById('contactSubmit');
  const successEl = document.getElementById('contactSuccess');
  const errorEl = document.getElementById('contactError');

  function show(el){ el.style.display = 'block'; el.offsetHeight; }
  function hide(el){ el.style.display = 'none'; }

  if (typeof emailjs !== 'undefined') {
    try { emailjs.init(PUBLIC_KEY); } catch(e){ console.warn('EmailJS init failed', e); }
  } else {
    console.error('EmailJS SDK not loaded.');
  }

  if (!form) return;

  form.addEventListener('submit', async function(e){
    e.preventDefault();

    // Basic check for placeholder keys
    if (SERVICE_ID === 'YOUR_SERVICE_ID' || TEMPLATE_ID === 'YOUR_TEMPLATE_ID' || PUBLIC_KEY === 'YOUR_PUBLIC_KEY'){
      errorEl.textContent = 'Setup Error: update SERVICE_ID, TEMPLATE_ID, and PUBLIC_KEY in assets/js/mail.js';
      show(errorEl);
      return;
    }

    hide(successEl); hide(errorEl);
    submitButton.disabled = true;
    const origText = submitButton.textContent;
    submitButton.textContent = 'Sending...';

    const templateParams = {
      name: form.querySelector('input[name="name"]').value,
      email: form.querySelector('input[name="email"]').value,
      message: form.querySelector('textarea[name="message"]').value
    };

    try{
      const resp = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
      if (resp && resp.status === 200) {
        form.reset();
        show(successEl);
        submitButton.textContent = 'Sent!';
        setTimeout(()=>{ hide(successEl); submitButton.textContent = origText; submitButton.disabled = false; }, 4000);
      } else {
        throw new Error('EmailJS response: ' + JSON.stringify(resp));
      }
    }catch(err){
      console.error('Email send error', err);
      show(errorEl);
      submitButton.textContent = origText;
      submitButton.disabled = false;
    }
  });
})();
