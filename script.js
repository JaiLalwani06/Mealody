/* ===================================================
   Mealody — Shared JavaScript
   =================================================== */

/* === Navbar: Scroll shadow + Mobile Toggle === */
(function () {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.navbar__toggle');
  const nav = document.querySelector('.navbar__nav');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = toggle.classList.toggle('open');
      nav.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav when a link is clicked (mobile)
    nav.querySelectorAll('.navbar__link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Active nav link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
})();

/* === Scroll Animations (IntersectionObserver) === */
(function () {
  const elements = document.querySelectorAll('.fade-up');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* === Waitlist Form (index.html) === */
(function () {
  const form = document.getElementById('waitlist-form');
  if (!form) return;

  const errorEl = document.getElementById('waitlist-error');
  const successEl = document.getElementById('waitlist-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('visible');

    const nameVal = form.querySelector('#waitlist-name').value.trim();
    const emailVal = form.querySelector('#waitlist-email').value.trim();

    if (!nameVal) { showError('Please enter your name.'); return; }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError('Please enter a valid email address.'); return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';

    try {
      const resp = await fetch('https://mealody.vercel.app/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nameVal, email: emailVal }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Something went wrong.');
      form.style.display = 'none';
      successEl.classList.add('visible');
    } catch (err) {
      showError(err.message || 'Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Join Waitlist';
    }
  });

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.classList.add('visible');
  }
})();

/* === Contact Form (contact.html) === */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successEl = document.getElementById('contact-success');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();

    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let valid = true;
    if (!name) { addFieldError(form.querySelector('#contact-name'), 'Please enter your name.'); valid = false; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { addFieldError(form.querySelector('#contact-email'), 'Please enter a valid email.'); valid = false; }
    if (!message) { addFieldError(form.querySelector('#contact-message'), 'Please enter a message.'); valid = false; }
    if (!valid) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const resp = await fetch('https://mealody.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Something went wrong.');
      form.style.display = 'none';
      successEl.classList.add('visible');
    } catch (err) {
      addFieldError(form.querySelector('#contact-message'), err.message || 'Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });

  function addFieldError(input, message) {
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'display:block;color:#c0392b;font-size:0.83rem;margin-top:5px;';
    err.textContent = message;
    input.parentNode.appendChild(err);
    input.style.borderColor = '#c0392b';

    input.addEventListener('input', () => {
      err.remove();
      input.style.borderColor = '';
    }, { once: true });
  }
})();

/* === How It Works: Day Tabs === */
(function () {
  const tabs = document.querySelectorAll('.day-tab');
  const contents = document.querySelectorAll('.day-content');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const day = tab.dataset.day;

      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const content = document.querySelector(`.day-content[data-day="${day}"]`);
      if (content) content.classList.add('active');
    });
  });
})();

/* === How It Works: Grocery Panel Toggle === */
(function () {
  const btn = document.getElementById('grocery-btn');
  const panel = document.getElementById('grocery-panel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.toggle('open');
    btn.textContent = isOpen ? 'Hide Grocery List' : 'Generate Grocery List';
    if (isOpen) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
})();
