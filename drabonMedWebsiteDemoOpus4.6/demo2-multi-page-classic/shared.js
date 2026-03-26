/* ==========================================
   DEMO 2 — Shared JS
   Tabs, hamburger, calculator
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Hamburger mobile menu ----
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // ---- Tabs (Services page) ----
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    if (tabs.length) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                tab.classList.add('active');
                const target = document.getElementById(tab.dataset.target);
                if (target) target.classList.add('active');
            });
        });

        // Check hash
        const hash = window.location.hash.replace('#', '');
        if (hash) {
            const matchTab = document.querySelector(`.tab[data-target="${hash}"]`);
            if (matchTab) matchTab.click();
        }
    }

    // ---- Price Calculator (Mock) ----
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        const originInput = document.getElementById('origin');
        const destInput = document.getElementById('destination');
        const calcResult = document.getElementById('calcResult');
        const resultDistance = document.getElementById('resultDistance');
        const resultTime = document.getElementById('resultTime');
        const resultPrice = document.getElementById('resultPrice');

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

        function getDist(a, b) {
            const an = norm(a), bn = norm(b);
            if (an === bn) return 0;
            for (const [c, d] of Object.entries(mockDistances)) {
                if (norm(c) === an) { for (const [e, km] of Object.entries(d)) { if (norm(e) === bn) return km; } }
            }
            return Math.floor(Math.random() * 250) + 30;
        }

        function fmtHUF(n) { return n.toLocaleString('hu-HU') + ' Ft'; }

        calcBtn.addEventListener('click', () => {
            const from = originInput.value.trim();
            const to = destInput.value.trim();
            if (!from || !to) { alert('Kérem adja meg az indulási és érkezési pontot!'); return; }

            const dist = getDist(from, to);
            const mins = Math.round((dist / AVG_SPEED) * 60);
            const h = Math.floor(mins / 60), m = mins % 60;
            const price = BASE_FEE + dist * PER_KM;

            resultDistance.textContent = `${dist} km`;
            resultTime.textContent = h > 0 ? `${h} óra ${m} perc` : `${m} perc`;
            resultPrice.textContent = fmtHUF(price);

            calcResult.style.display = 'block';
            calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    // ---- Scroll fade-in observer ----
    const fadeEls = document.querySelectorAll('.fade-in, .fade-in-right');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.animationPlayState = 'running';
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(el => {
            el.style.animationPlayState = 'paused';
            obs.observe(el);
        });
    }
});
