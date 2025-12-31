document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - v1.0.3');

    // --- Selectors ---
    const billingToggle = document.getElementById('billing-toggle');
    const basicBtn = document.getElementById('basic-plan-btn');
    const proBtn = document.getElementById('pro-plan-btn');
    const prices = document.querySelectorAll('.price[data-monthly]');
    const billingInfos = document.querySelectorAll('.billing-info');

    // --- Billing Logic ---
    function updatePrices() {
        if (!billingToggle) return;

        const isAnnual = billingToggle.checked;
        console.log('Updating Billing State - Annual:', isAnnual);

        // Update Prices
        prices.forEach(price => {
            const newValue = isAnnual ? price.getAttribute('data-annual') : price.getAttribute('data-monthly');
            price.textContent = newValue;
        });

        // Update Billing Info Text
        billingInfos.forEach(info => {
            if (info.textContent.includes('Cobrado')) {
                info.textContent = isAnnual ? 'Cobrado anualmente' : 'Cobrado mensalmente';
            }
        });

        // Update Payment Buttons
        [basicBtn, proBtn].forEach(btn => {
            if (btn) {
                const m = btn.getAttribute('data-monthly-href');
                const a = btn.getAttribute('data-annual-href');
                const target = isAnnual ? a : m;

                // Set both property and attribute for maximum compatibility
                btn.href = target;
                btn.setAttribute('href', target);

                console.log(`Updated ${btn.id}: ${target}`);
            }
        });
    }

    if (billingToggle) {
        // Initialize
        updatePrices();

        // Listeners
        billingToggle.addEventListener('change', () => {
            console.log('Toggle Change Event Fired');
            updatePrices();
        });

        // Redundant checks for slow-loading scripts or browser quirks
        window.addEventListener('load', updatePrices);
        setTimeout(updatePrices, 500);
        setTimeout(updatePrices, 2000);
    }

    // --- Smooth Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // --- FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // --- Intersection Observer (Animations) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up-active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .step, .plan-card, .section-title').forEach(el => {
        el.classList.add('fade-in-up-prepare');
        observer.observe(el);
    });

    // --- Carousel Logic ---
    const track = document.querySelector('.carousel-track');
    if (track) {
        const cards = document.querySelectorAll('.carousel-card');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-control.prev');
        const nextBtn = document.querySelector('.carousel-control.next');

        let currentSlide = 0;
        const slideInterval = 5000;
        let autoSlideInterval;

        function updateCarousel() {
            const containerWidth = document.querySelector('.phone-carousel-wrapper').offsetWidth;
            const cardWidth = cards[0].offsetWidth;
            const gap = 10;
            const centerOffset = (containerWidth / 2) - (cardWidth / 2);
            const slideOffset = currentSlide * (cardWidth + gap);
            const translateX = centerOffset - slideOffset;

            track.style.transform = `translateX(${translateX}px)`;
            cards.forEach((card, index) => card.classList.toggle('active', index === currentSlide));
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % cards.length;
            updateCarousel();
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + cards.length) % cards.length;
            updateCarousel();
        }

        function startAutoSlide() {
            clearInterval(autoSlideInterval);
            autoSlideInterval = setInterval(nextSlide, slideInterval);
        }

        nextBtn?.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
        prevBtn?.addEventListener('click', () => { prevSlide(); startAutoSlide(); });
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateCarousel();
                startAutoSlide();
            });
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
        startAutoSlide();
    }
});
