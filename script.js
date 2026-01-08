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

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        const toggleMenu = () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                const isOpen = navLinks.classList.contains('active');
                icon.className = isOpen ? 'fas fa-times' : 'fas fa-bars';
            }
        };

        const closeMenu = () => {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-bars';
            }
        };

        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                closeMenu();
            }
        });
    }

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
            const wrapper = document.querySelector('.phone-carousel-wrapper');
            if (!wrapper) return;

            const containerWidth = wrapper.offsetWidth;
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

        // Optimized resize handling
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateCarousel, 100);
        });

        // Initial update
        updateCarousel();
        startAutoSlide();
    } // Close if(track)

    // --- Lead Capture Modal Logic ---
    const leadModal = document.getElementById('lead-modal');
    const leadForm = document.getElementById('lead-form');
    const modalClose = document.querySelector('.modal-close');
    let pendingCheckoutUrl = '';

    // Function to open modal
    const openModal = (url) => {
        pendingCheckoutUrl = url;
        leadModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    // Function to close modal
    const closeModal = () => {
        leadModal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
        leadForm.reset();
    };

    // Intercept clicks on plan buttons
    [basicBtn, proBtn].forEach(btn => {
        if (!btn) return;
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && !href.includes('wa.me')) {
                e.preventDefault();
                openModal(href);
            }
        });
    });

    // Handle form submission
    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const leadData = {
            name: document.getElementById('lead-name').value,
            email: document.getElementById('lead-email').value,
            phone: document.getElementById('lead-phone').value,
            plan: pendingCheckoutUrl.includes('preapproval_plan_id') ? 'Subscription' : 'Contact',
            timestamp: new Date().toISOString()
        };

        console.log('Lead Data Captured:', leadData);

        const submitBtn = leadForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processando...';

        setTimeout(() => {
            console.log('Redirecting to checkout:', pendingCheckoutUrl);
            window.location.href = pendingCheckoutUrl;
        }, 800);
    });

    // Close listeners
    modalClose.addEventListener('click', closeModal);
    leadModal.addEventListener('click', (e) => {
        if (e.target === leadModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && leadModal.classList.contains('active')) closeModal();
    });
});
