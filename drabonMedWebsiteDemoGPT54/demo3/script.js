const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal');
const yearTarget = document.getElementById('year');
const priceForm = document.getElementById('price-form');
const resultCard = document.getElementById('calculator-result');

const routeDistances = {
  'Miskolc-Kazincbarcika': 27,
  'Miskolc-Ózd': 56,
  'Miskolc-Eger': 73,
  'Miskolc-Budapest': 182,
  'Kazincbarcika-Ózd': 34,
  'Kazincbarcika-Eger': 91,
  'Kazincbarcika-Budapest': 205,
  'Ózd-Eger': 74,
  'Ózd-Budapest': 171,
  'Eger-Budapest': 139,
};

const serviceRates = {
  standard: 430,
  guarded: 635,
  event: 790,
};

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealElements.forEach((element) => revealObserver.observe(element));

function getDistance(from, to) {
  if (!from || !to) {
    return null;
  }

  if (from === to) {
    return 5;
  }

  const key = [from, to].sort((left, right) => left.localeCompare(right, 'hu')).join('-');
  return routeDistances[key] ?? 96;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderEstimate({ amount = null, description, details = '' }) {
  if (!resultCard) {
    return;
  }

  resultCard.innerHTML = `
    <p class="calculator-result__label">Becsült összeg</p>
    <strong>${amount === null ? '—' : formatCurrency(amount)}</strong>
    <span>${description}</span>
    ${details ? `<small>${details}</small>` : ''}
  `;
}

if (priceForm) {
  priceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(priceForm);
    const from = String(formData.get('from-location') || '');
    const to = String(formData.get('to-location') || '');
    const tier = String(formData.get('service-tier') || 'standard');

    if (!from || !to) {
      renderEstimate({
        description: 'Kérjük, válassza ki mindkét helyszínt a becsléshez.',
      });
      return;
    }

    const distance = getDistance(from, to);
    const basePrice = 17500;
    const variableRate = serviceRates[tier] ?? serviceRates.standard;
    const total = basePrice + distance * variableRate;

    const tierLabel =
      tier === 'guarded'
        ? 'őrzött betegszállítás'
        : tier === 'event'
          ? 'rendezvénybiztosítási kiszállás'
          : 'általános betegszállítás';

    renderEstimate({
      amount: total,
      description: 'A megjelenített összeg demó célú előzetes becslés. A végleges ár minden esetben egyedi ajánlat alapján készül.',
      details: `${from} → ${to} · kb. ${distance} km · ${tierLabel}`,
    });
  });
}
