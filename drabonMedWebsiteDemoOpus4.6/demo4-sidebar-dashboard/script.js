/* ==========================================
   DEMO 4 — Script
   SPA-style page switching, sidebar, calc
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Page switching via sidebar links ----
    const sideLinks = document.querySelectorAll('.side-link');
    const pages = document.querySelectorAll('.page');

    function showPage(id) {
        pages.forEach(p => p.style.display = p.id === id ? 'block' : 'none');
        sideLinks.forEach(l => l.classList.toggle('active', l.dataset.section === id));
        window.scrollTo(0, 0);
    }

    sideLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            showPage(link.dataset.section);
            // close mobile sidebar
            sidebar.classList.remove('open');
            mobToggle.classList.remove('active');
        });
    });

    // Also handle in-page links (e.g. "Szolgáltatásaink →")
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            const id = a.getAttribute('href').replace('#', '');
            const page = document.getElementById(id);
            if (page && page.classList.contains('page')) {
                e.preventDefault();
                showPage(id);
            }
        });
    });

    // ---- Mobile toggle ----
    const sidebar = document.getElementById('sidebar');
    const mobToggle = document.getElementById('mobToggle');
    mobToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        mobToggle.classList.toggle('active');
    });

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

        function n(s) { return s.toLowerCase().trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z]/g,''); }
        function gd(a,b) {
            const an=n(a), bn=n(b);
            if(an===bn) return 0;
            for(const[c,d] of Object.entries(dists)) if(n(c)===an) for(const[e,km] of Object.entries(d)) if(n(e)===bn) return km;
            return Math.floor(Math.random()*250)+30;
        }

        calcBtn.addEventListener('click', () => {
            const f=origin.value.trim(), t=dest.value.trim();
            if(!f||!t){ alert('Kérem adja meg mindkét pontot!'); return; }
            const d=gd(f,t), mins=Math.round((d/70)*60), h=Math.floor(mins/60), m=mins%60, price=8000+d*450;
            resDist.textContent = d+' km';
            resTime.textContent = h>0 ? `${h} ó ${m} p` : `${m} perc`;
            resPrice.textContent = price.toLocaleString('hu-HU')+' Ft';
            result.style.display = 'block';
        });
    }

    // Show home by default
    showPage('home');
});
