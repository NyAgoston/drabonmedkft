const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealElements = document.querySelectorAll('.reveal');
const yearTarget = document.getElementById('year');
const priceForm = document.getElementById('price-form');
const estimateBox = document.getElementById('calculator-result');

const distanceMap = {
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

const priceRates = {
  standard: 410,
  guarded: 600,
  event: 755,
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
  return distanceMap[key] ?? 98;
}

function formatHuf(amount) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(amount);
}

function renderEstimate({ amount = null, description, details = '' }) {
  if (!estimateBox) {
    return;
  }

  estimateBox.innerHTML = `
    <p class="estimate-box__label">Becsült díj</p>
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
      renderEstimate({ description: 'Kérjük, válassza ki az indulási és az érkezési pontot is.' });
      return;
    }

    const distance = getDistance(from, to);
    const total = 16500 + distance * (priceRates[tier] ?? priceRates.standard);
    const tierLabel =
      tier === 'guarded'
        ? 'őrzött betegszállítás'
        : tier === 'event'
          ? 'rendezvénybiztosítási kiszállás'
          : 'általános betegszállítás';

    renderEstimate({
      amount: total,
      description: 'A kalkuláció demó célú előzetes becslés, a végleges ár minden esetben egyedi ajánlat alapján készül.',
      details: `${from} → ${to} · kb. ${distance} km · ${tierLabel}`,
    });
  });
}
