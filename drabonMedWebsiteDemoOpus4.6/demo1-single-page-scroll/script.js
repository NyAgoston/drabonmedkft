/* ==========================================
   DEMO 1 — Script
   Scroll animations, navbar, mobile menu,
   distance price calculator (mock)
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- Scroll reveal ----
    const reveals = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // stagger siblings
                const siblings = entry.target.parentElement.querySelectorAll('.scroll-reveal');
                const index = Array.from(siblings).indexOf(entry.target);
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObserver.observe(el));

    // ---- Navbar scroll style ----
    const navbar = document.getElementById('navbar');
    const floatingCta = document.getElementById('floatingCta');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY > 50;
        navbar.classList.toggle('scrolled', scrolled);
        if (floatingCta) {
            floatingCta.classList.toggle('visible', window.scrollY > 400);
        }
    });

    // ---- Mobile menu ----
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ---- Active nav link highlight ----
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(s => sectionObserver.observe(s));

    // ---- Price Calculator (Mock) ----
    const calcBtn = document.getElementById('calcBtn');
    const originInput = document.getElementById('origin');
    const destInput = document.getElementById('destination');
    const calcResult = document.getElementById('calcResult');
    const resultDistance = document.getElementById('resultDistance');
    const resultTime = document.getElementById('resultTime');
    const resultPrice = document.getElementById('resultPrice');

    // Mock city distances (km) — simplified
    const mockDistances = {
        'budapest': { 'debrecen': 230, 'szeged': 170, 'miskolc': 180, 'pécs': 200, 'győr': 120, 'kecskemét': 90, 'nyíregyháza': 250, 'eger': 130, 'kondó': 160 },
        'debrecen': { 'budapest': 230, 'miskolc': 70, 'nyíregyháza': 50, 'szeged': 230, 'eger': 130, 'kondó': 90 },
        'miskolc': { 'budapest': 180, 'debrecen': 70, 'eger': 65, 'kondó': 15, 'nyíregyháza': 110 },
        'kondó': { 'budapest': 160, 'miskolc': 15, 'eger': 55, 'debrecen': 90, 'szeged': 280 },
        'eger': { 'budapest': 130, 'miskolc': 65, 'kondó': 55, 'debrecen': 130 },
        'szeged': { 'budapest': 170, 'kecskemét': 80, 'debrecen': 230, 'pécs': 180, 'kondó': 280 },
    };

    // Pricing constants
    const BASE_FEE = 8000;       // HUF base fee
    const PER_KM_RATE = 450;     // HUF per km
    const AVG_SPEED_KMH = 70;    // average speed for time estimate

    function normalizeCity(str) {
        return str.toLowerCase().trim()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // remove accents
            .replace(/[^a-z]/g, '');
    }

    function getMockDistance(from, to) {
        const fromN = normalizeCity(from);
        const toN = normalizeCity(to);
        if (fromN === toN) return 0;
        // Check exact matches
        for (const [city, dests] of Object.entries(mockDistances)) {
            if (normalizeCity(city) === fromN) {
                for (const [dest, km] of Object.entries(dests)) {
                    if (normalizeCity(dest) === toN) return km;
                }
            }
        }
        // Fallback: random realistic distance
        return Math.floor(Math.random() * 250) + 30;
    }

    function formatHUF(num) {
        return num.toLocaleString('hu-HU') + ' Ft';
    }

    calcBtn.addEventListener('click', () => {
        const from = originInput.value.trim();
        const to = destInput.value.trim();

        if (!from || !to) {
            alert('Kérem adja meg az indulási és érkezési pontot!');
            return;
        }

        const distance = getMockDistance(from, to);
        const timeMinutes = Math.round((distance / AVG_SPEED_KMH) * 60);
        const hours = Math.floor(timeMinutes / 60);
        const mins = timeMinutes % 60;
        const price = BASE_FEE + (distance * PER_KM_RATE);

        resultDistance.textContent = `${distance} km`;
        resultTime.textContent = hours > 0 ? `${hours} óra ${mins} perc` : `${mins} perc`;
        resultPrice.textContent = formatHUF(price);

        calcResult.style.display = 'block';
        calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

});
