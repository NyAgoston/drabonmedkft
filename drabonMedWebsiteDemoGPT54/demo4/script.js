const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const revealElements = document.querySelectorAll('.reveal');
const yearTarget = document.getElementById('year');
const priceForm = document.getElementById('price-form');
const resultBox = document.getElementById('calculator-result');

const distances = {
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

const pricing = {
  standard: 400,
  guarded: 590,
  event: 740,
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

  const key = [from, to].sort((a, b) => a.localeCompare(b, 'hu')).join('-');
  return distances[key] ?? 95;
}

function formatHuf(amount) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderResult({ amount = null, description, details = '' }) {
  if (!resultBox) {
    return;
  }

  resultBox.innerHTML = `
    <p class="result-box__label">Becsült ár</p>
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
      renderResult({ description: 'Kérjük, válassza ki mindkét helyszínt.' });
      return;
    }

    const distance = getDistance(from, to);
    const total = 15000 + distance * (pricing[tier] ?? pricing.standard);
    const tierLabel =
      tier === 'guarded'
        ? 'őrzött betegszállítás'
        : tier === 'event'
          ? 'rendezvénybiztosítási kiszállás'
          : 'általános betegszállítás';

    renderResult({
      amount: total,
      description: 'Ez egy tájékoztató jellegű demó becslés. A végleges ár egyedi ajánlat alapján készül.',
      details: `${from} → ${to} · kb. ${distance} km · ${tierLabel}`,
    });
  });
}
