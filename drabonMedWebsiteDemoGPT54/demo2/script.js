const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const yearTarget = document.getElementById('year');
const revealElements = document.querySelectorAll('.reveal');
const priceForm = document.getElementById('price-form');
const resultCard = document.getElementById('calculator-result');

const demoDistances = {
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

const tierMultipliers = {
  standard: 415,
  guarded: 610,
  event: 760,
};

if (yearTarget) {
  yearTarget.textContent = String(new Date().getFullYear());
}

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));

function getDistance(from, to) {
  if (!from || !to) {
    return null;
  }

  if (from === to) {
    return 5;
  }

  const key = [from, to].sort((left, right) => left.localeCompare(right, 'hu')).join('-');
  return demoDistances[key] ?? 100;
}

function formatHuf(value) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderResult({ amount = null, description, details = '' }) {
  if (!resultCard) {
    return;
  }

  resultCard.innerHTML = `
    <p class="result-card__label">Becsült díj</p>
    <strong>${amount === null ? '—' : formatHuf(amount)}</strong>
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
      renderResult({
        description: 'Kérjük, válassza ki az indulási és az érkezési pontot is.',
      });
      return;
    }

    const distance = getDistance(from, to);
    const baseFee = 16000;
    const perKm = tierMultipliers[tier] ?? tierMultipliers.standard;
    const total = baseFee + distance * perKm;

    const tierLabel =
      tier === 'guarded'
        ? 'őrzött betegszállítás'
        : tier === 'event'
          ? 'rendezvénybiztosítási kiszállás'
          : 'általános betegszállítás';

    renderResult({
      amount: total,
      description: 'Ez egy demó célú, tájékoztató jellegű becslés. A végleges ár egyedi ajánlat alapján készül.',
      details: `${from} → ${to} · kb. ${distance} km · ${tierLabel}`,
    });
  });
}
