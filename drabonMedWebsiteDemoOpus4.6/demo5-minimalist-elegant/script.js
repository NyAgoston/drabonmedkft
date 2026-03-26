/* ==========================================
   DEMO 5 — Script
   Accordion, nav, scroll, calculator
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Navbar scroll ----
    const topbar = document.getElementById('topbar');
    window.addEventListener('scroll', () => {
        topbar.classList.toggle('scrolled', window.scrollY > 40);
    });

    // ---- Mobile menu ----
    const tbMenu = document.getElementById('tbMenu');
    const tbLinks = document.getElementById('tbLinks');
    tbMenu.addEventListener('click', () => {
        tbMenu.classList.toggle('active');
        tbLinks.classList.toggle('open');
    });
    tbLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => {
        tbMenu.classList.remove('active');
        tbLinks.classList.remove('open');
    }));

    // ---- Accordion ----
    const accHeaders = document.querySelectorAll('.acc-header');
    accHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isOpen = item.classList.contains('open');
            // Close all
            document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
            // Toggle clicked
            if (!isOpen) item.classList.add('open');
        });
    });

    // ---- Scroll reveal ----
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        reveals.forEach(el => obs.observe(el));
    }

    // ---- Calculator ----
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        const origin = document.getElementById('origin');
        const dest = document.getElementById('destination');
        const result = document.getElementById('calcResult');
        const resDist = document.getElementById('resDist');
        const resTime = document.getElementById('resTime');
        const resPrice = document.getElementById('resPrice');

        const dists = {
            'budapest': { 'debrecen': 230, 'szeged': 170, 'miskolc': 180, 'pecs': 200, 'gyor': 120, 'kondo': 160, 'eger': 130 },
            'debrecen': { 'budapest': 230, 'miskolc': 70, 'kondo': 90 },
            'miskolc': { 'budapest': 180, 'debrecen': 70, 'eger': 65, 'kondo': 15 },
            'kondo': { 'budapest': 160, 'miskolc': 15, 'eger': 55, 'debrecen': 90 },
            'eger': { 'budapest': 130, 'miskolc': 65, 'kondo': 55 },
            'szeged': { 'budapest': 170, 'kondo': 280 },
        };

        function n(s) { return s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, ''); }
        function gd(a, b) {
            const an = n(a), bn = n(b);
            if (an === bn) return 0;
            for (const [c, d] of Object.entries(dists)) if (n(c) === an) for (const [e, km] of Object.entries(d)) if (n(e) === bn) return km;
            return Math.floor(Math.random() * 250) + 30;
        }

        calcBtn.addEventListener('click', () => {
            const f = origin.value.trim(), t = dest.value.trim();
            if (!f || !t) { alert('Kérem adja meg mindkét pontot!'); return; }
            const d = gd(f, t);
            const mins = Math.round((d / 70) * 60), h = Math.floor(mins / 60), m = mins % 60;
            const price = 8000 + d * 450;
            resDist.textContent = d + ' km';
            resTime.textContent = h > 0 ? `${h} óra ${m} perc` : `${m} perc`;
            resPrice.textContent = price.toLocaleString('hu-HU') + ' Ft';
            result.style.display = 'block';
            result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
});
