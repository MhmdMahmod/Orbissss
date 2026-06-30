/* ============================================
   ORBIS DEVELOPMENT — SCRIPTS
   ============================================ */

// Remove the safety-net class as early as possible: if this file runs,
// JS is available, and .reveal elements will be animated in by the
// IntersectionObserver below instead of the CSS fallback.
document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- LOADER ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('out'), 500);
  });

  /* ---------- NAV SCROLL STATE ---------- */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  /* ---------- MOBILE MENU ---------- */
  const navTog = document.getElementById('navTog');
  const mobMenu = document.getElementById('mobMenu');
  if (navTog && mobMenu) {
    const toggleMenu = () => {
      const isOpen = mobMenu.classList.toggle('open');
      navTog.classList.toggle('open', isOpen);
      navTog.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    navTog.addEventListener('click', toggleMenu);
    mobMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', toggleMenu));
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(ease(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target, Number(entry.target.dataset.target));
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  document.querySelectorAll('.node-counter').forEach(el => counterObserver.observe(el));

  /* ---------- SCROLL REVEAL (drives all .reveal elements: values, projects head, partners, contact, stats) ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---------- 3D CARD TILT for project + value cards (pointer devices only) ---------- */
  if (window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 14}deg) rotateX(${-y * 9}deg) translateY(-4px) scale(1.015)`;
        card.style.transition = 'transform .08s';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0) scale(1)';
        card.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
      });
    });
  }

  /* ---------- HERO ORBIT 3D PARALLAX (mouse-driven "4D" depth) ---------- */
  const orbitWrap = document.getElementById('orbitWrap');
  if (orbitWrap && window.matchMedia('(pointer:fine)').matches) {
    const heroSection = orbitWrap.closest('.hero');
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      orbitWrap.style.transform = `rotateX(${8 - y * 14}deg) rotateY(${x * 16}deg)`;
      orbitWrap.style.transition = 'transform .15s linear';
    });
    heroSection.addEventListener('mouseleave', () => {
      orbitWrap.style.transform = 'rotateX(8deg) rotateY(0deg)';
      orbitWrap.style.transition = 'transform .6s cubic-bezier(.2,.8,.2,1)';
    });
  }

  /* ---------- MAGNETIC CTA BUTTON (pointer devices only) ---------- */
  const magWrap = document.getElementById('magWrap');
  const magBtn = document.getElementById('magBtn');
  if (magWrap && magBtn && window.matchMedia('(pointer:fine)').matches) {
    magWrap.addEventListener('mousemove', (e) => {
      const rect = magWrap.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
      const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
      magBtn.style.transform = `translate(${x}px, ${y}px)`;
      magBtn.style.transition = 'transform .1s';
    });
    magWrap.addEventListener('mouseleave', () => {
      magBtn.style.transform = 'translate(0, 0)';
      magBtn.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1)';
    });
  }

  /* ---------- PROJECTS DRAG-TO-SCROLL ---------- */
  const track = document.getElementById('ptrack');
  if (track) {
    let isDown = false, startX = 0, startScroll = 0;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      track.classList.add('dragging');
      startX = e.pageX - track.offsetLeft;
      startScroll = track.scrollLeft;
    });
    track.addEventListener('mouseleave', () => {
      isDown = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('mouseup', () => {
      isDown = false;
      track.classList.remove('dragging');
    });
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = startScroll - (x - startX) * 1.4;
    });
  }

  /* ---------- LEAD FORM ---------- */
  const form = document.getElementById('leadForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    const phoneInput = document.getElementById('phone');
    const phonePattern = /^01[0125][0-9]{8}$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      if (phoneInput && !phonePattern.test(phoneInput.value.trim())) {
        phoneInput.focus();
        phoneInput.setCustomValidity('Please enter a valid Egyptian mobile number (e.g. 01012345678).');
        phoneInput.reportValidity();
        return;
      }

      // Hook point: send form data to your backend / CRM here.
      // const data = Object.fromEntries(new FormData(form));

      form.style.display = 'none';
      if (formSuccess) formSuccess.classList.add('show');
    });

    if (phoneInput) {
      phoneInput.addEventListener('input', () => phoneInput.setCustomValidity(''));
    }
  }

});