/* main.js - typed, particles, light interactions */
document.addEventListener('DOMContentLoaded', () => {

  // 1) Typed.js for the terminal prompt
  const typed = new Typed('#typed-command', {
    strings: [
      'decode story',
      'open mission.vault',
      'run phishguard --scan',
      'whoami'
    ],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 1600,
    loop: true
  });

  // 2) tsparticles - soft floating "petals" / sparkles
  tsParticles.load("tsparticles", {
    fullScreen: { enable: true, zIndex: -10 },
    particles: {
      number: { value: 30, density: { enable: true, value_area: 800 } },
      color: { value: ["#ffb6c1", "#ff00c8", "#a18cda"] },
      shape: {
        type: "image",
        image: [
          { src: "assets\petals.png", width: 32, height: 32 }, // little petal PNG (replace if you like)
          { src: "assets\petal2.png", width: 32, height: 32 } // small rose svg preview
        ]
      },
      opacity: { value: 0.85, random: true },
      size: { value: 14, random: true },
      move: { direction: "bottom", enable: true, speed: { min: 0.3, max: 1.2 } }
    },
    interactivity: {
      events: { onHover: { enable: false }, onClick: { enable: false } }
    },
    detectRetina: true
  });

  // 3) small GSAP micro-interactions (on cards)
  gsap.utils.toArray('.terminal-card').forEach((el, i) => {
    gsap.from(el, {
      y: 12,
      opacity: 0,
      delay: 0.12 * i,
      duration: 0.7,
      ease: "power3.out"
    });

    el.addEventListener('mouseenter', () => {
      gsap.to(el, { scale: 1.01, boxShadow: "0 10px 40px rgba(255,0,120,0.06)", duration: 0.25 });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { scale: 1, boxShadow: "none", duration: 0.25 });
    });
  });

});
// Make the rose tappable on touch devices: toggle .bloom class for a few seconds
(() => {
  const logo = document.getElementById('roseLogo');
  if (!logo) return;

  // on keyboard focus also bloom briefly
  logo.addEventListener('focus', () => {
    logo.classList.add('bloom');
    setTimeout(() => logo.classList.remove('bloom'), 1200);
  });

  // click / tap toggles bloom briefly
  logo.addEventListener('click', (e) => {
    // allow normal link behavior; bloom first, then follow anchor
    e.preventDefault();
    logo.classList.add('bloom');
    setTimeout(() => {
      logo.classList.remove('bloom');
      // follow link after bloom
      const href = logo.getAttribute('href');
      if (href && href.startsWith('#')) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      } else if (href) {
        window.location = href;
      }
    }, 600);
  }, { passive: false });
})();

// Experience: unfold-on-scroll + click-toggle
(function () {
  const items = document.querySelectorAll('#experience .exp-item');

  if (!items.length) return;

  // IntersectionObserver: expand when item is visible
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const item = entry.target;
        expandItem(item, true); // expand (true = triggered by scroll)
        obs.unobserve(item); // only auto-expand once
      }
    });
  }, { threshold: 0.28 });

  items.forEach(item => {
    // prepare: hide bodies (in case CSS load order different)
    const body = item.querySelector('.exp-body');
    body.style.maxHeight = '0px';
    // click toggle
    const btn = item.querySelector('.exp-header');
    btn.addEventListener('click', (e) => {
      const isExpanded = item.classList.toggle('expanded');
      item.setAttribute('data-expanded', isExpanded ? 'true' : 'false');
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      // set maxHeight for smooth animation:
      if (isExpanded) {
        body.style.maxHeight = body.scrollHeight + 16 + 'px'; // add small padding
      } else {
        body.style.maxHeight = '0px';
      }
    });

    // observe for scroll-based expansion
    io.observe(item);
  });

  // Expand helper
  function expandItem(item, byScroll = false) {
    if (item.classList.contains('expanded')) return;
    const body = item.querySelector('.exp-body');
    item.classList.add('expanded');
    item.setAttribute('data-expanded', 'true');
    const btn = item.querySelector('.exp-header');
    if (btn) btn.setAttribute('aria-expanded', 'true');
    // set inline height to actual content height for smooth transition
    body.style.maxHeight = body.scrollHeight + 16 + 'px';
    // optional: if expanded by scroll, you might want to slightly scroll into view
    if (byScroll) {
      // small timeout so expansion has started before adjusting scroll
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 240);
    }
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const missions = document.querySelectorAll("[data-mission]");

  const revealOnScroll = () => {
    missions.forEach(card => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100) {
        card.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll(); // Trigger on load
});

document.addEventListener("scroll", () => {
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});
