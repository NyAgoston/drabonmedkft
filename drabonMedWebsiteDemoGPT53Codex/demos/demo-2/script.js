const content = window.drabonMedContent;

const byPath = (obj, path) => path.split('.').reduce((acc, key) => acc?.[key], obj);
const formatCurrency = (value) =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(value);

const setTextBindings = () => {
  document.querySelectorAll('[data-content]').forEach((node) => {
    const value = byPath(content, node.getAttribute('data-content'));
    if (value) node.textContent = value;
  });
};

const renderHighlights = () => {
  const root = document.querySelector('[data-highlights]');
  if (!root) return;
  content.metrics.forEach((metric) => {
    const card = document.createElement('article');
    card.className = 'info-card reveal';
    card.innerHTML = `<strong>${metric.value}</strong><p>${metric.label}</p>`;
    root.appendChild(card);
  });
};

const renderServiceCards = () => {
  const root = document.querySelector('[data-service-cards]');
  if (!root) return;
  content.services.forEach((service) => {
    const card = document.createElement('article');
    card.className = 'feature-card reveal';
    card.innerHTML = `
      <span class="eyebrow">Szolgáltatás</span>
      <h3>${service.title}</h3>
      <p>${service.summary}</p>
      <ul>${service.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
    root.appendChild(card);
  });
};

const renderAbout = () => {
  const root = document.querySelector('[data-about-copy]');
  if (!root) return;
  const paragraphs = content.intro.concat([
    'Pályafutásunk során mindig a megfelelő megoldás és a közös út kiválasztására törekedtünk.',
    'Rendezvényeikkel és céges elsősegély oktatásaikkal kapcsolatban forduljanak hozzánk bizalommal.'
  ]);
  paragraphs.forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    root.appendChild(p);
  });
};

const renderPricing = () => {
  const root = document.querySelector('[data-pricing-highlights]');
  if (!root) return;
  content.pricing.highlights.forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    root.appendChild(li);
  });
};

const renderLegal = () => {
  document.querySelectorAll('[data-legal]').forEach((target) => {
    const key = target.getAttribute('data-legal');
    content.legal[key].forEach((entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      target.appendChild(li);
    });
  });
};

const renderContact = () => {
  const root = document.querySelector('[data-contact-stack]');
  if (!root) return;
  [
    ['Ügyfélszolgálat', content.contact.serviceHours],
    ['Ügyvezető', content.contact.phonePrimary],
    ['Kapcsolati koordinátor', content.contact.phoneSecondary],
    ['E-mail', content.contact.email],
    ['Cím', content.contact.address]
  ].forEach(([label, value]) => {
    const article = document.createElement('article');
    article.className = 'contact-item';
    article.innerHTML = `<strong>${label}</strong><p>${value}</p>`;
    root.appendChild(article);
  });
};

const renderCalculator = () => {
  const form = document.querySelector('#distance-form');
  if (!form) return;

  const routes = new Map();
  const places = new Set();
  content.calculatorMock.sampleRoutes.forEach((route) => {
    routes.set(`${route.from}__${route.to}`, route.km);
    routes.set(`${route.to}__${route.from}`, route.km);
    places.add(route.from);
    places.add(route.to);
  });

  const options = ['<option value="">Válasszon…</option>']
    .concat([...places].map((place) => `<option value="${place}">${place}</option>`))
    .join('');

  form.elements.from.innerHTML = options;
  form.elements.to.innerHTML = options;

  const resultPrice = document.querySelector('#result-price');
  const resultMeta = document.querySelector('#result-meta');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const from = form.elements.from.value;
    const to = form.elements.to.value;
    const serviceType = form.elements.serviceType.value;

    if (!from || !to || from === to) {
      resultPrice.textContent = '—';
      resultMeta.textContent = 'Kérjük, válasszon két különböző helyet.';
      return;
    }

    const baseKm = routes.get(`${from}__${to}`) ?? Math.max(20, Math.abs(from.length - to.length) * 17 + 24);
    const surcharge = serviceType === 'guarded' ? 1.35 : 1;
    const estimate = Math.round((content.calculatorMock.baseFee + baseKm * content.calculatorMock.pricePerKm) * surcharge);

    resultPrice.textContent = formatCurrency(estimate);
    resultMeta.textContent = `${from} → ${to} · kb. ${baseKm} km · ${serviceType === 'guarded' ? 'őrzött' : 'normál'} szállítás`;
  });
};

const enableReveal = () => {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((item) => observer.observe(item));
};

setTextBindings();
renderHighlights();
renderServiceCards();
renderAbout();
renderPricing();
renderLegal();
renderContact();
renderCalculator();
enableReveal();
