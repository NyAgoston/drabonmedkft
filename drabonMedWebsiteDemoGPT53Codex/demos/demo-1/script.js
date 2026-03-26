const content = window.drabonMedContent;

const formatCurrency = (value) =>
  new Intl.NumberFormat('hu-HU', {
    style: 'currency',
    currency: 'HUF',
    maximumFractionDigits: 0
  }).format(value);

const contentBindings = document.querySelectorAll('[data-content]');
contentBindings.forEach((node) => {
  const path = node.getAttribute('data-content').split('.');
  const value = path.reduce((acc, key) => acc?.[key], content);
  if (value) node.textContent = value;
});

const metricsRoot = document.querySelector('[data-metrics]');
content.metrics.forEach((metric) => {
  const wrapper = document.createElement('div');
  const title = document.createElement('dt');
  const value = document.createElement('dd');
  title.textContent = metric.label;
  value.textContent = metric.value;
  wrapper.append(title, value);
  metricsRoot.appendChild(wrapper);
});

const introRoot = document.querySelector('[data-intro]');
content.intro.forEach((paragraph, index) => {
  const card = document.createElement('article');
  card.className = 'intro-card reveal-on-scroll';
  card.innerHTML = `
    <span class="eyebrow">0${index + 1}</span>
    <p>${paragraph}</p>
  `;
  introRoot.appendChild(card);
});

const servicesRoot = document.querySelector('[data-services]');
content.services.forEach((service) => {
  const article = document.createElement('article');
  article.className = 'service-card reveal-on-scroll';
  const points = service.points.map((point) => `<li>${point}</li>`).join('');
  article.innerHTML = `
    <span class="eyebrow">Szolgáltatás</span>
    <h3>${service.title}</h3>
    <p>${service.summary}</p>
    <ul>${points}</ul>
  `;
  servicesRoot.appendChild(article);
});

const aboutRoot = document.querySelector('[data-about]');
content.intro.concat([
  'Céges eszközparkunkat folyamatosan fejlesztjük, hogy a betegek korszerű eszközökkel kapjanak ellátást.',
  'Szakmai programokon és eseményeken való jelenléttel tartjuk naprakészen tudásunkat.'
]).forEach((paragraph) => {
  const text = document.createElement('p');
  text.textContent = paragraph;
  aboutRoot.appendChild(text);
});

const pricingRoot = document.querySelector('[data-pricing]');
const pricingLead = document.createElement('article');
pricingLead.innerHTML = `<strong>${content.pricing.title}</strong><p>${content.pricing.description}</p>`;
pricingRoot.appendChild(pricingLead);
content.pricing.highlights.forEach((item) => {
  const article = document.createElement('article');
  article.innerHTML = `<p>${item}</p>`;
  pricingRoot.appendChild(article);
});

const legalTargets = document.querySelectorAll('[data-legal]');
legalTargets.forEach((target) => {
  const key = target.getAttribute('data-legal');
  content.legal[key].forEach((entry) => {
    const li = document.createElement('li');
    li.textContent = entry;
    target.appendChild(li);
  });
});

const contactRoot = document.querySelector('[data-contact]');
[
  ['Ügyfélszolgálat', content.contact.serviceHours],
  ['Telefon · ügyvezető', content.contact.phonePrimary],
  ['Telefon · kapcsolati koordinátor', content.contact.phoneSecondary],
  ['E-mail', content.contact.email],
  ['Cím', content.contact.address]
].forEach(([label, value]) => {
  const article = document.createElement('article');
  article.innerHTML = `<strong>${label}</strong><span>${value}</span>`;
  contactRoot.appendChild(article);
});

const routeMap = new Map();
const locationSet = new Set();
content.calculatorMock.sampleRoutes.forEach((route) => {
  routeMap.set(`${route.from}__${route.to}`, route.km);
  routeMap.set(`${route.to}__${route.from}`, route.km);
  locationSet.add(route.from);
  locationSet.add(route.to);
});
const locations = [...locationSet];

const form = document.querySelector('#distance-form');
const fromSelect = form.elements.from;
const toSelect = form.elements.to;
const serviceTypeSelect = form.elements.serviceType;
const resultPrice = document.querySelector('#result-price');
const resultMeta = document.querySelector('#result-meta');

const renderOptions = (select) => {
  select.innerHTML = ['<option value="">Válasszon…</option>']
    .concat(locations.map((location) => `<option value="${location}">${location}</option>`))
    .join('');
};

renderOptions(fromSelect);
renderOptions(toSelect);

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const from = fromSelect.value;
  const to = toSelect.value;
  const serviceType = serviceTypeSelect.value;

  if (!from || !to || from === to) {
    resultPrice.textContent = '—';
    resultMeta.textContent = 'Kérjük, két különböző helyet válasszon.';
    return;
  }

  const fallbackKm = Math.max(18, Math.abs(from.charCodeAt(0) - to.charCodeAt(0)) * 4);
  const km = routeMap.get(`${from}__${to}`) ?? fallbackKm;
  const guardedMultiplier = serviceType === 'guarded' ? 1.35 : 1;
  const estimate = Math.round((content.calculatorMock.baseFee + km * content.calculatorMock.pricePerKm) * guardedMultiplier);

  resultPrice.textContent = formatCurrency(estimate);
  resultMeta.textContent = `${from} → ${to} · kb. ${km} km · ${serviceType === 'guarded' ? 'őrzött' : 'normál'} betegszállítás`;
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.16
  }
);

document.querySelectorAll('.reveal-on-scroll').forEach((element) => observer.observe(element));
