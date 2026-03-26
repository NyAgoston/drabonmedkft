/* ==========================================
   DEMO 6 — Red Medical Single Page Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll ----
    const navbar = document.getElementById('navbar');
    const floatingBtn = document.getElementById('floatingBtn');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (floatingBtn) floatingBtn.classList.toggle('visible', window.scrollY > 500);
    });

    // ---- Mobile menu ----
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobileOverlay');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        overlay.classList.toggle('open');
        document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
    });
    overlay.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            hamburger.classList.remove('active');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Scroll reveal ----
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                const idx = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${idx * 0.08}s`;
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));

    // ---- Calculator ----
    const calcBtn = document.getElementById('calcBtn');
    const originInput = document.getElementById('origin');
    const destInput = document.getElementById('destination');
    const calcResult = document.getElementById('calcResult');
    const resDist = document.getElementById('resDist');
    const resTime = document.getElementById('resTime');
    const resPrice = document.getElementById('resPrice');

    const mockDistances = {
        'budapest': { 'debrecen': 230, 'szeged': 170, 'miskolc': 180, 'pecs': 200, 'gyor': 120, 'kecskemet': 90, 'nyiregyhaza': 250, 'eger': 130, 'kondo': 160 },
        'debrecen': { 'budapest': 230, 'miskolc': 70, 'nyiregyhaza': 50, 'szeged': 230, 'eger': 130, 'kondo': 90 },
        'miskolc': { 'budapest': 180, 'debrecen': 70, 'eger': 65, 'kondo': 15, 'nyiregyhaza': 110 },
        'kondo': { 'budapest': 160, 'miskolc': 15, 'eger': 55, 'debrecen': 90, 'szeged': 280 },
        'eger': { 'budapest': 130, 'miskolc': 65, 'kondo': 55, 'debrecen': 130 },
        'szeged': { 'budapest': 170, 'kecskemet': 80, 'debrecen': 230, 'pecs': 180, 'kondo': 280 },
    };

    const BASE_FEE = 8000;
    const PER_KM = 450;
    const AVG_SPEED = 70;

    function norm(s) {
        return s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
    }

    function getDist(from, to) {
        const fn = norm(from), tn = norm(to);
        if (fn === tn) return 0;
        for (const [city, dests] of Object.entries(mockDistances)) {
            if (norm(city) === fn) {
                for (const [dest, km] of Object.entries(dests)) {
                    if (norm(dest) === tn) return km;
                }
            }
        }
        return Math.floor(Math.random() * 250) + 30;
    }

    calcBtn.addEventListener('click', () => {
        const from = originInput.value.trim();
        const to = destInput.value.trim();
        if (!from || !to) { alert('Kérem adja meg az indulási és érkezési pontot!'); return; }

        const dist = getDist(from, to);
        const mins = Math.round((dist / AVG_SPEED) * 60);
        const h = Math.floor(mins / 60), m = mins % 60;
        const price = BASE_FEE + dist * PER_KM;

        resDist.textContent = `${dist} km`;
        resTime.textContent = h > 0 ? `${h} óra ${m} perc` : `${m} perc`;
        resPrice.textContent = price.toLocaleString('hu-HU') + ' Ft';

        calcResult.style.display = 'block';
        calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
});
