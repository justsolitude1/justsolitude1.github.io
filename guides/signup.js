// Signup form for guide pages. The form's data-resource says which download the visitor asked for.
(function () {
  var SIGNUP_URL = 'https://script.google.com/macros/s/AKfycbzbPD999NjnSkhAjvOKzHmYpxd-TGrWNAPUZ9l04nGacFaN6LLr_mVR-moqkRa2egdQ/exec';

  var form = document.getElementById('signup');
  var msg = document.getElementById('msg');
  var box = document.getElementById('get');
  var button = form.querySelector('button');

  function showError(text) {
    msg.textContent = text;
    msg.className = 'msg error';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.className = 'msg';

    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();

    if (!name) { showError('Add your first name so I know who to send it to.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('That email doesn\'t look right. Mind checking it?'); return; }

    var token = form.elements['cf-turnstile-response'] ? form.elements['cf-turnstile-response'].value : '';
    if (!token) { showError('Still checking you\'re not a bot. Give it a second and try again.'); return; }

    button.disabled = true;
    button.textContent = 'Sending...';

    var data = new URLSearchParams();
    data.append('name', name);
    data.append('email', email);
    data.append('website', form.elements.website.value);
    data.append('cf-turnstile-response', token);
    data.append('resource', form.getAttribute('data-resource') || '');

    fetch(SIGNUP_URL, { method: 'POST', body: data })
      .then(function (res) { return res.json(); })
      .then(function (json) {
        if (!json.success) { throw new Error('rejected'); }
        box.classList.add('sent');
      })
      .catch(function () {
        if (window.turnstile) { window.turnstile.reset(); }
        button.disabled = false;
        button.textContent = button.getAttribute('data-label');
        showError('Something went wrong on my end. Please try again in a moment.');
      });
  });
})();
