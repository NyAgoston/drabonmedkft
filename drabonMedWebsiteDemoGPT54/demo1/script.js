const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const yearTarget = document.getElementById('year');
const revealElements = document.querySelectorAll('.reveal');
const priceForm = document.getElementById('price-form');
const resultCard = document.getElementById('calculator-result');

const distanceMatrix = {
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

const serviceFees = {
  standard: 420,
  guarded: 620,
  event: 780,
};

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
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
  { threshold: 0.16 }
);

revealElements.forEach((element) => revealObserver.observe(element));

function getDistance(from, to) {
  if (!from || !to) {
    return null;
  }

  if (from === to) {
    return 5;
  }

  const sortedKey = [from, to].sort((a, b) => a.localeCompare(b, 'hu')).join('-');
  return distanceMatrix[sortedKey] ?? 95;
}

function formatCurrency(value) {
  return new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0,
  }).format(value);
}

function renderResult(message, amount = null, meta = '') {
  if (!resultCard) {
    return;
  }

  const amountMarkup = amount === null ? '—' : formatCurrency(amount);

  resultCard.innerHTML = `
    <p class="calculator-result__label">Becsült díj</p>
    <strong>${amountMarkup}</strong>
    <span>${message}</span>
    ${meta ? `<small>${meta}</small>` : ''}
  `;
}

if (priceForm) {
  priceForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(priceForm);
    const from = formData.get('from-location');
    const to = formData.get('to-location');
    const tier = formData.get('service-tier');

    if (!from || !to) {
      renderResult('Kérjük, válassza ki mindkét helyszínt.');
      return;
    }

    const distance = getDistance(String(from), String(to));
    const baseFee = 18000;
    const perKmFee = serviceFees[String(tier)] ?? serviceFees.standard;
    const total = baseFee + distance * perKmFee;

    renderResult(
      `A kalkuláció jelenleg demó becslés. A végleges ár egyedi ajánlat alapján készül.`,
      total,
      `${String(from)} → ${String(to)} · kb. ${distance} km · ${tier === 'guarded' ? 'őrzött betegszállítás' : tier === 'event' ? 'rendezvénybiztosítási kiszállás' : 'általános betegszállítás'}`
    );
  });
}
