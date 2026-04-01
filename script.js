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

  // TODO: Replace with your Supabase project URL and anon key
  const SUPABASE_URL = 'YOUR_SUPABASE_URL';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  // Initialize Supabase client (only if credentials are set)
  let supabaseClient = null;
  if (SUPABASE_URL !== 'YOUR_SUPABASE_URL' && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.remove('visible');

    const nameVal = form.querySelector('#waitlist-name').value.trim();
    const emailVal = form.querySelector('#waitlist-email').value.trim();

    // Basic validation
    if (!nameVal) {
      showError('Please enter your name.');
      return;
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      showError('Please enter a valid email address.');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Joining...';

    try {
      if (supabaseClient) {
        // Insert into Supabase waitlist table
        const { error } = await supabaseClient
          .from('waitlist')
          .insert([{ name: nameVal, email: emailVal }]);

        if (error) throw error;
      }
      // Show success (even without Supabase for demo purposes)
      form.style.display = 'none';
      successEl.classList.add('visible');
    } catch (err) {
      console.error('Waitlist submission error:', err);
      showError('Something went wrong. Please try again later.');
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#contact-name').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    const message = form.querySelector('#contact-message').value.trim();

    // Clear previous errors
    form.querySelectorAll('.field-error').forEach(el => el.remove());

    let valid = true;

    if (!name) {
      addFieldError(form.querySelector('#contact-name'), 'Please enter your name.');
      valid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      addFieldError(form.querySelector('#contact-email'), 'Please enter a valid email.');
      valid = false;
    }
    if (!message) {
      addFieldError(form.querySelector('#contact-message'), 'Please enter a message.');
      valid = false;
    }

    if (!valid) return;

    // Simulate submission
    form.style.display = 'none';
    successEl.classList.add('visible');
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
