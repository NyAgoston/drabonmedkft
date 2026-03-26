const content = window.drabonMedContent;

const getPath = (source, path) => path.split('.').reduce((acc, key) => acc?.[key], source);
const formatCurrency = (value) =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(value);

const fillText = () => {
  document.querySelectorAll('[data-content]').forEach((node) => {
    const value = getPath(content, node.getAttribute('data-content'));
    if (value) node.textContent = value;
  });
};

const renderIntro = () => {
  const root = document.querySelector('[data-intro-cards]');
  if (!root) return;
  const cards = [
    'Üdvözli Önt a Drabon Med Egészségügyi Szolgáltató Kft. ügyvezetője, Drabon József.',
    'Célunk a megfelelő, pontos és precíz egészségügyi szolgáltatások nyújtása ügyfeleink részére.',
    'Segítünk eligazodni abban, milyen szolgáltatásra van szükség és hogyan érdemes elindulni.'
  ];
  cards.forEach((text) => {
    const article = document.createElement('article');
    article.className = 'reveal';
    article.innerHTML = `<p>${text}</p>`;
    root.appendChild(article);
  });
};

const renderServices = () => {
  const root = document.querySelector('[data-service-cards]');
  if (!root) return;
  content.services.forEach((service) => {
    const card = document.createElement('article');
    card.className = 'service-card reveal';
    card.innerHTML = `
      <h3>${service.title}</h3>
      <p>${service.summary}</p>
      <ul>${service.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
    root.appendChild(card);
  });
};

const renderPricing = () => {
  const root = document.querySelector('[data-pricing-box]');
  if (!root) return;
  root.innerHTML = `
    <strong>${content.pricing.title}</strong>
    <p>${content.pricing.description}</p>
    <ul>${content.pricing.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
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
  const root = document.querySelector('[data-contact-list]');
  if (!root) return;
  [
    ['Ügyfélszolgálat', content.contact.serviceHours],
    ['Telefon · ügyvezető', content.contact.phonePrimary],
    ['Telefon · kapcsolati koordinátor', content.contact.phoneSecondary],
    ['E-mail', content.contact.email],
    ['Cím', content.contact.address]
  ].forEach(([label, value]) => {
    const article = document.createElement('article');
    article.innerHTML = `<strong>${label}</strong><p>${value}</p>`;
    root.appendChild(article);
  });
};

const setupCalculator = () => {
  const form = document.querySelector('#distance-form');
  if (!form) return;

  const routeMap = new Map();
  const locations = new Set();
  content.calculatorMock.sampleRoutes.forEach((route) => {
    routeMap.set(`${route.from}__${route.to}`, route.km);
    routeMap.set(`${route.to}__${route.from}`, route.km);
    locations.add(route.from);
    locations.add(route.to);
  });

  const options = ['<option value="">Válasszon…</option>']
    .concat([...locations].map((location) => `<option value="${location}">${location}</option>`))
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

    const km = routeMap.get(`${from}__${to}`) ?? Math.max(20, Math.abs(from.length - to.length) * 16 + 22);
    const multiplier = serviceType === 'guarded' ? 1.35 : 1;
    const estimate = Math.round((content.calculatorMock.baseFee + km * content.calculatorMock.pricePerKm) * multiplier);

    resultPrice.textContent = formatCurrency(estimate);
    resultMeta.textContent = `${from} → ${to} · kb. ${km} km · ${serviceType === 'guarded' ? 'őrzött' : 'normál'} betegszállítás`;
  });
};

const setupReveal = () => {
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

fillText();
renderIntro();
renderServices();
renderPricing();
renderLegal();
renderContact();
setupCalculator();
setupReveal();
