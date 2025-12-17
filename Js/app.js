(function () {
  'use strict';

  /* ===========================
     Utilities
     =========================== */
  const q  = (sel, ctx = document) => ctx.querySelector(sel);
  const qa = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

  /* ===========================
     Safe helpers -
     =========================== */
  const safeAddListener = (el, ev, fn, opts) => { if (el) el.addEventListener(ev, fn, opts); };
  const safeRemove = (el) => { try { if (el && el.remove) el.remove(); } catch (e) {} };

  /* ===========================
     Remove existing overlays (defensive)
     =========================== */
  (function removeExistingOverlay() {
    qa('.menu-overlay').forEach(el => {
      try { el.style.display = 'none'; } catch (e) {}
      safeRemove(el);
    });
  })();

  /* ===========================
     Mobile nav (no overlay)h
     =========================== */
  (function mobileNavNoOverlay() {
    const menuToggle = q('.menu-toggle');
    const menu = document.getElementById('primary-menu');
    if (!menuToggle || !menu) return;

    menuToggle.setAttribute('aria-controls', menu.id);
    menuToggle.setAttribute('aria-expanded', 'false');
    menu.setAttribute('data-visible', 'false');

    const setMenuVisible = (visible) => {
      menu.setAttribute('data-visible', visible ? 'true' : 'false');
      menu.setAttribute('aria-hidden', visible ? 'false' : 'true');
      menuToggle.setAttribute('aria-expanded', visible ? 'true' : 'false');
      menuToggle.classList.toggle('open', visible);

      // prevent background scroll on mobile when menu open
      document.documentElement.style.overflow = visible ? 'hidden' : '';
      document.body.style.overflow = visible ? 'hidden' : '';
    };

    safeAddListener(menuToggle, 'click', (ev) => {
      ev.preventDefault();
      const shown = menu.getAttribute('data-visible') === 'true';
      setMenuVisible(!shown);
    });

    safeAddListener(document, 'keydown', (e) => {
      if (e.key === 'Escape') setMenuVisible(false);
    });

    // Close on internal anchor click
    qa('#primary-menu a[href^="#"]').forEach(a => {
      safeAddListener(a, 'click', () => setMenuVisible(false));
    });

    // Click outside to close
    safeAddListener(document, 'click', (e) => {
      try {
        const isOpen = menu.getAttribute('data-visible') === 'true';
        if (!isOpen) return;
        const withinMenu = menu.contains(e.target) || menuToggle.contains(e.target);
        if (!withinMenu) setMenuVisible(false);
      } catch (er) {}
    });
  })();

  /* ===========================
     Lazy load hero video (IntersectionObserver)
     =========================== */
  (function lazyLoadHeroVideo() {
    const video = q('.hero-video');
    if (!video) return;
    const source = video.querySelector('source[data-src]');
    if (!source) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    try {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            source.src = source.dataset.src;
            try { video.load(); } catch (e) {}
            if (!prefersReduced) {
              video.play().catch(() => {});
            }
            obs.unobserve(video);
          }
        });
      }, { threshold: 0.25 });
      io.observe(video);
    } catch (err) { // fallback
      source.src = source.dataset.src;
      try { video.load(); } catch (e) {}
    }
  })();

  /* ===========================
     Reveal on scroll (general)
     - don't hide again (once active, stays)
     =========================== */
  (function revealOnScroll() {
    const revealEls = qa('.reveal');
    if (!revealEls.length) return;

    try {
      const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            // intentionally not unobserving to keep stability across layout changes
          }
        });
      }, { threshold: 0.12 });

      revealEls.forEach(el => ro.observe(el));
    } catch (err) {
      revealEls.forEach(el => el.classList.add('active'));
    }
  })();

  /* ===========================
     Light parallax for elements with data-parallax
     =========================== */
  (function lightParallax() {
    const nodes = qa('[data-parallax]');
    if (!nodes.length) return;

    const items = nodes.map(el => ({
      el,
      speed: Number.parseFloat(el.dataset.parallax) || 0
    }));

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        items.forEach(item => {
          const rect = item.el.getBoundingClientRect();
          const offset = (rect.top + rect.height / 2) - (window.innerHeight / 2);
          const translateY = -offset * item.speed;
          // preserve existing transform if other transform used? we choose to set translate only
          item.el.style.transform = `translate3d(0, ${translateY}px, 0)`;
        });
        ticking = false;
      });
      ticking = true;
    }

    safeAddListener(window, 'scroll', onScroll, { passive: true });
    // initial position
    onScroll();
  })();

  /* ===========================
     Hero 3D interaction (pointer)
     =========================== */
  (function hero3DInteraction() {
    const hero = q('.hero-section');
    const heroContent = q('.hero-content');
    if (!hero || !heroContent) return;

    const moveHandler = (e) => {
      const rect = hero.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX === undefined || clientY === undefined) return;

      const x = ((clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((clientY - rect.top) / rect.height - 0.5) * 20;

      heroContent.style.transform = `rotateX(${-y}deg) rotateY(${x}deg) translateZ(12px)`;
    };

    const leaveHandler = () => { heroContent.style.transform = ''; };

    safeAddListener(hero, 'pointermove', moveHandler);
    safeAddListener(hero, 'mouseleave', leaveHandler);
    safeAddListener(hero, 'touchmove', moveHandler, { passive: true });
    safeAddListener(hero, 'touchend', leaveHandler);
  })();

  /* ===========================
     Welcome media frame interactions
     - keyboard accessible
     =========================== */
  (function welcomeMediaInteractions() {
    const mediaFrame = q('#welcome-section .media-frame');
    if (!mediaFrame) return;

    mediaFrame.setAttribute('tabindex', '0');
    mediaFrame.setAttribute('role', 'button');
    mediaFrame.setAttribute('aria-pressed', 'false');

    const onMove = (e) => {
      const rect = mediaFrame.getBoundingClientRect();
      const clientX = e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY);
      if (clientX === undefined || clientY === undefined) return;

      const px = (clientX - rect.left) / rect.width - 0.5;
      const py = (clientY - rect.top) / rect.height - 0.5;
      const rx = -py * 8;
      const ry = px * 10;
      mediaFrame.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    };

    const onLeave = () => { mediaFrame.style.transform = ''; };

    safeAddListener(mediaFrame, 'pointermove', onMove);
    safeAddListener(mediaFrame, 'mouseleave', onLeave);
    safeAddListener(mediaFrame, 'touchmove', onMove, { passive: true });
    safeAddListener(mediaFrame, 'touchend', onLeave);

    safeAddListener(mediaFrame, 'click', () => {
      const contact = q('#contact') || q('#qld-contact-section') || q('#qld-contact-form');
      if (contact && contact.scrollIntoView) contact.scrollIntoView({ behavior: 'smooth' });
    });

    safeAddListener(mediaFrame, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const contact = q('#contact') || q('#qld-contact-section') || q('#qld-contact-form');
        if (contact && contact.scrollIntoView) contact.scrollIntoView({ behavior: 'smooth' });
      }
    });
  })();

  /* ===========================
     Defensive cleanup (overlay styles)
     =========================== */
  (function cleanupPossibleOverlayStyle() {
    qa('.menu-overlay').forEach(o => { try { o.style.display = 'none'; } catch (e) {} });
  })();

  /* ===========================
     About section reveal (one-off)
     =========================== */
  (function aboutReveal() {
    const el = document.querySelector('.about-content');
    if (!el) return;
    try {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      io.observe(el);
    } catch (err) {
      el.classList.add('active');
    }
  })();

  /* ===========================
     Smart solution section: reveal + video controls
     =========================== */
  (function smartSolution() {
    const revealEls = qa('#smart-solution-section .reveal');
    if (revealEls.length) {
      try {
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('active');
              obs.unobserve(e.target);
            }
          });
        }, { threshold: 0.15 });
        revealEls.forEach(el => observer.observe(el));
      } catch (err) {
        revealEls.forEach(el => el.classList.add('active'));
      }
    }

    // Video controls inside that section
    qa('#smart-solution-section .video-card').forEach(card => {
      const video = card.querySelector('.smart-video');
      const playBtn = card.querySelector('.play-btn');
      const muteBtn = card.querySelector('.mute-btn');

      if (!video) return;

      if (playBtn) {
        safeAddListener(playBtn, 'click', () => {
          try {
            if (video.paused) {
              video.play();
              playBtn.textContent = '⏸';
            } else {
              video.pause();
              playBtn.textContent = '▶️';
            }
          } catch (e) {}
        });
      }

      if (muteBtn) {
        safeAddListener(muteBtn, 'click', () => {
          try {
            video.muted = !video.muted;
            muteBtn.textContent = video.muted ? '🔇' : '🔊';
          } catch (e) {}
        });
      }
    });
  })();

  /* ===========================
     Services reveal (reveal-from-*)
     =========================== */
  (function servicesReveal() {
    const revealEls = qa('.reveal-from-left, .reveal-from-right, .reveal-from-bottom');
    if (!revealEls.length) return;

    try {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('active');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => observer.observe(el));
    } catch (err) {
      revealEls.forEach(el => el.classList.add('active'));
    }
  })();

  /* ===========================
     Fleet carousel (simple auto-rotate)
     =========================== */
  (function fleetCarousel() {
    const slides = qa('.qld-fleet-slide');
    if (!slides.length) return;
    let current = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    };

    const nextSlide = () => {
      current = (current + 1) % slides.length;
      showSlide(current);
    };

    showSlide(current);
    // use interval but keep reference in case want to clear later
    setInterval(nextSlide, 3000);
  })();

  /* ===========================
     XCL reveal observer
     =========================== */
  (function xclReveal() {
    const xclRevealElems = qa('.xcl-reveal');
    if (!xclRevealElems.length) return;

    try {
      const xclObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, { threshold: 0.2 });

      xclRevealElems.forEach(el => xclObserver.observe(el));
    } catch (err) {
      xclRevealElems.forEach(el => el.classList.add('active'));
    }
  })();

  /* ===========================
     Horizontal ads lightbox
     =========================== */
  (function horizontalAdsLightbox() {
    const ads = qa('#qld-horizontal-ads img');
    const lightbox = q('#qld-lightbox');
    const lightboxImg = q('#qld-lightbox-img');
    const closeBtn = q('#qld-lightbox-close');

    if (!ads.length || !lightbox || !lightboxImg) return;

    ads.forEach(img => {
      safeAddListener(img, 'click', () => {
        try {
          lightboxImg.src = img.src || img.currentSrc || '';
          lightbox.style.display = 'flex';
        } catch (e) {}
      });
    });

    if (closeBtn) safeAddListener(closeBtn, 'click', () => { lightbox.style.display = 'none'; });
    safeAddListener(lightbox, 'click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });
  })();

  /* ===========================
     Cylinder setup + lightbox for cylinder
     =========================== */
  (function cylinderInit() {
    safeAddListener(document, 'DOMContentLoaded', () => {
      const items = qa('.qld-cylinder-item');
      const cylinder = q('#qldCylinder');
      if (!items.length || !cylinder) return;

      const radius = 400;
      const total = items.length;
      const angle = 360 / Math.max(1, total);

      items.forEach((item, i) => {
        const theta = i * angle;
        item.style.transform = `rotateY(${theta}deg) translateZ(${radius}px)`;
      });

      const lightbox = q('#qldLightbox');
      const lbImg = q('.qld-lightbox-img');
      const lbClose = q('.qld-lightbox-close');

      if (lightbox && lbImg) {
        items.forEach(item => {
          safeAddListener(item, 'click', () => {
            const imgEl = item.querySelector('img');
            if (!imgEl) return;
            lbImg.src = imgEl.src || imgEl.currentSrc || '';
            lightbox.style.display = 'flex';
          });
        });

        if (lbClose) safeAddListener(lbClose, 'click', () => { lightbox.style.display = 'none'; });
        safeAddListener(lightbox, 'click', (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; });
      }
    });
  })();

  /* ===========================
     Contact section: reveal + form submit
     =========================== */
  (function contactSection() {
    // reveal (on DOM ready)
    safeAddListener(document, 'DOMContentLoaded', () => {
      const reveals = qa('.reveal-from-left, .reveal-from-right');
      if (reveals.length) {
        try {
          const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) entry.target.classList.add('active');
            });
          }, { threshold: 0.15 });
          reveals.forEach(el => observer.observe(el));
        } catch (err) {
          reveals.forEach(el => el.classList.add('active'));
        }
      }
    });

    // form submission (defensive)
    const form = q('#qld-contact-form');
    if (!form) return;

    safeAddListener(form, 'submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);

      // Lightweight validation: ensure required fields exist and not empty
      const name = formData.get('name')?.toString().trim();
      const email = formData.get('email')?.toString().trim();
      const message = formData.get('message')?.toString().trim();
      if (!name || !email || !message) {
        try { alert('Please fill in all required fields.'); } catch (err) {}
        return;
      }

      try {
        const res = await fetch('https://formspree.io/f/mayvlgbq', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        // feedback depending on status
        if (res && (res.ok || res.status === 200 || res.status === 201)) {
          try { alert('Message sent successfully!'); } catch (e) {}
          form.reset();
        } else {
          try { alert('Message sent (server returned a non-OK status).'); } catch (e) {}
          form.reset();
        }
      } catch (err) {
        try { alert('Oops! There was a problem sending your message.'); } catch (e) {}
      }
    });
  })();

  /* ===========================
     Final defensive DOMContentLoaded initializations
     =========================== */
  safeAddListener(document, 'DOMContentLoaded', () => {
    // Ensure any elements that need initial activation are handled
    // e.g., if there are elements that couldn't be found earlier, any fallback logic can go here
    // No-op for now — placeholder for future minor enhancements
  });

})();
  const footer = document.querySelector('.reveal-footer');

  function revealFooter() {
    const footerTop = footer.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (footerTop < windowHeight - 100) {
      footer.classList.add('active');
      window.removeEventListener('scroll', revealFooter);
    }
  }

  window.addEventListener('scroll', revealFooter);
  window.addEventListener('load', revealFooter);

  // about us page - about hero 
  const revealItems = document.querySelectorAll('.reveal-fade');

  function revealOnScrollUnified() {
    revealItems.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < window.innerHeight - 120) el.classList.add('active');
    });
  }

  window.addEventListener('scroll', revealOnScrollUnified);
  window.addEventListener('load', revealOnScrollUnified);


  // ANTMATION FADE IN 
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom");

