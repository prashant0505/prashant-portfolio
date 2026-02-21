(() => {
  // Always start at top on refresh/reload for a clean first-screen experience.
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    if (location.hash) {
      history.replaceState(null, '', `${location.pathname}${location.search}`);
    }
  });

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const roleRotator = document.getElementById('role-rotator');
  const roleWords = [
    'high-scale APIs',
    'resilient microservices',
    'AI-powered pipelines',
    'secure data platforms'
  ];

  if (roleRotator) {
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % roleWords.length;
      roleRotator.textContent = roleWords[idx];
    }, 1800);
  }

  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${Math.min(i * 90, 320)}ms`;
    observer.observe(el);
  });

  const counterEls = document.querySelectorAll('[data-counter]');
  const animateCounter = (el) => {
    const target = Number(el.dataset.counter || 0);
    const suffix = el.dataset.suffix || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1150;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = `${isDecimal ? value.toFixed(1) : Math.floor(value)}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.55 }
  );
  counterEls.forEach((el) => counterObserver.observe(el));

  const ticker = document.querySelector('.ticker-track');
  if (ticker && !ticker.dataset.cloned) {
    ticker.innerHTML += ticker.innerHTML;
    ticker.dataset.cloned = 'true';
  }

  // Use viewport center distance for stable story dot activation.
  const storyCards = Array.from(document.querySelectorAll('.story-card'));
  const railDots = Array.from(document.querySelectorAll('.rail-dot'));

  const setActiveDot = (index) => {
    railDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  };

  const syncStoryDotsByScroll = () => {
    if (!storyCards.length || !railDots.length) return;
    const viewportAnchor = window.innerHeight * 0.42;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    storyCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const distance = Math.abs(cardCenter - viewportAnchor);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveDot(closestIndex);
  };

  if (storyCards.length && railDots.length) {
    syncStoryDotsByScroll();
    window.addEventListener('scroll', syncStoryDotsByScroll, { passive: true });
    window.addEventListener('resize', syncStoryDotsByScroll);
  }

  const menuLinks = Array.from(document.querySelectorAll('.menu a'));
  const sections = menuLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        menuLinks.forEach((link) => {
          const match = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', match);
        });
      });
    },
    { threshold: 0.42 }
  );
  sections.forEach((section) => navObserver.observe(section));
})();
