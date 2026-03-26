/* ==========================================
   DEMO 3 — Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Nav scroll ----
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 80);
    });

    // ---- Mobile menu ----
    const menuToggle = document.getElementById('menuToggle');
    const navCenter = document.getElementById('navCenter');
    menuToggle.addEventListener('click', () => {
        navCenter.classList.toggle('open');
    });
    navCenter.querySelectorAll('a').forEach(l => l.addEventListener('click', () => navCenter.classList.remove('open')));

    // ---- Scroll reveal ----
    const reveals = document.querySelectorAll('.reveal-left, .reveal-right, .reveal-up');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => observer.observe(el));

    // ---- Calculator ----
    const calcBtn = document.getElementById('calcBtn');
    if (calcBtn) {
        const origin = document.getElementById('origin');
        const dest = document.getElementById('destination');
        const result = document.getElementById('calcResult');
        const resDist = document.getElementById('resDist');
        const resTime = document.getElementById('resTime');
        const resPrice = document.getElementById('resPrice');

        const distances = {
            'budapest': { 'debrecen': 230, 'szeged': 170, 'miskolc': 180, 'pecs': 200, 'gyor': 120, 'kecskemet': 90, 'kondo': 160, 'eger': 130 },
            'debrecen': { 'budapest': 230, 'miskolc': 70, 'nyiregyhaza': 50, 'kondo': 90 },
            'miskolc': { 'budapest': 180, 'debrecen': 70, 'eger': 65, 'kondo': 15 },
            'kondo': { 'budapest': 160, 'miskolc': 15, 'eger': 55, 'debrecen': 90 },
            'eger': { 'budapest': 130, 'miskolc': 65, 'kondo': 55 },
            'szeged': { 'budapest': 170, 'kecskemet': 80, 'kondo': 280 },
        };

        function n(s) { return s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''); }
        function getDist(a,b) {
            const an=n(a), bn=n(b);
            if(an===bn) return 0;
            for(const[c,d] of Object.entries(distances)){ if(n(c)===an){ for(const[e,km] of Object.entries(d)){ if(n(e)===bn) return km; } } }
            return Math.floor(Math.random()*250)+30;
        }

        calcBtn.addEventListener('click', () => {
            const f = origin.value.trim(), t = dest.value.trim();
            if(!f||!t){ alert('Kérem adja meg mindkét pontot!'); return; }
            const d = getDist(f,t);
            const mins = Math.round((d/70)*60), h=Math.floor(mins/60), m=mins%60;
            const price = 8000 + d*450;
            resDist.textContent = d + ' km';
            resTime.textContent = h>0 ? `${h} ó ${m} p` : `${m} perc`;
            resPrice.textContent = price.toLocaleString('hu-HU') + ' Ft';
            result.classList.add('show');
            result.scrollIntoView({ behavior:'smooth', block:'nearest' });
        });
    }
});