function revealOnScroll() {
  revealElements.forEach((el) => {
    const elementTop = el.getBoundingClientRect().top;
    const windowHeight = window.innerHeight - 100; 

    if (elementTop < windowHeight) {
      el.classList.add("active");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Scroll Reveal for all elements
  const fadeItems = document.querySelectorAll('.fade-item, .animated-title');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        if(entry.target.classList.contains('animated-title')){
          entry.target.classList.add('animate-title');
        } else {
          entry.target.classList.add('show');
        }
      }
    });
  }, {threshold:0.15});
  fadeItems.forEach(el=>observer.observe(el));

const scrollElements = document.querySelectorAll('.fade-slide, .fade-item, .fade-in');

const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      scrollObserver.unobserve(entry.target); 
    }
  });
}, { threshold: 0.15 });

scrollElements.forEach(el => scrollObserver.observe(el));


//order
const weight = document.getElementById("qldWeight");
const volume = document.getElementById("qldVolume");
const from = document.getElementById("qldFrom");
const to = document.getElementById("qldTo");
const client = document.getElementById("qldClient");
const priceEl = document.getElementById("qldPrice");
const orderBtn = document.getElementById("qldOrder");

/* Distance logic (smart & realistic) */
function distanceFactor(fromCity, toCity) {
  if (!fromCity || !toCity) return 1;
  if (fromCity.toLowerCase() === toCity.toLowerCase()) return 1;
  return 1.6; // inter-city transport
}

function calculateSEK() {
  const w = +weight.value || 0;
  const v = +volume.value || 0;

  const base = (w * 4) + (v * 220); // realistic SEK logic
  const distance = distanceFactor(from.value, to.value);
  const clientFactor = client.value === "company" ? 0.9 : 1;

  const total = base * distance * clientFactor;
  priceEl.textContent = Math.round(total) + " SEK";

  orderBtn.href =
    `mailto:info@qld.se?subject=Transport Order Request&body=` +
    `Weight: ${w} kg%0A` +
    `Volume: ${v} m3%0A` +
    `Pickup: ${from.value}%0A` +
    `Delivery: ${to.value}%0A` +
    `Client Type: ${client.value}%0A` +
    `Estimated Price: ${Math.round(total)} SEK`;
}

[weight, volume, from, to, client].forEach(el =>
  el.addEventListener("input", calculateSEK)
);