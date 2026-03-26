/* ==========================================
   DEMO 7 — Red Medical Multi-Page JS
   Hamburger menu, calculator, animations
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    /* ---- Hamburger menu ---- */
    const burger = document.querySelector('.burger');
    const navMenu = document.querySelector('.nav-menu');
    if (burger && navMenu) {
        burger.addEventListener('click', () => {
            burger.classList.toggle('active');
            navMenu.classList.toggle('mobile-open');
        });
    }

    /* ---- Scroll-in animations ---- */
    const reveals = document.querySelectorAll('.fade-in, .fade-in-right, .qs-card, .svc-block, .reg-card-v, .contact-card-v');
    if (reveals.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translate(0)';
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        reveals.forEach(el => {
            el.style.opacity = '0';
            el.style.transition = 'opacity .6s ease, transform .6s ease';
            if (el.classList.contains('fade-in-right')) {
                el.style.transform = 'translateX(30px)';
            } else {
                el.style.transform = 'translateY(24px)';
            }
            io.observe(el);
        });
    }

    /* ---- Distance Price Calculator ---- */
    const calcBtn = document.getElementById('calcBtn');
    if (!calcBtn) return;

    const BASE_FEE = 8000;
    const PER_KM = 450;
    const AVG_SPEED = 70;

    const DISTANCES = {
        'budapest': { 'debrecen': 230, 'miskolc': 180, 'kondo': 170, 'eger': 130, 'szeged': 170, 'gyor': 121, 'pecs': 200, 'nyiregyhaza': 230, 'szolnok': 120, 'kecskemet': 90, 'szekesfehervar': 65, 'veszprem': 115 },
        'debrecen': { 'budapest': 230, 'miskolc': 100, 'kondo': 90, 'eger': 130, 'szeged': 230, 'nyiregyhaza': 50, 'szolnok': 120 },
        'miskolc': { 'budapest': 180, 'debrecen': 100, 'kondo': 15, 'eger': 60, 'szeged': 270, 'nyiregyhaza': 110, 'szolnok': 130 },
        'kondo': { 'budapest': 170, 'debrecen': 90, 'miskolc': 15, 'eger': 55, 'szeged': 260, 'nyiregyhaza': 100, 'szolnok': 120 },
        'eger': { 'budapest': 130, 'debrecen': 130, 'miskolc': 60, 'kondo': 55, 'szeged': 230, 'szolnok': 100 },
        'szeged': { 'budapest': 170, 'debrecen': 230, 'miskolc': 270, 'kondo': 260, 'eger': 230, 'kecskemet': 80, 'pecs': 210 },
        'gyor': { 'budapest': 121, 'szekesfehervar': 80, 'veszprem': 85 },
        'pecs': { 'budapest': 200, 'szeged': 210, 'szekesfehervar': 180 },
        'nyiregyhaza': { 'budapest': 230, 'debrecen': 50, 'miskolc': 110, 'kondo': 100 },
        'szolnok': { 'budapest': 120, 'debrecen': 120, 'miskolc': 130, 'kondo': 120, 'eger': 100, 'kecskemet': 75 },
        'kecskemet': { 'budapest': 90, 'szeged': 80, 'szolnok': 75 },
        'szekesfehervar': { 'budapest': 65, 'gyor': 80, 'pecs': 180, 'veszprem': 45 },
        'veszprem': { 'budapest': 115, 'gyor': 85, 'szekesfehervar': 45 }
    };

    function normalise(str) {
        return str.toLowerCase().trim()
            .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
            .replace(/ó|ö|ő/g, 'o').replace(/ú|ü|ű/g, 'u');
    }

    function findCity(raw) {
        const n = normalise(raw);
        for (const city of Object.keys(DISTANCES)) {
            if (city === n || city.startsWith(n) || n.startsWith(city)) return city;
        }
        return null;
    }

    function getDistance(a, b) {
        if (a === b) return 0;
        return (DISTANCES[a] && DISTANCES[a][b]) || (DISTANCES[b] && DISTANCES[b][a]) || null;
    }

    calcBtn.addEventListener('click', () => {
        const originIn = document.getElementById('origin');
        const destIn = document.getElementById('destination');
        const resultDiv = document.getElementById('calcResult');
        if (!originIn || !destIn || !resultDiv) return;

        const orig = findCity(originIn.value);
        const dest = findCity(destIn.value);

        if (!orig || !dest) {
            resultDiv.innerHTML = '<p style="text-align:center;color:var(--red);font-weight:600;padding:20px;">A megadott városok nem találhatók az adatbázisunkban. Próbálja: Budapest, Debrecen, Miskolc, Kondó, Eger, Szeged, Győr, Pécs, Nyíregyháza, Szolnok, Kecskemét, Székesfehérvár, Veszprém.</p>';
            resultDiv.style.display = 'block';
            return;
        }

        const km = getDistance(orig, dest);
        if (km === null) {
            resultDiv.innerHTML = '<p style="text-align:center;color:var(--red);font-weight:600;padding:20px;">Nincs közvetlen útvonal a két város között az adatbázisunkban. Kérjük, hívjon minket az egyedi árajánlatért!</p>';
            resultDiv.style.display = 'block';
            return;
        }

        if (km === 0) {
            resultDiv.innerHTML = '<p style="text-align:center;color:var(--red);font-weight:600;padding:20px;">Az indulási és célpont azonos! Kérjük, adjon meg két különböző várost.</p>';
            resultDiv.style.display = 'block';
            return;
        }

        const price = BASE_FEE + km * PER_KM;
        const minutes = Math.round((km / AVG_SPEED) * 60);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeStr = hours > 0 ? `${hours} óra ${mins} perc` : `${mins} perc`;
        const priceStr = price.toLocaleString('hu-HU') + ' Ft';

        resultDiv.innerHTML = `
            <h3>✚ Kalkuláció eredménye</h3>
            <div class="cr-grid">
                <div class="cr-item"><span>Távolság</span><strong>${km} km</strong></div>
                <div class="cr-item"><span>Becsült idő</span><strong>${timeStr}</strong></div>
                <div class="cr-item cr-main"><span>Becsült ár</span><strong>${priceStr}</strong></div>
            </div>
            <p class="cr-note">Alapdíj: ${BASE_FEE.toLocaleString('hu-HU')} Ft + ${PER_KM} Ft/km · A végső ár egyedi megállapodás alapján változhat.</p>
            <a href="tel:+36304561678" class="btn btn-primary">📞 Ajánlatot kérek</a>
        `;
        resultDiv.style.display = 'block';
    });
});
