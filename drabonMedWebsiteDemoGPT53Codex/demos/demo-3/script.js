const content = window.drabonMedContent;

const getByPath = (source, path) => path.split('.').reduce((acc, key) => acc?.[key], source);
const formatCurrency = (value) =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(value);

const bindText = () => {
  document.querySelectorAll('[data-content]').forEach((node) => {
    const value = getByPath(content, node.getAttribute('data-content'));
    if (value) node.textContent = value;
  });
};

const renderStory = () => {
  const root = document.querySelector('[data-story-columns]');
  if (!root) return;
  const storyBlocks = [
    'Köszöntjük a Drabon Med Egészségügyi Szolgáltató Kft. oldalán. Célunk a pontos és precíz egészségügyi szolgáltatások nyújtása ügyfeleink részére.',
    'Segítünk eligazodni a rendezvények egészségügyi biztosításának szükségességében, és támogatjuk a megfelelő szolgáltatási szint kiválasztását.',
    'Elsősegély oktatás, betegszállítás és egészségügyi helyiségek kialakítása esetén is a közös, jól működő megoldást keressük.',
    'Eszközparkunk folyamatos fejlesztésével és szakmai jelenléttel törekszünk a korszerű, biztonságos működésre.'
  ];

  storyBlocks.forEach((text, index) => {
    const article = document.createElement('article');
    article.className = 'reveal fade-up';
    article.innerHTML = `<span class="eyebrow">0${index + 1}</span><p>${text}</p>`;
    root.appendChild(article);
  });
};

const renderServices = () => {
  const root = document.querySelector('[data-service-editorial]');
  if (!root) return;
  content.services.forEach((service, index) => {
    const card = document.createElement('article');
    card.className = 'editorial-card reveal fade-up';
    card.innerHTML = `
      <div class="service-index">0${index + 1}</div>
      <div>
        <span class="eyebrow">${service.title}</span>
        <h3>${service.summary}</h3>
        <ul>${service.points.map((point) => `<li>${point}</li>`).join('')}</ul>
      </div>
    `;
    root.appendChild(card);
  });
};

const renderPricing = () => {
  const root = document.querySelector('[data-pricing-notes]');
  if (!root) return;
  [content.pricing.description].concat(content.pricing.highlights).forEach((entry) => {
    const article = document.createElement('article');
    article.innerHTML = `<p>${entry}</p>`;
    root.appendChild(article);
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
  const root = document.querySelector('[data-contact-cards]');
  if (!root) return;
  [
    ['Ügyfélszolgálat', content.contact.serviceHours],
    ['Telefonszám · ügyvezető', content.contact.phonePrimary],
    ['Telefonszám · koordinátor', content.contact.phoneSecondary],
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
  const places = new Set();
  content.calculatorMock.sampleRoutes.forEach((route) => {
    routeMap.set(`${route.from}__${route.to}`, route.km);
    routeMap.set(`${route.to}__${route.from}`, route.km);
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

    const km = routeMap.get(`${from}__${to}`) ?? Math.max(24, Math.abs(from.length - to.length) * 15 + 30);
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
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
};

bindText();
renderStory();
renderServices();
renderPricing();
renderLegal();
renderContact();
setupCalculator();
setupReveal();
