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

  const brandmark = document.querySelector('.brandmark');
  if (brandmark) {
    brandmark.addEventListener('click', (e) => {
      e.preventDefault();
      const home = document.getElementById('home');
      if (home) {
        home.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

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
  const initTickerLoop = () => {
    if (!ticker) return;

    const baseItems = ticker.dataset.baseItems || ticker.innerHTML;
    ticker.dataset.baseItems = baseItems;

    const groupA = document.createElement('div');
    groupA.className = 'ticker-group';
    groupA.innerHTML = baseItems;

    ticker.innerHTML = '';
    ticker.appendChild(groupA);

    // Measure only after mounting, and cap repetitions to avoid runaway loops.
    let guard = 0;
    while (groupA.scrollWidth < window.innerWidth * 1.2 && guard < 20) {
      groupA.insertAdjacentHTML('beforeend', baseItems);
      guard += 1;
    }

    const groupB = groupA.cloneNode(true);
    ticker.appendChild(groupB);

    const shiftPx = Math.max(groupA.scrollWidth, 1);
    ticker.style.setProperty('--ticker-shift', `${shiftPx}px`);
    ticker.style.setProperty('--ticker-duration', `${Math.max(18, shiftPx / 80)}s`);
  };

  initTickerLoop();
  window.addEventListener('resize', initTickerLoop);

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

  const progressBar = document.getElementById('scroll-progress');
  const syncScrollProgress = () => {
    if (!progressBar) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progressBar.style.width = `${Math.max(0, Math.min(100, pct))}%`;
  };
  syncScrollProgress();
  window.addEventListener('scroll', syncScrollProgress, { passive: true });
  window.addEventListener('resize', syncScrollProgress);

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
