function handlePreloader() {
    const preloaderContainer = document.getElementById('preloader');
    const preloaderImage = document.querySelector('.preloaderImg');
    const finalLogo = document.getElementById('logo');

    if (!preloaderContainer || !preloaderImage || !finalLogo) {
        if (preloaderContainer) preloaderContainer.style.display = 'none';
        if (finalLogo) finalLogo.style.visibility = 'visible';
        return;
    }

    setTimeout(() => {
        const finalRect = finalLogo.getBoundingClientRect();
        const initialRect = preloaderImage.getBoundingClientRect();

        preloaderImage.style.transition = 'none';
        preloaderImage.style.top = `${initialRect.top}px`;
        preloaderImage.style.left = `${initialRect.left}px`;
        preloaderImage.style.transform = 'translate(0, 0)';

        preloaderImage.offsetHeight;

        preloaderImage.style.transition = 'top 1.2s ease-in-out, left 1.2s ease-in-out, width 1.2s ease-in-out';
        preloaderImage.style.left = `${finalRect.left}px`;
        preloaderImage.style.top = `${finalRect.top}px`;
        preloaderImage.style.width = `${finalRect.width}px`;

        preloaderContainer.classList.add('preloader-background-hidden');
        finalLogo.style.visibility = 'visible';

        setTimeout(() => {
            preloaderContainer.style.display = 'none';
        }, 1500);

    }, 400);
}

