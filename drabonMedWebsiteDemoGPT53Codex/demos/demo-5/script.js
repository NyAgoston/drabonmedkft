const content = window.drabonMedContent;

const getByPath = (source, path) => path.split('.').reduce((acc, key) => acc?.[key], source);
const formatCurrency = (value) =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(value);

const bindContent = () => {
  document.querySelectorAll('[data-content]').forEach((node) => {
    const value = getByPath(content, node.getAttribute('data-content'));
    if (value) node.textContent = value;
  });
};

const renderHeroStats = () => {
  const root = document.querySelector('[data-hero-stats]');
  if (!root) return;
  content.metrics.forEach((metric) => {
    const article = document.createElement('article');
    article.innerHTML = `<strong>${metric.value}</strong><p>${metric.label}</p>`;
    root.appendChild(article);
  });
};

const renderOverview = () => {
  const root = document.querySelector('[data-overview-cards]');
  if (!root) return;
  const cards = [
    {
      title: 'Megbízható szervezettség',
      text: 'A szolgáltatások bemutatása rövid, hivatalos és könnyen értelmezhető szerkezetben jelenik meg.'
    },
    {
      title: 'Szolgáltatási sokoldalúság',
      text: 'Rendezvénybiztosítás, betegszállítás, elsősegély oktatás és elsősegélyhelyek kialakítása egy helyen.'
    },
    {
      title: 'Gyors kapcsolatfelvétel',
      text: 'A brochure jellegű felépítés végén jól látható kapcsolati blokkal zárja a döntési utat.'
    }
  ];
  cards.forEach((card) => {
    const article = document.createElement('article');
    article.className = 'reveal';
    article.innerHTML = `<strong>${card.title}</strong><p>${card.text}</p>`;
    root.appendChild(article);
  });
};

const renderServices = () => {
  const root = document.querySelector('[data-service-cards]');
  if (!root) return;
  content.services.forEach((service) => {
    const article = document.createElement('article');
    article.className = 'service-card reveal';
    article.innerHTML = `
      <h3>${service.title}</h3>
      <p>${service.summary}</p>
      <ul>${service.points.map((point) => `<li>${point}</li>`).join('')}</ul>
    `;
    root.appendChild(article);
  });
};

const renderTrust = () => {
  const root = document.querySelector('[data-trust-points]');
  if (!root) return;
  const points = [
    'Segítünk kiválasztani az esemény vagy szállítás típusához illő megfelelő szolgáltatási szintet.',
    'Folyamatos fejlesztéssel törekszünk korszerű eszközökkel és naprakész szakmai szemlélettel dolgozni.',
    'A kommunikációt rövid, világos döntési pontokra bontjuk, hogy az ajánlatkérés egyszerű maradjon.'
  ];
  points.forEach((point) => {
    const article = document.createElement('article');
    article.innerHTML = `<p>${point}</p>`;
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

const renderPricing = () => {
  const root = document.querySelector('[data-pricing-panel]');
  if (!root) return;
  root.innerHTML = `
    <strong>${content.pricing.title}</strong>
    <p>${content.pricing.description}</p>
    <ul>${content.pricing.highlights.map((item) => `<li>${item}</li>`).join('')}</ul>
  `;
};

const renderContact = () => {
  const root = document.querySelector('[data-contact-grid]');
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

    const km = routes.get(`${from}__${to}`) ?? Math.max(22, Math.abs(from.length - to.length) * 18 + 24);
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
    { threshold: 0.14 }
  );
  items.forEach((item) => observer.observe(item));
};

bindContent();
renderHeroStats();
renderOverview();
renderServices();
renderTrust();
renderLegal();
renderPricing();
renderContact();
setupCalculator();
setupReveal();