window.addEventListener('load', handlePreloader);
function startApplication() {
    console.log("Preloader finished. Starting application UI and loading Home page.");
    document.dispatchEvent(new CustomEvent('app:start'));
}
document.addEventListener('DOMContentLoaded', () => {

    const contentArea = document.getElementById('content-area');
    const hamburgerBtn = document.querySelector('.hamburger');
    const navActionContainer = document.getElementById('navAction');
    const notificationContainer = document.querySelector('.notifications');

    if (!contentArea || !hamburgerBtn) {
        console.error("Critical navigation elements are missing! (content-area, hamburger, menu-center)");
        return;
    }

    function showNotification(message, type = 'success') {
        if (!notificationContainer) return;
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            notification.addEventListener('transitionend', () => notification.remove());
        }, 4000);
    }

    function updateUserNav() {
        if (!navActionContainer) return;

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (loggedInUser) {
            const cart = JSON.parse(localStorage.getItem('userCart')) || [];
            const cartItemCount = cart.length;

            const cartBadgeHTML = cartItemCount > 0 ?
                `<span class="cart-badge">${cartItemCount}</span>` :
                '';

            navActionContainer.innerHTML = `
            <div class="nav-icons-container">
                <a href="#" data-page="booking" class="cart-icon-link" title="Your Cart">
                    <i class="fas fa-shopping-cart"></i>
                    ${cartBadgeHTML}
                </a>
                <a href="#" data-page="profile" class="profile-icon" title="Profile: ${loggedInUser.name}">
                    ${loggedInUser.name.charAt(0).toUpperCase()}
                </a>
            </div>
        `;
        } else {
            navActionContainer.innerHTML = `<a href="#" data-page="signup" class="btn-register">JOIN NOW</a>`;
        }
    }

    window.setupScrollAnimations = function () {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: "0px 0px -50px 0px"
        });

        document.querySelectorAll('.animate-on-scroll, .slide-in-left, .slide-in-right').forEach(el => {
            observer.observe(el);
        });
    }

    window.logout = function () {
        localStorage.removeItem('loggedInUser');
        showNotification('You have successfully logged out.', 'info');
        updateUserNav();
        loadPage('home');
    }


    async function loadPage(pageName) {
        if (!pageName) return;
        try {
            const response = await fetch(`pages/${pageName}.html`);
            if (!response.ok) throw new Error(`Page 'pages/${pageName}.html' not found.`);
            contentArea.innerHTML = await response.text();

            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.toggle('active', link.dataset.page === pageName);
            });
            setTimeout(() => window.scrollTo(0, 0), 0);

            if (typeof pageInitializers[pageName] === 'function') {
                pageInitializers[pageName]();
            }
        } catch (error) {
            console.error(error.message);
            contentArea.innerHTML = "<h1>Error 404</h1><p>Sorry, the page you requested was not found.</p>";
        }
    }

    const pageInitializers = {
        home: function () {
            console.log("Home page is loaded. All animations and modules are starting now.");

            setupHeroEffects();
            updateChallengeButtonVisibility();
            setupGallerySlider();
            setupImageLightbox();
            setupVideoModal();
            setupTestimonialsModule();
            window.setupScrollAnimations();

            function setupAugustSaleOnScroll() {
                const overlay = document.getElementById('august-sale-popup-overlay');
                const closeBtn = document.getElementById('close-august-popup-btn');
                const isAugust = new Date().getMonth() === 7;

                if (!isAugust || !overlay || !closeBtn) {
                    return;
                }

                console.log("It's August. Popup is waiting for the first scroll.");

                function closePopup() {
                    overlay.classList.remove('visible');
                }

                function showPopup() {
                    console.log("First scroll detected. Showing August Sale popup.");
                    overlay.classList.add('visible');
                    window.removeEventListener('scroll', showPopup);
                }

                closeBtn.addEventListener('click', closePopup);
                overlay.addEventListener('click', (e) => {
                    if (e.target === overlay) {
                        closePopup();
                    }
                });

                window.addEventListener('scroll', showPopup);
            }

            setupAugustSaleOnScroll();

            function setupHeroEffects() {
                const hero = document.getElementById('hero');
                if (hero) {
                    if (document.getElementById('particles-js')) {
                        particlesJS('particles-js', {
                            "particles": {
                                "number": {
                                    "value": 80,
                                    "density": {
                                        "enable": true,
                                        "value_area": 800
                                    }
                                },
                                "color": {
                                    "value": "#AE3121"
                                },
                                "shape": {
                                    "type": "circle"
                                },
                                "opacity": {
                                    "value": 0.5,
                                    "random": true,
                                    "anim": {
                                        "enable": true,
                                        "speed": 1,
                                        "opacity_min": 0.1,
                                        "sync": false
                                    }
                                },
                                "size": {
                                    "value": 6,
                                    "random": true,
                                    "anim": {
                                        "enable": false
                                    }
                                },
                                "line_linked": {
                                    "enable": true,
                                    "distance": 150,
                                    "color": "#333333",
                                    "opacity": 0.4,
                                    "width": 1
                                },
                                "move": {
                                    "enable": true,
                                    "speed": 2,
                                    "direction": "none",
                                    "random": false,
                                    "straight": false,
                                    "out_mode": "out",
                                    "bounce": false,
                                }
                            },
                            "interactivity": {
                                "detect_on": "canvas",
                                "events": {
                                    "onhover": {
                                        "enable": true,
                                        "mode": "grab"
                                    },
                                    "onclick": {
                                        "enable": true,
                                        "mode": "push"
                                    },
                                    "resize": true
                                },
                                "modes": {
                                    "grab": {
                                        "distance": 140,
                                        "line_opacity": 1
                                    },
                                    "bubble": {
                                        "distance": 400,
                                        "size": 40,
                                        "duration": 2,
                                        "opacity": 8,
                                        "speed": 3
                                    },
                                    "repulse": {
                                        "distance": 200,
                                        "duration": 0.4
                                    },
                                    "push": {
                                        "particles_nb": 4
                                    },
                                    "remove": {
                                        "particles_nb": 2
                                    }
                                }
                            },
                            "retina_detect": true
                        });
                    }
                    const heroContent = hero.querySelector('.hero-content');
                    const particlesCanvas = hero.querySelector('#particles-js');

                    hero.addEventListener('mousemove', (e) => {
                        const {
                            clientX,
                            clientY
                        } = e;
                        const {
                            offsetWidth,
                            offsetHeight
                        } = hero;

                        const x = (clientX / offsetWidth - 0.5) * 2;
                        const y = (clientY / offsetHeight - 0.5) * 2;

                        if (heroContent) {
                            heroContent.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
                        }

                        if (particlesCanvas) {
                            particlesCanvas.style.transform = `translate(${x * -10}px, ${y * -10}px)`;
                        }
                    });
                }
            }

            function updateChallengeButtonVisibility() {
                const challengeButton = document.getElementById('challenge-btn');

                if (!challengeButton) {
                    return;
                }

                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

                if (loggedInUser) {
                    challengeButton.style.display = 'none';
                } else {
                    challengeButton.style.display = 'block';

                    challengeButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        if (typeof loadPage === 'function') {
                            console.log("Challenge button clicked. Navigating to signup page.");
                            loadPage('signup');
                        }
                    });
                }
            }

            function setupGallerySlider() {
                const gallerySlider = document.querySelector('.gallery-slider-wrapper');
                if (gallerySlider) {
                    const track = gallerySlider.querySelector('.gallery-track');
                    const slides = Array.from(track.children);
                    const dotsContainer = gallerySlider.querySelector('.gallery-dots');
                    let currentIndex = 0;
                    let intervalId;

                    if (slides.length === 0) return;

                    if (dotsContainer) {
                        dotsContainer.innerHTML = '';
                        slides.forEach((_, i) => {
                            const dot = document.createElement('button');
                            dot.classList.add('dot');
                            dot.addEventListener('click', () => goToSlide(i));
                            dotsContainer.appendChild(dot);
                        });
                    }

                    const dots = dotsContainer ? Array.from(dotsContainer.children) : [];

                    const updateActiveElements = () => {
                        track.style.transform = `translateX(-${currentIndex * 100}%)`;
                        if (dots.length > 0) {
                            dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
                        }
                    }

                    const goToSlide = (index) => {
                        if (index >= slides.length) {
                            currentIndex = 0;
                        } else if (index < 0) {
                            currentIndex = slides.length - 1;
                        } else {
                            currentIndex = index;
                        }
                        updateActiveElements();
                        resetInterval();
                    }

                    const nextSlide = () => {
                        goToSlide(currentIndex + 1);
                    }

                    const prevSlide = () => {
                        goToSlide(currentIndex - 1);
                    }

                    const startInterval = () => {
                        clearInterval(intervalId);
                        intervalId = setInterval(nextSlide, 5000);
                    }

                    const resetInterval = () => startInterval();


                    document.addEventListener('keydown', (e) => {
                        const activeElement = document.activeElement;
                        if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                            return;
                        }

                        if (e.key === 'ArrowLeft') {
                            e.preventDefault();
                            prevSlide();
                        } else if (e.key === 'ArrowRight') {
                            e.preventDefault();
                            nextSlide();
                        }
                    });

                    updateActiveElements();
                    startInterval();
                }
            }


            function setupImageLightbox() {
                const overlay = document.getElementById('image-lightbox-overlay');
                const lightboxImage = document.getElementById('lightbox-image');
                const closeBtn = document.getElementById('close-lightbox-btn');

                const clickableImages = document.querySelectorAll('.gallery-image, .clickable-image');

                if (!overlay || !lightboxImage || !closeBtn || clickableImages.length === 0) {
                    console.warn("Lightbox elements or clickable images were not found.");
                    return;
                }

                function openLightbox(event) {
                    const imageSrc = event.target.src;
                    lightboxImage.setAttribute('src', imageSrc);
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }

                function closeLightbox() {
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                    setTimeout(() => {
                        lightboxImage.setAttribute('src', '');
                    }, 400);
                }

                clickableImages.forEach(img => {
                    img.addEventListener('click', openLightbox);
                    img.style.cursor = 'pointer';
                });

                closeBtn.addEventListener('click', closeLightbox);
                overlay.addEventListener('click', (event) => {
                    if (event.target === overlay) {
                        closeLightbox();
                    }
                });

                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && overlay.classList.contains('active')) {
                        closeLightbox();
                    }
                });
            }

            function setupVideoModal() {
                try {
                    const flipperOverlay = document.getElementById('flipper-overlay');
                    const flipperContainer = document.getElementById('flipper-container');
                    const flipperFront = document.querySelector('.card-face--front');
                    const videoContent = document.getElementById('video-content-flipper');
                    const closeBtn = document.getElementById('close-flipper-btn');

                    const offerCards = document.querySelectorAll('.offer-card[data-video-src]');

                    if (!flipperOverlay || !flipperContainer || !closeBtn) {
                        console.error("Flipper modal elements were not found in HTML!");
                        return;
                    }

                    const openFlipperModal = (card) => {
                        const videoSrc = card.dataset.videoSrc;
                        if (!videoSrc || videoSrc === "#") {
                            console.warn('Video for this service is not yet available.');
                            return;
                        }

                        flipperFront.innerHTML = card.innerHTML;

                        if (videoSrc.includes("youtube.com") || videoSrc.includes("youtu.be")) {
                            const videoId = videoSrc.split('v=')[1]?.split('&')[0] || videoSrc.split('/').pop();
                            videoContent.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
                        } else {
                            videoContent.innerHTML = `<video src="${videoSrc}" controls autoplay loop playsinline></video>`;
                        }

                        flipperOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    };

                    const closeFlipperModal = () => {
                        flipperOverlay.classList.remove('active');
                        document.body.style.overflow = '';

                        setTimeout(() => {
                            videoContent.innerHTML = '';
                        }, 500);
                    };

                    offerCards.forEach(card => {
                        card.addEventListener('click', () => openFlipperModal(card));
                    });

                    closeBtn.addEventListener('click', closeFlipperModal);
                    flipperOverlay.addEventListener('click', (e) => {
                        if (e.target === flipperOverlay) {
                            closeFlipperModal();
                        }
                    });

                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'Escape' && flipperOverlay.classList.contains('active')) {
                            closeFlipperModal();
                        }
                    });

                } catch (error) {
                    console.error("Error initializing the flipper modal:", error);
                }
            }


            function setupTestimonialsModule() {
                const testimonialGrid = document.getElementById('testimonial-grid');
                const writeReviewSection = document.getElementById('write-review-section');
                const reviewForm = document.getElementById('review-form');
                if (!testimonialGrid || !reviewForm) return;

                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                let reviews = JSON.parse(localStorage.getItem('gymReviews')) || [{
                    name: "Ana K.",
                    rating: 5,
                    comment: "Reboot Fitness isn't just a gym, it's a second home. The trainers are incredibly knowledgeable and the positive atmosphere makes every workout enjoyable. I've seen amazing results in just 3 months!",
                    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                }, {
                    name: "Blerim G.",
                    rating: 5,
                    comment: "As someone who is serious about weightlifting, the quality of equipment here is top-notch. Everything is well-maintained, and there's a great variety of machines and free weights. Highly recommended.",
                    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                }, {
                    name: "Linda S.",
                    rating: 4,
                    comment: "I was a complete beginner and felt intimidated by gyms. The staff here made me feel welcome from day one. The group classes are fun and energetic. My only wish is for more yoga sessions!",
                    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
                },];

                function renderTestimonials() {
                    testimonialGrid.innerHTML = '';
                    reviews.forEach((review, index) => {
                        const card = document.createElement('div');
                        card.className = 'testimonial-card animate-on-scroll';

                        const isAuthor = loggedInUser && loggedInUser.name === review.name;
                        const deleteButtonHTML = isAuthor ?
                            `<button class="delete-review-btn" data-index="${index}" title="Delete review">×</button>` : '';

                        card.innerHTML = `
            ${deleteButtonHTML}
            <img src="${review.avatar || 'https://i.pravatar.cc/150'}" alt="${review.name}" class="author-avatar">
            <div class="testimonial-content">
                <div class="author">
                    <cite>${review.name}</cite>
                    <div class="stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                </div>
                <blockquote>${review.comment}</blockquote>
            </div>`;
                        testimonialGrid.appendChild(card);
                    });

                    if (typeof setupScrollAnimations === 'function') setupScrollAnimations();
                }

                function setupReviewForm() {
                    if (!writeReviewSection) return;
                    if (loggedInUser) writeReviewSection.classList.remove('hidden');
                    else writeReviewSection.classList.add('hidden');

                    reviewForm.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const data = new FormData(reviewForm);
                        const comment = data.get('reviewText').trim();
                        const rating = data.get('rating');

                        if (!rating || !comment) {
                            showNotification('Please provide a star rating and a comment.', 'warning');
                            return;
                        }

                        const newReview = {
                            name: loggedInUser.name,
                            rating: parseInt(rating, 10),
                            comment: comment,
                            avatar: `https://i.pravatar.cc/150?u=${loggedInUser.email}`
                        };
                        reviews.push(newReview);
                        showNotification('Thank you for your review!', 'success');

                        localStorage.setItem('gymReviews', JSON.stringify(reviews));
                        renderTestimonials();
                        reviewForm.reset();
                    });
                }

                testimonialGrid.addEventListener('click', (e) => {
                    const index = e.target.dataset.index;

                    if (e.target.classList.contains('delete-review-btn')) {
                        if (confirm('Are you sure you want to delete this review?')) {
                            reviews.splice(index, 1);
                            localStorage.setItem('gymReviews', JSON.stringify(reviews));
                            showNotification('Review deleted successfully.', 'info');
                            renderTestimonials();
                        }
                    }
                });

                renderTestimonials();
                setupReviewForm();
            }

        },

        about: function () {

            function setupAboutTabs() {
                const navButtons = document.querySelectorAll('.about-nav button');
                const contentPanes = document.querySelectorAll('.about-content-panes .about-pane');

                navButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const tab = button.dataset.tab;

                        navButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');

                        contentPanes.forEach(pane => {
                            pane.classList.toggle('active', pane.dataset.tabContent === tab);
                        });
                    });
                });
            }

            function setupInstructorsSlider() {
                if (typeof Swiper === 'undefined') {
                    console.error('Swiper.js library not found!');
                    return;
                }

                const swiper = new Swiper('.instructors-carousel', {
                    effect: 'coverflow',
                    grabCursor: true,
                    centeredSlides: true,
                    loop: true,
                    slidesPerView: 'auto',
                    centeredSlides: true,

                    slidesPerView: 1.5,
                    breakpoints: {
                        768: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 3,
                        },
                    },
                    spaceBetween: 30,
                    coverflowEffect: {
                        rotate: 0,
                        stretch: 50,
                        depth: 150,
                        modifier: 1,
                        slideShadows: false,
                    },
                    keyboard: {
                        enabled: true,
                        onlyInViewport: true,
                    },
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },

                });

                const filterButtons = document.querySelectorAll('.filter-btn');
                const allSlides = Array.from(document.querySelectorAll('.instructors-carousel .swiper-slide'));

                const originalSlidesHTML = allSlides.map(slide => slide.outerHTML);

                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');

                        const filter = button.dataset.filter;

                        swiper.removeAllSlides();

                        if (filter === 'all') {
                            swiper.appendSlide(originalSlidesHTML);
                        } else {
                            const filteredSlidesHTML = allSlides
                                .filter(slide => slide.dataset.category && slide.dataset.category.includes(filter))
                                .map(slide => slide.outerHTML);

                            swiper.appendSlide(filteredSlidesHTML);
                        }

                        swiper.update();
                        swiper.slideToLoop(0, 0);
                    });
                });
            }

            function setupStatsCounter() {
                const statsNumbers = document.querySelectorAll('.stat-number');
                if (statsNumbers.length === 0) return;

                const observer = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const numberElement = entry.target;
                            const target = +numberElement.dataset.target;

                            if (numberElement.classList.contains('animated')) return;
                            numberElement.classList.add('animated');

                            let current = 0;
                            const increment = target / 100;

                            const updateCounter = () => {
                                current += increment;
                                if (current < target) {
                                    numberElement.innerText = Math.ceil(current).toLocaleString();
                                    requestAnimationFrame(updateCounter);
                                } else {
                                    const suffix = numberElement.closest('.stat-item')?.querySelector('p')?.textContent.includes('Members') ? '+' : '';
                                    numberElement.innerText = target.toLocaleString() + suffix;
                                }
                            };

                            updateCounter();
                            observer.unobserve(numberElement);
                        }
                    });
                }, {
                    threshold: 0.8
                });

                statsNumbers.forEach(num => observer.observe(num));
            }

            console.log("Initializing About Page modules...");
            setupAboutTabs();
            setupInstructorsSlider();
            setupStatsCounter();
            window.setupScrollAnimations();
        },

        services: function () {
            // =======================================================
            // ===       FUNKSION PËR MENAXHIMIN E TAB-EVE        ===
            // =======================================================
            function setupServiceTabs() {
                const tabButtons = document.querySelectorAll('.tab-btn');
                const tabPanes = document.querySelectorAll('.tab-pane');
                if (!tabButtons.length || !tabPanes.length) return;

                tabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        const targetTab = button.dataset.tab;
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        tabPanes.forEach(pane => pane.classList.remove('active'));
                        button.classList.add('active');
                        const targetPane = document.querySelector(`.tab-pane[data-tab-content="${targetTab}"]`);
                        if (targetPane) targetPane.classList.add('active');
                        if (typeof window.setupScrollAnimations === 'function') window.setupScrollAnimations();
                    });
                });
            }
            function setupCardActions() {
                const tabsContent = document.querySelector('.tabs-content');
                if (!tabsContent) return;

                tabsContent.addEventListener('click', (event) => {
                    const card = event.target.closest('.sv-card');
                    if (!card) return;

                    // RASTI 1: Karta është një shërbim që duhet shtuar në shportë
                    if (card.hasAttribute('data-id')) {

                        // ===================================================================
                        // ===   KONTROLLI I RI: A ËSHTË PËRDORUESI I IDENTIFIKUAR?       ===
                        // ===================================================================
                        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

                        if (!loggedInUser) {
                            // NËSE NUK ËSHTË I IDENTIFIKUAR:
                            // 1. Shfaqim një mesazh informues.
                            showNotification('You must be logged in to add items to the cart.', 'info');

                            // 2. Ruajmë faqen aktuale që ta kthejmë përdoruesin këtu pas hyrjes.
                            localStorage.setItem('redirectAfterLogin', 'services');

                            // 3. E ridrejtojmë te faqja e hyrjes (login).
                            loadPage('login');

                            // 4. Ndalojmë ekzekutimin e mëtejshëm të kodit.
                            return;
                        }

                        // NËSE ËSHTË I IDENTIFIKUAR, vazhdojmë me logjikën e shtimit në shportë
                        const product = {
                            id: card.dataset.id,
                            name: card.dataset.name,
                            price: parseFloat(card.dataset.price),
                            type: 'service'
                        };

                        if (!product.id || !product.name || isNaN(product.price)) {
                            console.error('Karta e shërbimit nuk ka të dhënat e plota.', card.dataset);
                            if (typeof showNotification === 'function') showNotification('Could not add item. Data missing.', 'error');
                            return;
                        }

                        addItemToCart(product);
                        loadPage('booking');

                    }
                    else if (card.hasAttribute('data-page')) {
                        const pageName = card.dataset.page;
                        if (typeof loadPage === 'function') {
                            loadPage(pageName);
                        }
                    }
                });
            }

            function addItemToCart(product) {
                let cart = JSON.parse(localStorage.getItem('userCart')) || [];
                const itemExists = cart.some(item => item.id === product.id);

                if (itemExists) {
                    if (typeof showNotification === 'function') showNotification(`'${product.name}' is already in your cart.`, 'warning');
                } else {
                    cart.push(product);
                    localStorage.setItem('userCart', JSON.stringify(cart));
                    if (typeof showNotification === 'function') showNotification(`'${product.name}' added to cart!`, 'success');
                    if (typeof updateUserNav === 'function') updateUserNav();
                }
            }

            function handleCtaVisibility() {
                const ctaSection = document.querySelector('.sv-cta-section');
                if (!ctaSection) {
                    return;
                }

                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

                if (loggedInUser) {
                    ctaSection.style.display = 'none';
                } else {
                    ctaSection.style.display = 'block';
                }
            }

            console.log("Initializing Services Page modules...");
            setupServiceTabs();
            setupCardActions();
            handleCtaVisibility();
            if (typeof window.setupScrollAnimations === 'function') window.setupScrollAnimations();
        },

        signup: function () {
            const signupForm = document.getElementById('signupForm');
            if (!signupForm) return;

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const verifyPasswordInput = document.getElementById('verifyPassword');

            const nameError = document.getElementById('nameError');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            const verifyPasswordError = document.getElementById('verifyPasswordError');

            function getFromStorage(key, defaultValue = []) {
                return JSON.parse(localStorage.getItem(key)) || defaultValue;
            }
            function saveToStorage(key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            }
            async function simpleHash(password) {
                const encoder = new TextEncoder();
                const data = encoder.encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }

            function setMessage(el, msg, isValid) {
                el.textContent = msg;
                el.style.color = isValid ? 'limegreen' : 'red';
            }

            function setupPasswordToggle(inputId, toggleId) {
                const passwordField = document.getElementById(inputId);
                const toggleIcon = document.getElementById(toggleId);
                if (toggleIcon) {
                    toggleIcon.addEventListener('click', function () {
                        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                        passwordField.setAttribute('type', type);
                        this.classList.toggle('fa-eye-slash');
                    });
                }
            }
            setupPasswordToggle('password', 'togglePassword');
            setupPasswordToggle('verifyPassword', 'toggleVerifyPassword');

            const validateName = () => {
                const nameRegex = /^[a-zA-Z\s]+$/;
                if (nameInput.value.trim() === '') {
                    setMessage(nameError, 'Name is required.', false);
                    return false;
                }
                if (!nameRegex.test(nameInput.value.trim())) {
                    setMessage(nameError, 'Name must contain only letters.', false);
                    return false;
                }
                setMessage(nameError, 'Name correct!', true);
                return true;
            };

            const validateEmail = () => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailInput.value.trim() === '') {
                    setMessage(emailError, 'Email is required.', false);
                    return false;
                }
                if (!emailRegex.test(emailInput.value.trim())) {
                    setMessage(emailError, 'Please enter a valid email.', false);
                    return false;
                }
                setMessage(emailError, 'Email correct!', true);
                return true;
            };

            const validatePassword = () => {
                const passValue = passwordInput.value;
                if (passValue === '') {
                    setMessage(passwordError, 'Password is required.', false);
                    return false;
                }

                const errors = [];
                if (passValue.length < 8) errors.push("at least 8 characters");
                if (!/[A-Z]/.test(passValue)) errors.push("one uppercase letter");
                if (!/[0-9]/.test(passValue)) errors.push("one number");
                if (!/[!@#$%^&*(),.?":{}|<>]/.test(passValue)) errors.push("one special character");

                if (errors.length > 0) {
                    setMessage(passwordError, `Password must contain: ${errors.join(', ')}.`, false);
                    return false;
                }
                setMessage(passwordError, 'Password correct!', true);
                return true;
            };

            const validateVerifyPassword = () => {
                if (verifyPasswordInput.value === '') {
                    setMessage(verifyPasswordError, 'Password verification is required.', false);
                    return false;
                }
                if (passwordInput.value !== verifyPasswordInput.value) {
                    setMessage(verifyPasswordError, 'Passwords do not match.', false);
                    return false;
                }
                setMessage(verifyPasswordError, 'Passwords match!', true);
                return true;
            };

            nameInput.addEventListener('input', validateName);
            emailInput.addEventListener('input', validateEmail);
            passwordInput.addEventListener('input', () => {
                validatePassword();
                validateVerifyPassword();
            });
            verifyPasswordInput.addEventListener('input', validateVerifyPassword);

            signupForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const isNameValid = validateName();
                const isEmailValid = validateEmail();
                const isPasswordValid = validatePassword();
                const isVerifyPasswordValid = validateVerifyPassword();

                if (!isNameValid || !isEmailValid || !isPasswordValid || !isVerifyPasswordValid) {
                    return;
                }

                const name = nameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;

                let users = getFromStorage('gymUsers');
                if (users.find(user => user.email === email)) {
                    setMessage(emailError, 'This email is already registered.', false);
                    return;
                }

                const hashedPassword = await simpleHash(password);
                const newUser = { name, email, password: hashedPassword };

                users.push(newUser);
                saveToStorage('gymUsers', users);
                saveToStorage('loggedInUser', newUser);

                updateUserNav();
                showNotification('Registration successful! Welcome!', 'success');
                loadPage('booking');
            });
        },


        login: function () {
            const loginForm = document.getElementById('login-form');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (!loginForm || !emailInput || !passwordInput) {
                console.error("Critical Error on login page: One or more form elements are missing (login-form, email, password).");
                return;
            }

            async function simpleHash(password) {
                const encoder = new TextEncoder();
                const data = encoder.encode(password);
                const hashBuffer = await crypto.subtle.digest('SHA-256', data);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            }

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const email = emailInput.value.trim();
                const password = passwordInput.value;

                console.log("Login attempt:", { email, passwordEntered: !!password });

                if (!email || !password) {
                    console.warn("Login failed: Empty email or password.");
                    showNotification('Please enter both email and password.', 'warning');
                    return;
                }

                const users = JSON.parse(localStorage.getItem('gymUsers')) || [];
                console.log("Loaded users from storage:", users);

                const user = users.find(u => u.email === email);

                if (!user) {
                    console.warn("Login failed: Email not registered.");
                    showNotification('This email is not registered. Please sign up.', 'error');

                    setTimeout(() => {
                        console.log("Redirecting to signup page...");
                        loadPage('signup');
                    }, 1500);

                    return;
                }

                const hashedPasswordAttempt = await simpleHash(password);
                console.log("Password hash entered:", hashedPasswordAttempt);
                console.log("Password hash stored:", user.password);

                if (hashedPasswordAttempt === user.password) {
                    console.log("Login successful for:", user.name);
                    localStorage.setItem('loggedInUser', JSON.stringify(user));
                    updateUserNav();
                    showNotification(`Welcome back, ${user.name}!`, 'success');

                    const redirectTarget = localStorage.getItem('redirectAfterLogin');
                    if (redirectTarget) {
                        localStorage.removeItem('redirectAfterLogin');
                        console.log(`Redirecting to: ${redirectTarget}`);
                        loadPage(redirectTarget);
                    } else {
                        console.log("Redirecting to profile page...");
                        loadPage('profile');
                    }
                } else {
                    console.warn("Login failed: Incorrect password.");
                    showNotification('Incorrect password. Please try again.', 'error');
                }
            });
        },

        profile: function () {
            function getFromStorage(key, defaultValue = []) {
                try {
                    const storedValue = localStorage.getItem(key);
                    return storedValue ? JSON.parse(storedValue) : defaultValue;
                } catch (e) {
                    console.error("Error reading from localStorage", e);
                    return defaultValue;
                }
            }

            function saveToStorage(key, data) {
                localStorage.setItem(key, JSON.stringify(data));
            }

            const user = getFromStorage('loggedInUser', null);
            if (!user || !user.email) {
                showNotification('Please log in to view your profile.', 'info');
                loadPage('login');
                return;
            }

            const userAvatar = document.getElementById('userAvatar');
            const userName = document.getElementById('userName');
            const userEmail = document.getElementById('userEmail');
            const logoutBtn = document.getElementById('logoutBtn');

            const currentBmiStat = document.getElementById('currentBmiStat');
            const objectivesCompletedStat = document.getElementById('objectivesCompletedStat');

            const progressForm = document.getElementById('progressForm');
            const heightInput = document.getElementById('heightInput');
            const weightInput = document.getElementById('weightInput');
            const bmiResultContainer = document.getElementById('bmiResult');
            const viewHistoryBtn = document.getElementById('viewHistoryBtn');
            const historyModalOverlay = document.getElementById('historyModalOverlay');
            const closeHistoryModalBtn = document.getElementById('closeHistoryModal');

            const objectivesList = document.getElementById('objectivesList');
            const noObjectivesMsg = document.getElementById('no-objectives-message');
            const addObjectiveForm = document.getElementById('addObjectiveForm');

            function setupInfoModule() {
                if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();
                if (userName) userName.textContent = user.name;
                if (userEmail) userEmail.textContent = user.email;
                if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
            }

            function setupProgressModule() {
                const storageKey = `progressHistory_${user.email}`;
                let progressHistory = getFromStorage(storageKey);

                function calculateBMI(weight, height) {
                    if (!weight || !height || height <= 0) return null;
                    return (weight / ((height / 100) ** 2)).toFixed(1);
                }

                function displayBmiResult(weight, height) {
                    const bmi = calculateBMI(weight, height);

                    if (bmiResultContainer) {
                        if (bmi) {
                            const category = (bmi < 18.5) ? 'Underweight' : (bmi < 25) ? 'Normal Weight' : (bmi < 30) ? 'Overweight' : 'Obesity';
                            const color = category === 'Normal Weight' ? '#28a745' : '#f39c12';
                            bmiResultContainer.innerHTML = `
                                <div>Your Current BMI</div>
                                <div class="bmi-value">${bmi}</div>
                                <div class="bmi-category" style="color: ${color};">${category}</div>`;
                        } else {
                            bmiResultContainer.innerHTML = '<p class="placeholder-text">Enter your height and weight to see your BMI.</p>';
                        }
                    }

                    if (currentBmiStat) {
                        currentBmiStat.textContent = bmi || '-';
                    }
                }

                function loadLatestProgress() {
                    if (progressHistory.length > 0) {
                        const latestEntry = progressHistory[progressHistory.length - 1];
                        if (heightInput) heightInput.value = latestEntry.height || '';
                        if (weightInput) weightInput.value = latestEntry.weight || '';
                        displayBmiResult(latestEntry.weight, latestEntry.height);
                    } else {
                        displayBmiResult(null, null);
                    }
                }

                progressForm.addEventListener('submit', e => {
                    e.preventDefault();
                    const height = parseFloat(heightInput.value);
                    const weight = parseFloat(weightInput.value);

                    if (!height || !weight || height <= 0 || weight <= 0) {
                        showNotification('Please enter valid (positive) height and weight.', 'warning');
                        return;
                    }

                    const today = new Date().toISOString().split('T')[0];
                    const bmi = calculateBMI(weight, height);

                    progressHistory.push({
                        date: today,
                        height,
                        weight,
                        bmi
                    });
                    saveToStorage(storageKey, progressHistory);

                    displayBmiResult(weight, height);
                    showNotification('New progress entry saved!', 'success');
                });

                function renderHistoryModal() {
                    const tableBody = document.getElementById('historyTable')?.querySelector('tbody');
                    const noHistoryMsg = document.getElementById('no-progress-history');
                    if (!tableBody || !noHistoryMsg) return;

                    tableBody.innerHTML = '';
                    const hasHistory = progressHistory.length > 0;
                    noHistoryMsg.style.display = hasHistory ? 'none' : 'block';
                    document.getElementById('historyTable').style.display = hasHistory ? 'table' : 'none';

                    if (hasHistory) {
                        [...progressHistory].reverse().forEach(entry => {
                            const row = tableBody.insertRow();
                            row.innerHTML = `<td>${entry.date}</td><td>${entry.weight} kg</td><td>${entry.bmi || 'N/A'}</td>`;
                        });
                    }
                }

                viewHistoryBtn.addEventListener('click', () => {
                    renderHistoryModal();
                    if (historyModalOverlay) historyModalOverlay.classList.add('active');
                });
                if (closeHistoryModalBtn) closeHistoryModalBtn.addEventListener('click', () => historyModalOverlay.classList.remove('active'));
                if (historyModalOverlay) historyModalOverlay.addEventListener('click', e => {
                    if (e.target === historyModalOverlay) historyModalOverlay.classList.remove('active');
                });

                loadLatestProgress();
            }

            function setupObjectivesModule() {
                const storageKey = `userObjectives_${user.email}`;
                let objectives = getFromStorage(storageKey, []);

                function updateObjectivesStat() {
                    if (!objectivesCompletedStat) return;
                    const completedCount = objectives.filter(obj => obj.completed).length;
                    objectivesCompletedStat.textContent = completedCount;
                }

                function renderObjectives() {
                    if (!objectivesList || !noObjectivesMsg) return;
                    objectivesList.innerHTML = '';
                    noObjectivesMsg.style.display = objectives.length === 0 ? 'block' : 'none';

                    objectives.forEach((obj, index) => {
                        const li = document.createElement('li');
                        li.className = `objective-item ${obj.completed ? 'completed' : ''}`;
                        li.innerHTML = `
                            <input type="checkbox" class="toggle-complete" data-index="${index}" ${obj.completed ? 'checked' : ''} aria-label="Mark objective as complete">
                            <span class="objective-text">${obj.text}</span>
                            <button class="delete-objective-btn" data-index="${index}" aria-label="Delete objective">×</button>`;
                        objectivesList.appendChild(li);
                    });

                    updateObjectivesStat();
                }

                addObjectiveForm.addEventListener('submit', e => {
                    e.preventDefault();
                    const textInput = document.getElementById('newObjectiveInput');
                    const text = textInput.value.trim();

                    if (text === '') {
                        showNotification('Please write an objective.', 'warning');
                        return;
                    }

                    objectives.push({
                        text: text,
                        completed: false
                    });
                    saveToStorage(storageKey, objectives);
                    renderObjectives();
                    textInput.value = '';
                });

                objectivesList.addEventListener('click', e => {
                    const target = e.target;
                    const index = target.dataset.index;
                    if (index === undefined) return;

                    if (target.classList.contains('toggle-complete')) {
                        objectives[index].completed = target.checked;
                        saveToStorage(storageKey, objectives);
                        renderObjectives();
                    }

                    if (target.classList.contains('delete-objective-btn')) {
                        if (confirm('Are you sure you want to delete this objective?')) {
                            objectives.splice(index, 1);
                            saveToStorage(storageKey, objectives);
                            renderObjectives();
                        }
                    }
                });
                renderObjectives();
            }

            setupInfoModule();
            setupProgressModule();
            setupObjectivesModule();
            if (typeof window.setupScrollAnimations === 'function') {
                window.setupScrollAnimations();
            }
        },
        booking: async function () {
            const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
            if (!loggedInUser) {
                showNotification('You must be logged in to access checkout.', 'error');
                localStorage.setItem('redirectAfterLogin', 'booking');
                loadPage('login');
                return;
            }

            let paidCartData = null;
            const welcomeBanner = document.getElementById("welcome-banner");
            const saleBanner = document.getElementById("summerSaleBanner");
            const currencySymbol = '€';

            const cartList = document.getElementById('cart-items-list');
            const cartTotalEl = document.getElementById('cart-total');
            const totalPriceValueEl = document.getElementById('total-price-value');
            const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');

            const bookingForm = document.getElementById("bookingForm");
            const typeRadios = document.querySelectorAll('input[name="bookingType"]');
            const serviceSelectGroup = document.getElementById('serviceSelectGroup');
            const serviceSelect = document.getElementById("serviceSelect");
            const serviceSelectLabel = document.getElementById("serviceSelectLabel");
            const instructorSelectGroup = document.getElementById('instructorSelectGroup');
            const instructorSelect = document.getElementById("instructorSelect");
            const subscriptionSelectGroup = document.getElementById('subscriptionSelectGroup');
            const subscriptionSelect = document.getElementById("subscriptionSelect");
            const addToCartBtn = document.getElementById('addToCartBtn');

            const paymentModalOverlay = document.getElementById('paymentModalOverlay');
            const closePaymentModalBtn = document.getElementById('closePaymentModal');


            let servicesData = [];
            try {
                const response = await fetch('pages/services.html');
                if (!response.ok) throw new Error("Could not load services data.");
                const htmlText = await response.text();
                const parser = new DOMParser();
                const servicesDoc = parser.parseFromString(htmlText, 'text/html');

                servicesDoc.querySelectorAll('.sv-card[data-id]').forEach(card => {
                    servicesData.push({
                        id: card.dataset.id,
                        name: card.dataset.name,
                        price: parseFloat(card.dataset.price),
                        type: card.dataset.type,
                        instructors: (card.dataset.instructors || '').split(',').map(n => n.trim()).filter(Boolean)
                    });
                });
            } catch (error) {
                console.error("Error fetching data from services.html:", error.message);
            }

            function updateViewState() {
                const cart = JSON.parse(localStorage.getItem('userCart')) || [];
                const shouldShowPayment = cart.length > 0;
                proceedToPaymentBtn.style.display = shouldShowPayment ? 'inline-block' : 'none';
                cartTotalEl.style.display = shouldShowPayment ? 'block' : 'none';
            }

            function renderCart() {
                const cart = JSON.parse(localStorage.getItem('userCart')) || [];
                cartList.innerHTML = '';
                let subtotal = 0;
                const isAugustSale = new Date().getMonth() === 7;
                if (cart.length === 0) {
                    cartList.innerHTML = '<li class="empty-cart-message">Your cart is empty. Add services from the <a href="#" data-page="services">services page</a> or use the form below.</li>';
                } else {
                    cart.forEach(item => {
                        subtotal += item.price;
                    });

                    cart.forEach((item, index) => {
                        const li = document.createElement('li');
                        li.innerHTML = `
                    <span>${item.name}</span>
                    <div class="cart-item-details">
                        <strong>${item.price.toFixed(2)} ${currencySymbol}</strong>
                        <button class="remove-item-btn" data-index="${index}" title="Remove item">×</button>
                    </div>`;
                        cartList.appendChild(li);
                    });
                }

                let finalTotal = subtotal;
                if (isAugustSale && subtotal > 0) {
                    const discount = subtotal * 0.20;
                    finalTotal -= discount;
                    const discountLi = document.createElement('li');
                    discountLi.className = 'discount-item';
                    discountLi.innerHTML = `<span><i class="fas fa-tag"></i> Summer Sale (20% Off)</span><strong style="color: #28a745;">-${discount.toFixed(2)} ${currencySymbol}</strong>`;
                    cartList.appendChild(discountLi);
                    if (saleBanner) {
                        saleBanner.innerHTML = `<i class="fas fa-sun"></i> Summer Sale is active! Enjoy 20% off all services!`;
                        saleBanner.style.display = 'block';
                    }
                } else {
                    if (saleBanner) saleBanner.style.display = 'none';
                }

                if (totalPriceValueEl) totalPriceValueEl.textContent = `${finalTotal.toFixed(2)} ${currencySymbol}`;
                updateViewState();
            }

            function resetBookingForm() {
                serviceSelectGroup.classList.add('hidden');
                instructorSelectGroup.classList.add('hidden');
                subscriptionSelectGroup.classList.add('hidden');
                addToCartBtn.disabled = true;
                if (bookingForm) bookingForm.reset();
            }

            function generateInvoicePDF() {
                const cart = paidCartData;
                if (typeof window.jspdf === 'undefined') {
                    console.error('PDF generation library (jspdf) not found.');
                    return;
                }
                if (!cart || cart.length === 0) {
                    console.error("Attempted to generate an invoice for an empty or invalid cart.");
                    showNotification("Could not generate invoice: cart is empty.", "error");
                    return;
                }

                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();

                const brandColor = '#AE3121';
                const headerBgColor = '#F5F5F5';
                const textColor = '#333333';
                const lightTextColor = '#777777';
                const margin = 15;
                const page_width = doc.internal.pageSize.getWidth();
                let y = 0;

                y = margin + 10;

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(16);
                doc.setTextColor(textColor);
                doc.text('Reboot Fitness', margin, y);

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);
                doc.setTextColor(lightTextColor);
                doc.text('Rruga e Elbasanit, Tirana, Albania', margin, y + 7);
                doc.text('support@rebootfitness.com', margin, y + 14);

                doc.setFont('helvetica', 'bold');
                doc.setFontSize(26);
                doc.setTextColor(textColor);
                doc.text('INVOICE', page_width - margin, y, {
                    align: 'right'
                });

                y += 25;
                doc.setDrawColor(220, 220, 220);
                doc.line(margin, y, page_width - margin, y);

                y += 10;
                const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
                const today = new Date().toLocaleDateString('en-GB');

                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(lightTextColor);
                doc.text('BILL TO', margin, y);
                doc.text('INVOICE #', page_width - margin - 45, y);
                doc.text('DATE', page_width - margin - 45, y + 7);

                doc.setFont('helvetica', 'normal');
                doc.setTextColor(textColor);
                doc.setFontSize(11);
                doc.text(loggedInUser.name, margin, y + 7);
                doc.text(invoiceNumber, page_width - margin, y, {
                    align: 'right'
                });
                doc.text(today, page_width - margin, y + 7, {
                    align: 'right'
                });
                y += 25;

                let subtotal = 0;
                const isAugustSale = new Date().getMonth() === 7;

                doc.setFillColor(headerBgColor);
                doc.rect(margin, y, page_width - (margin * 2), 10, 'F');
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(textColor);
                doc.text('DESCRIPTION', margin + 5, y + 7);
                doc.text('AMOUNT', page_width - margin - 5, y + 7, {
                    align: 'right'
                });
                y += 10;

                doc.setFont('helvetica', 'normal');
                doc.setFontSize(10);

                cart.forEach(item => {
                    subtotal += item.price;
                    y += 10;
                    doc.setDrawColor(240, 240, 240);
                    doc.line(margin, y + 3, page_width - margin, y + 3);
                    doc.setTextColor(textColor);
                    doc.text(item.name, margin + 5, y);
                    doc.text(`${item.price.toFixed(2)} ${currencySymbol}`, page_width - margin - 5, y, {
                        align: 'right'
                    });
                });
                y += 15;

                let finalTotal = subtotal;

                if (isAugustSale && subtotal > 0) {
                    const discount = subtotal * 0.20;
                    finalTotal -= discount;

                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(brandColor);
                    doc.text('Summer Sale (20%)', page_width - margin - 45, y);
                    doc.text(`-${discount.toFixed(2)} ${currencySymbol}`, page_width - margin - 5, y, {
                        align: 'right'
                    });
                    y += 10;
                }

                doc.setDrawColor(textColor);
                doc.line(page_width / 1.8, y, page_width - margin, y);
                y += 8;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(16);
                doc.setTextColor(textColor);
                doc.text('TOTAL', page_width - margin - 45, y);
                doc.setFontSize(18);
                doc.setTextColor(brandColor);
                doc.text(`${finalTotal.toFixed(2)} ${currencySymbol}`, page_width - margin, y, {
                    align: 'right'
                });

                y = doc.internal.pageSize.getHeight() - 30;
                doc.setDrawColor(220, 220, 220);
                doc.line(margin, y, page_width - margin, y);
                y += 10;
                doc.setFontSize(9);
                doc.setTextColor(lightTextColor);
                doc.text('Thank you for choosing Reboot Fitness!', page_width / 2, y, {
                    align: 'center'
                });
                doc.text('Transform your body, empower your mind. Join the movement.', page_width / 2, y + 6, {
                    align: 'center'
                });

                doc.save(`invoice_RebootFitness_${invoiceNumber}.pdf`);
            }

            function generateDietPDF() {
                if (typeof window.jspdf === 'undefined') {
                    console.error('PDF generation library not found.');
                    return;
                }
                const dietPlan = JSON.parse(localStorage.getItem('personalizedDietPlan'));
                if (!dietPlan) {
                    console.error('Could not find the personalized diet plan data.');
                    return;
                }
                const {
                    jsPDF
                } = window.jspdf;
                const doc = new jsPDF();
                let y = 20,
                    margin = 20;

                doc.setFont('helvetica', 'bold').setFontSize(20).text('Your Personalized Diet Plan', margin, y);
                y += 10;
                doc.setFont('helvetica', 'normal').setFontSize(12).text(`Prepared for: ${loggedInUser.name}`, margin, y);
                y += 7;
                doc.text(`Your calculated BMI: ${dietPlan.bmi}`, margin, y);
                y += 7;
                doc.setFont('helvetica', 'bold').text(`System-Recommended Goal: ${dietPlan.goal.charAt(0).toUpperCase() + dietPlan.goal.slice(1)}`, margin, y);
                y += 15;
                doc.setFont('helvetica', 'normal').setFontSize(14).text('General Guidelines', margin, y);
                y += 8;
                doc.setFont('helvetica', 'bold').setFontSize(10).text('Focus On:', margin, y);
                doc.setFont('helvetica', 'normal').text(dietPlan.summary.more, margin + 25, y, {
                    maxWidth: 145
                });
                y += 12;
                doc.setFont('helvetica', 'bold').text('Limit:', margin, y);
                doc.setFont('helvetica', 'normal').text(dietPlan.summary.less, margin + 25, y, {
                    maxWidth: 145
                });
                y += 15;
                doc.line(margin, y - 5, 190, y - 5);
                doc.setFont('helvetica', 'bold').setFontSize(14).text('Meal Plan Structure & Alternatives', margin, y);
                y += 10;
                dietPlan.meals.forEach(meal => {
                    if (y > 260) {
                        doc.addPage();
                        y = 20;
                    }
                    doc.setFont('helvetica', 'bold').setFontSize(12).text(meal.name, margin, y);
                    y += 7;
                    meal.options.forEach(option => {
                        doc.setFont('helvetica', 'normal').setFontSize(10).text(`- ${option}`, margin + 5, y);
                        y += 6;
                    });
                    y += 4;
                });
                localStorage.removeItem('personalizedDietPlan');
                doc.save(`Diet_Plan_${loggedInUser.name.replace(/\s/g, '_')}.pdf`);
                const downloadDietBtn = document.getElementById('downloadDietBtn');
                if (downloadDietBtn) {
                    downloadDietBtn.disabled = true;
                    downloadDietBtn.textContent = 'Downloaded';
                }
            }


            function showDownloadOptions() {
                const hasGeneratedPlan = !!localStorage.getItem('personalizedDietPlan');
                const modalBody = document.querySelector('#paymentModal .modal-body');
                if (!modalBody) return;

                modalBody.innerHTML = `
            <div class="thank-you-message">
                <h2><i class="fas fa-check-circle" style="color:#28a745;"></i> Payment Successful!</h2>
                <p>Choose what you would like to download:</p>
                <div class="booking-actions">
                    <button type="button" id="downloadInvoiceBtn" class="cta-button">Download Invoice</button>
                    ${hasGeneratedPlan ? '<button type="button" id="downloadDietBtn" class="cta-button secondary">Download Personalized Diet</button>' : ''}
                </div>
            </div>`;

                const downloadInvoiceBtn = document.getElementById('downloadInvoiceBtn');
                if (downloadInvoiceBtn) {
                    downloadInvoiceBtn.addEventListener('click', generateInvoicePDF);
                }

                if (hasGeneratedPlan) {
                    const downloadDietBtn = document.getElementById('downloadDietBtn');
                    if (downloadDietBtn) {
                        downloadDietBtn.addEventListener('click', generateDietPDF);
                    }
                }
            }

            function handlePaymentSubmit(e) {
                e.preventDefault();
                const cardName = document.getElementById('cardName').value.trim();
                const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
                const cardExpiry = document.getElementById('cardExpiry').value;
                const cardCVC = document.getElementById('cardCVC').value;
                if (!/^[a-zA-Z\s.-]+$/.test(cardName)) {
                    showNotification('Name on card must contain only letters.', 'error');
                    return;
                }
                if (cardNumber.length !== 16 || isNaN(cardNumber)) {
                    showNotification('Card number must be 16 digits.', 'error');
                    return;
                }
                if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                    showNotification('Expiry date must be in MM/YY format.', 'error');
                    return;
                }
                if (cardCVC.length !== 3 || isNaN(cardCVC)) {
                    showNotification('CVC must be 3 digits.', 'error');
                    return;
                }

                showNotification('Payment processed successfully!', 'success');

                paidCartData = JSON.parse(localStorage.getItem('userCart')) || [];

                localStorage.removeItem('userCart');

                updateUserNav();

                showDownloadOptions();
            }

            function openPaymentModal() {
                const modalBody = document.querySelector('#paymentModal .modal-body');
                if (!modalBody) return;
                modalBody.innerHTML = `
            <form id="paymentForm" novalidate>
                <div class="form-group"><label for="cardName">Name on Card</label><input type="text" id="cardName" placeholder="John M. Doe" required></div>
                <div class="form-group"><label for="cardNumber">Card Number</label><input type="text" id="cardNumber" placeholder="xxxx xxxx xxxx xxxx" required></div>
                <div class="form-row">
                    <div class="form-group"><label for="cardExpiry">Expiry Date</label><input type="text" id="cardExpiry" placeholder="MM/YY" required></div>
                    <div class="form-group"><label for="cardCVC">CVC</label><input type="text" id="cardCVC" placeholder="123" required></div>
                </div>
                <button type="submit" class="cta-button">Pay & Generate Invoice</button>
            </form>`;

                const paymentFormInModal = document.getElementById('paymentForm');
                paymentFormInModal.querySelector('#cardNumber').addEventListener('input', e => e.target.value = e.target.value.replace(/\D/g, '').substring(0, 16).replace(/(\d{4})/g, '$1 ').trim());
                paymentFormInModal.querySelector('#cardExpiry').addEventListener('input', e => {
                    let v = e.target.value.replace(/\D/g, '').substring(0, 4);
                    e.target.value = v.length > 2 ? v.substring(0, 2) + '/' + v.substring(2) : v;
                });
                paymentFormInModal.addEventListener('submit', handlePaymentSubmit);

                if (paymentModalOverlay) paymentModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }

            function closePaymentModal() {
                if (paymentModalOverlay) paymentModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                renderCart();
                updateUserNav();
            }


            proceedToPaymentBtn.addEventListener('click', openPaymentModal);
            closePaymentModalBtn.addEventListener('click', closePaymentModal);
            paymentModalOverlay.addEventListener('click', (e) => {
                if (e.target === paymentModalOverlay) closePaymentModal();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && paymentModalOverlay.classList.contains('active')) closePaymentModal();
            });

            typeRadios.forEach(radio => radio.addEventListener('change', (e) => {
                resetBookingForm();
                const selectedType = e.target.value;
                const filteredServices = servicesData.filter(s => s.type === selectedType);
                serviceSelectLabel.textContent = `Choose Your ${selectedType === 'class' ? 'Class' : 'Program'}`;
                serviceSelect.innerHTML = `<option value="">Select an option...</option>`;
                filteredServices.forEach(service => {
                    serviceSelect.innerHTML += `<option value="${service.id}">${service.name}</option>`;
                });
                serviceSelectGroup.classList.remove('hidden');
            }));

            serviceSelect.addEventListener("change", () => {
                const service = servicesData.find(s => s.id === serviceSelect.value);
                instructorSelectGroup.classList.add('hidden');
                subscriptionSelectGroup.classList.add('hidden');
                addToCartBtn.disabled = true;
                if (!service) return;

                if (service.type === 'class' && service.instructors && service.instructors.length > 0) {
                    instructorSelect.innerHTML = '<option value="">Select an instructor...</option>';
                    service.instructors.forEach(name => instructorSelect.innerHTML += `<option value="${name}">${name}</option>`);
                    instructorSelectGroup.classList.remove('hidden');
                } else {
                    addToCartBtn.disabled = false;
                }
            });

            instructorSelect.addEventListener("change", () => {
                subscriptionSelectGroup.classList.add('hidden');
                if (instructorSelect.value) {
                    subscriptionSelect.innerHTML = `<option value="">Select a plan...</option><option value="monthly">Monthly Plan</option><option value="annual">Annual Plan (20% Off)</option>`;
                    subscriptionSelectGroup.classList.remove('hidden');
                }
            });

            subscriptionSelect.addEventListener("change", () => {
                addToCartBtn.disabled = !subscriptionSelect.value;
            });

            addToCartBtn.addEventListener('click', () => {
                const serviceId = serviceSelect.value;
                const service = servicesData.find(s => s.id === serviceId);
                if (!service) return;

                let cart = JSON.parse(localStorage.getItem('userCart')) || [];
                let itemToAdd = {
                    ...service
                };

                if (service.type === 'class' && subscriptionSelect.value === 'annual') {
                    itemToAdd.name = `${service.name} - Annual Plan`;
                    itemToAdd.price = service.price * 12 * 0.8;
                    itemToAdd.id = `${service.id}_annual`;
                }

                if (cart.some(item => item.id === itemToAdd.id)) {
                    showNotification('This service is already in your cart.', 'warning');
                } else {
                    cart.push(itemToAdd);
                    localStorage.setItem('userCart', JSON.stringify(cart));
                    showNotification(`${itemToAdd.name} added to cart!`, 'success');
                    renderCart();
                    updateUserNav();
                }
                resetBookingForm();
            });


            cartList.addEventListener('click', (e) => {
                if (e.target.classList.contains('remove-item-btn')) {
                    const indexToRemove = parseInt(e.target.dataset.index, 10);
                    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
                    if (cart[indexToRemove]) {
                        showNotification(`'${cart[indexToRemove].name}' removed from cart.`, 'info');
                        cart.splice(indexToRemove, 1);
                        localStorage.setItem('userCart', JSON.stringify(cart));
                        renderCart();
                        updateUserNav();
                    }
                }
            });

            if (welcomeBanner) welcomeBanner.innerHTML = `Welcome, <strong>${loggedInUser.name}</strong>! Review your cart or add new services.`;
            renderCart();
            resetBookingForm();
        },
        nutrition: function () {

            function setupNutritionTabs() {
                const tabButtons = document.querySelectorAll('.np-tab-btn');
                const mealPlans = document.querySelectorAll('.np-meal-plan');
                if (!tabButtons.length || !mealPlans.length) return;

                tabButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        mealPlans.forEach(plan => plan.classList.remove('active'));
                        button.classList.add('active');
                        const targetPlan = document.getElementById(`plan-${button.dataset.tab}`);
                        if (targetPlan) targetPlan.classList.add('active');
                    });
                });
            }

            function setupCalorieCalculator() {
                const form = document.getElementById('np-calculator-form');
                const resultsContainer = document.getElementById('np-results-container');
                if (!form || !resultsContainer) return;

                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const age = parseInt(document.getElementById('age').value);
                    const gender = document.getElementById('gender').value;
                    const weight = parseFloat(document.getElementById('weight').value);
                    const height = parseFloat(document.getElementById('height').value);
                    const activity = parseFloat(document.getElementById('activity').value);

                    if (isNaN(age) || isNaN(weight) || isNaN(height) || age <= 0 || weight <= 0 || height <= 0) {
                        showNotification('Please enter valid, positive numbers for all fields.', 'error');
                        return;
                    }

                    let bmr = (gender === 'male') ? (10 * weight + 6.25 * height - 5 * age + 5) : (10 * weight + 6.25 * height - 5 * age - 161);
                    const tdee = bmr * activity;

                    resultsContainer.innerHTML = `
                <h3>Your Estimated Daily Needs (for maintenance):</h3>
                <p><strong>Calories:</strong> ${Math.round(tdee)} kcal</p>
                <p>To lose weight, aim for a deficit (e.g., ~${Math.round(tdee - 400)} kcal). To gain mass, aim for a surplus (e.g., ~${Math.round(tdee + 400)} kcal).</p>
                <small>This is a general estimate. For a fully detailed plan, purchase the custom plan below.</small>
            `;
                    resultsContainer.style.display = 'block';
                });
            }
            function generatePersonalizedDiet(details) {
                let bmr = (details.gender === 'male')
                    ? (10 * details.weight + 6.25 * details.height - 5 * details.age + 5)
                    : (10 * details.weight + 6.25 * details.height - 5 * details.age - 161);

                // Llogarisim TDEE (Total Daily Energy Expenditure)
                const tdee = bmr * details.activity;

                // Përcaktojmë qëllimin (goal) dhe kaloritë e synuara
                let goal, targetCalories;
                if (details.bmi < 18.5) {
                    goal = 'Mass Gain';
                    targetCalories = tdee + 400;
                } else if (details.bmi >= 25) {
                    goal = 'Weight Loss';
                    targetCalories = tdee - 400;
                } else {
                    goal = 'Maintenance';
                    targetCalories = tdee;
                }

                // Krijojmë planin bazuar te qëllimi
                let diet = {
                    goal: goal,
                    bmi: details.bmi.toFixed(1),
                    targetCalories: Math.round(targetCalories),
                    summary: {},
                    meals: []
                };

                // Përmbajtja e dietave (mund ta zgjerosh me më shumë opsione)
                const mealDatabase = {
                    loss: {
                        summary: { more: "Lean proteins (chicken, fish), leafy greens, berries, water.", less: "Sugary drinks, fried foods, processed snacks, refined carbs." },
                        meals: [
                            { name: 'Breakfast (Choose one)', options: ['Oatmeal with berries and a scoop of protein', '3 scrambled egg whites with spinach', 'Greek yogurt with almonds'] },
                            { name: 'Lunch (Choose one)', options: ['Large grilled chicken salad with vinaigrette', 'Lentil soup with a side of greens', 'Tuna salad (in water) with whole wheat crackers'] },
                            { name: 'Dinner (Choose one)', options: ['Baked salmon with roasted asparagus', 'Turkey meatballs with zucchini noodles', 'Cod fillet with steamed broccoli'] },
                            { name: 'Snacks (Choose one)', options: ['Apple with 1 tbsp almond butter', 'A handful of walnuts', 'Carrot sticks with hummus'] }
                        ]
                    },
                    gain: {
                        summary: { more: "Calorie-dense foods, complex carbs (oats, rice), healthy fats (avocado, nuts), frequent meals.", less: "Junk food, excessive simple sugars, skipping meals." },
                        meals: [
                            { name: 'Breakfast (Choose one)', options: ['Large bowl of oatmeal with banana, nuts, and whey protein', '4-egg omelette with cheese and whole wheat toast', 'Beef and egg scramble'] },
                            { name: 'Lunch (Choose one)', options: ['Large portion of ground beef with brown rice and vegetables', 'Chicken thighs with sweet potato and avocado', 'Whole wheat pasta with a rich meat sauce'] },
                            { name: 'Dinner (Choose one)', options: ['Steak with roasted potatoes and greens', 'Large salmon fillet with quinoa and olive oil', 'Double chicken breast with whole wheat pasta'] },
                            { name: 'Snacks (Choose one or two)', options: ['Peanut butter sandwich on whole wheat bread', 'Full-fat Greek yogurt with honey', 'Weight gainer shake with milk'] }
                        ]
                    },
                    maintain: {
                        summary: { more: "A balanced mix of all macronutrients, whole foods, consistent meal timing.", less: "Extreme portion sizes, overly processed foods, inconsistent eating habits." },
                        meals: [
                            { name: 'Breakfast (Choose one)', options: ['2 boiled eggs with rye toast and avocado', 'Oatmeal with mixed seeds and fruit', 'Balanced smoothie (protein, carbs, fats)'] },
                            { name: 'Lunch (Choose one)', options: ['Roasted chicken breast with a moderate portion of quinoa and salad', 'Burrito bowl with balanced toppings', 'Whole wheat wrap with turkey, cheese, and veggies'] },
                            { name: 'Dinner (Choose one)', options: ['Grilled fish with a side of brown rice and steamed vegetables', 'Lean pork chop with a baked sweet potato', 'Tofu and vegetable stir-fry with a light sauce'] },
                            { name: 'Snacks (Choose one)', options: ['A handful of almonds', 'Greek Yogurt', 'A piece of dark chocolate'] }
                        ]
                    }
                };

                if (goal === 'Weight Loss') diet = { ...diet, ...mealDatabase.loss };
                else if (goal === 'Mass Gain') diet = { ...diet, ...mealDatabase.gain };
                else diet = { ...diet, ...mealDatabase.maintain };

                return diet;
            }

            function setupDietModal() {
                const getPlanBtn = document.getElementById('getCustomPlanBtn');
                const dietModalOverlay = document.getElementById('dietModalOverlay');
                const closeDietModalBtn = document.getElementById('closeDietModalBtn');
                const dietForm = document.getElementById('dietPersonalizationForm');

                if (!getPlanBtn || !dietModalOverlay || !closeDietModalBtn || !dietForm) return;

                const openModal = () => dietModalOverlay.classList.add('active');
                const closeModal = () => dietModalOverlay.classList.remove('active');

                getPlanBtn.addEventListener('click', () => {
                    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                    if (!loggedInUser) {
                        showNotification('Please log in or sign up to create a custom plan.', 'info');
                        localStorage.setItem('redirectAfterLogin', 'nutrition');
                        loadPage('login');
                        return;
                    }
                    const progressHistory = JSON.parse(localStorage.getItem(`progressHistory_${loggedInUser.email}`)) || [];
                    if (progressHistory.length > 0) {
                        const latestEntry = progressHistory[progressHistory.length - 1];
                        if (document.getElementById('dietWeight')) document.getElementById('dietWeight').value = latestEntry.weight || '';
                        if (document.getElementById('dietHeight')) document.getElementById('dietHeight').value = latestEntry.height || '';
                    }
                    openModal();
                });

                closeDietModalBtn.addEventListener('click', closeModal);
                dietModalOverlay.addEventListener('click', (e) => { if (e.target === dietModalOverlay) closeModal(); });
                document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && dietModalOverlay.classList.contains('active')) closeModal(); });

                dietForm.addEventListener('submit', (e) => {
                    e.preventDefault();

                    const details = {
                        gender: document.getElementById('dietGender')?.value,
                        age: parseInt(document.getElementById('dietAge')?.value),
                        weight: parseFloat(document.getElementById('dietWeight')?.value),
                        height: parseFloat(document.getElementById('dietHeight')?.value),
                        activity: parseFloat(document.getElementById('dietActivity')?.value)
                    };

                    if (Object.values(details).some(val => !val || (typeof val === 'number' && isNaN(val)) || val <= 0)) {
                        showNotification('Please fill all fields with valid, positive numbers.', 'warning');
                        return;
                    }

                    const heightInMeters = details.height / 100;
                    details.bmi = details.weight / (heightInMeters ** 2);

                    const personalizedDiet = generatePersonalizedDiet(details);

                    localStorage.setItem('personalizedDietPlan', JSON.stringify(personalizedDiet));

                    const dietPlanProduct = { id: 'custom_diet_01', name: 'Personalized Diet Plan', price: 50.00, type: 'service' };
                    let cart = JSON.parse(localStorage.getItem('userCart')) || [];
                    if (!cart.some(item => item.id === dietPlanProduct.id)) {
                        cart.push(dietPlanProduct);
                        localStorage.setItem('userCart', JSON.stringify(cart));
                    }

                    closeModal();
                    showNotification(`Based on your data, a ${personalizedDiet.goal} plan is ready! Proceed to payment.`, 'success');
                    updateUserNav();
                    loadPage('booking');
                });
            }

            setupNutritionTabs();
            setupCalorieCalculator();
            setupDietModal();
        },


    };
    const originalMenuCenter = document.querySelector('.menu-center');
    const originalNavAction = document.getElementById('navAction');

    const mobileMenuPanel = document.createElement('div');
    mobileMenuPanel.className = 'mobile-menu-panel';
    document.body.appendChild(mobileMenuPanel);

    function toggleMenu(forceClose = false) {
        const isOpen = mobileMenuPanel.classList.contains('open');

        if (forceClose || isOpen) {
            hamburgerBtn.classList.remove('active');
            mobileMenuPanel.classList.remove('open');
            document.body.classList.remove('menu-open');
        } else {

            mobileMenuPanel.innerHTML = '';
            document.querySelectorAll('.menu-center .nav-link').forEach(link => {
                mobileMenuPanel.appendChild(link.cloneNode(true));
            });

            const currentNavAction = document.getElementById('navAction');
            if (currentNavAction) {
                mobileMenuPanel.appendChild(currentNavAction.cloneNode(true));
            }

            hamburgerBtn.classList.add('active');
            mobileMenuPanel.classList.add('open');
            document.body.classList.add('menu-open');
        }
    }

    document.addEventListener('click', (event) => {
        const target = event.target;

        if (target.closest('.hamburger')) {
            toggleMenu();
            return;
        }

        const navLink = target.closest('[data-page]');
        if (navLink) {
            event.preventDefault();

            toggleMenu(true);

            setTimeout(() => {
                loadPage(navLink.dataset.page);
            }, 300);

            return;
        }

        if (mobileMenuPanel.classList.contains('open') && !mobileMenuPanel.contains(target)) {
            toggleMenu(true);
        }
    });

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const card = e.target.closest('.sv-card');
            if (!card) return;

            const itemToAdd = {
                id: card.dataset.id,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                type: card.dataset.type,
                instructors: (card.dataset.instructors || '').split(',').map(n => n.trim()).filter(Boolean)
            };

            if (!itemToAdd.id || !itemToAdd.name || isNaN(itemToAdd.price)) {
                console.error("Karta e shërbimit ka të dhëna të paplota.", card);
                showNotification('Ky shërbim nuk mund të shtohet.', 'error');
                return;
            }

            let cart = JSON.parse(localStorage.getItem('userCart')) || [];

            if (cart.some(item => item.id === itemToAdd.id)) {
                showNotification('Ky shërbim është tashmë në shportën tuaj.', 'warning');

            } else {
                cart.push(itemToAdd);
                localStorage.setItem('userCart', JSON.stringify(cart));
                showNotification(`'${itemToAdd.name}' u shtua në shportë!`, 'success');
                updateUserNav();
            }
        }
    });
    updateUserNav();
    loadPage('home');
});