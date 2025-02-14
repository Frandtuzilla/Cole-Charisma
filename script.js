// ==========================================================================
// Table of Contents:
// 1. Constants & Variables
// 2. Smooth Scroll
// 3. Main Slider Functionality
//    3.1 Slide Management
//    3.2 Navigation Controls
//    3.3 Auto Slide
// 4. Social Posts Slider
//    4.1 Social Slide Management
//    4.2 Social Navigation Controls
//    4.3 Social Auto Slide
// 5. Event Listeners
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Constants & Variables for Main Slider
    // ==========================================================================
    const mainSliderElements = {
        container: document.querySelector('.slider'),
        slides: document.querySelectorAll('.slide'),
        prevBtn: document.querySelector('.slider-nav .prev-btn'),
        nextBtn: document.querySelector('.slider-nav .next-btn'),
        readMoreBtns: document.querySelectorAll('.read-more-btn')
    };

    const mainSliderConfig = {
        currentIndex: 0,
        totalSlides: mainSliderElements.slides.length,
        autoSlideDelay: 5000,
        autoSlideInterval: null,
        isTransitioning: false
    };

    // Social Posts Slider Elements
    const socialSliderElements = {
        container: document.querySelector('.posts-container'),
        grid: document.querySelector('.posts-grid'),
        posts: document.querySelectorAll('.post'),
        prevBtn: document.querySelector('.post-navigation .prev'),
        nextBtn: document.querySelector('.post-navigation .next')
    };

    const socialSliderConfig = {
        currentPosition: 0,
        postsPerView: window.innerWidth > 768 ? 3 : 1,
        totalPosts: socialSliderElements.posts?.length || 0,
        isTransitioning: false,
        autoSlideDelay: 5000,
        autoSlideInterval: null
    };

    // 2. Smooth Scroll
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', event => {
                const href = link.getAttribute('href');
                
                // Check if the link is to another page (contains .html or starts with http/https)
                if (href.includes('.html') || href.startsWith('http')) {
                    return; // Let the default navigation happen
                }
                
                // Only prevent default for same-page anchor links
                event.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
    
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 3. Main Slider Functionality remains the same
    // ==========================================================================
    function initializeMainSlides() {
        mainSliderElements.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
        });
    }

    function updateMainSlides() {
        if (mainSliderConfig.isTransitioning) return;
        
        mainSliderConfig.isTransitioning = true;

        mainSliderElements.slides.forEach((slide, index) => {
            const offset = 100 * (index - mainSliderConfig.currentIndex);
            slide.style.transform = `translateX(${offset}%)`;
        });

        setTimeout(() => {
            mainSliderConfig.isTransitioning = false;
        }, 500);
    }

    function nextMainSlide() {
        if (mainSliderConfig.isTransitioning) return;
        mainSliderConfig.currentIndex = (mainSliderConfig.currentIndex + 1) % mainSliderConfig.totalSlides;
        updateMainSlides();
    }

    function prevMainSlide() {
        if (mainSliderConfig.isTransitioning) return;
        mainSliderConfig.currentIndex = (mainSliderConfig.currentIndex - 1 + mainSliderConfig.totalSlides) % mainSliderConfig.totalSlides;
        updateMainSlides();
    }

    // 4. Social Posts Slider - Updated for infinite scrolling
    // ==========================================================================
    function updateSocialSlides() {
        if (socialSliderConfig.isTransitioning) return;
        
        socialSliderConfig.isTransitioning = true;

        const postWidth = socialSliderElements.posts[0]?.offsetWidth || 0;
        const gap = 30;
        const slideDistance = (postWidth + gap) * socialSliderConfig.currentPosition;

        if (socialSliderElements.grid) {
            socialSliderElements.grid.style.transform = `translateX(-${slideDistance}px)`;
        }

        setTimeout(() => {
            socialSliderConfig.isTransitioning = false;
        }, 500);

        updateSocialButtonStates();
    }

    function slideCards(direction) {
        if (socialSliderConfig.isTransitioning) return;
    
        const totalVisibleSlides = socialSliderConfig.totalPosts - socialSliderConfig.postsPerView;
    
        if (direction === 'next') {
            if (socialSliderConfig.currentPosition >= totalVisibleSlides) {
                // Reset to beginning without animation
                socialSliderElements.grid.style.transition = 'none';
                socialSliderConfig.currentPosition = 0;
                const slideDistance = 0;
                socialSliderElements.grid.style.transform = `translateX(-${slideDistance}px)`;
                
                // Force reflow
                socialSliderElements.grid.offsetHeight;
                
                // Re-enable transition
                socialSliderElements.grid.style.transition = 'transform 0.5s ease';
            } else {
                socialSliderConfig.currentPosition++;
                const postWidth = socialSliderElements.posts[0]?.offsetWidth || 0;
                const gap = 30;
                const slideDistance = (postWidth + gap) * socialSliderConfig.currentPosition;
                socialSliderElements.grid.style.transform = `translateX(-${slideDistance}px)`;
            }
        } else if (direction === 'prev') {
            if (socialSliderConfig.currentPosition <= 0) {
                // Jump to end without animation
                socialSliderElements.grid.style.transition = 'none';
                socialSliderConfig.currentPosition = totalVisibleSlides;
                const postWidth = socialSliderElements.posts[0]?.offsetWidth || 0;
                const gap = 30;
                const slideDistance = (postWidth + gap) * socialSliderConfig.currentPosition;
                socialSliderElements.grid.style.transform = `translateX(-${slideDistance}px)`;
                
                // Force reflow
                socialSliderElements.grid.offsetHeight;
                
                // Re-enable transition
                socialSliderElements.grid.style.transition = 'transform 0.5s ease';
            } else {
                socialSliderConfig.currentPosition--;
                const postWidth = socialSliderElements.posts[0]?.offsetWidth || 0;
                const gap = 30;
                const slideDistance = (postWidth + gap) * socialSliderConfig.currentPosition;
                socialSliderElements.grid.style.transform = `translateX(-${slideDistance}px)`;
            }
        }
    
        resetSocialAutoSlide();
    }

    // UPDATED: Modified for infinite scrolling
    function updateSocialButtonStates() {
        if (!socialSliderElements.prevBtn || !socialSliderElements.nextBtn) return;
        
        // Always show active buttons for infinite scroll
        socialSliderElements.prevBtn.style.opacity = '1';
        socialSliderElements.prevBtn.style.cursor = 'pointer';
        socialSliderElements.nextBtn.style.opacity = '1';
        socialSliderElements.nextBtn.style.cursor = 'pointer';
    }

    // Auto Slide Functions
    function startMainAutoSlide() {
        mainSliderConfig.autoSlideInterval = setInterval(nextMainSlide, mainSliderConfig.autoSlideDelay);
    }

    function stopMainAutoSlide() {
        clearInterval(mainSliderConfig.autoSlideInterval);
    }

    function resetMainAutoSlide() {
        stopMainAutoSlide();
        startMainAutoSlide();
    }

    // UPDATED: Modified for infinite scrolling
    function startSocialAutoSlide() {
        if (!socialSliderElements.grid) return;
        
        socialSliderConfig.autoSlideInterval = setInterval(() => {
            slideCards('next');
        }, socialSliderConfig.autoSlideDelay);
    }

    function stopSocialAutoSlide() {
        clearInterval(socialSliderConfig.autoSlideInterval);
    }

    function resetSocialAutoSlide() {
        stopSocialAutoSlide();
        startSocialAutoSlide();
    }

    // 5. Event Listeners
    // ==========================================================================
    function initMainSliderControls() {
        if (!mainSliderElements.container) return;

        mainSliderElements.prevBtn?.addEventListener('click', () => {
            prevMainSlide();
            resetMainAutoSlide();
        });

        mainSliderElements.nextBtn?.addEventListener('click', () => {
            nextMainSlide();
            resetMainAutoSlide();
        });

        mainSliderElements.container.addEventListener('mouseenter', stopMainAutoSlide);
        mainSliderElements.container.addEventListener('mouseleave', startMainAutoSlide);

        let mainTouchStartX = 0;
        let mainTouchEndX = 0;

        mainSliderElements.container.addEventListener('touchstart', (e) => {
            mainTouchStartX = e.changedTouches[0].screenX;
            stopMainAutoSlide();
        }, { passive: true });

        mainSliderElements.container.addEventListener('touchend', (e) => {
            mainTouchEndX = e.changedTouches[0].screenX;
            const difference = mainTouchStartX - mainTouchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    nextMainSlide();
                } else {
                    prevMainSlide();
                }
            }

            startMainAutoSlide();
        }, { passive: true });
    }

    function initSocialSliderControls() {
        if (!socialSliderElements.container) return;

        socialSliderElements.prevBtn?.addEventListener('click', () => slideCards('prev'));
        socialSliderElements.nextBtn?.addEventListener('click', () => slideCards('next'));

        socialSliderElements.container.addEventListener('mouseenter', stopSocialAutoSlide);
        socialSliderElements.container.addEventListener('mouseleave', startSocialAutoSlide);

        let socialTouchStartX = 0;
        let socialTouchEndX = 0;

        socialSliderElements.container.addEventListener('touchstart', (e) => {
            socialTouchStartX = e.changedTouches[0].screenX;
            stopSocialAutoSlide();
        }, { passive: true });

        socialSliderElements.container.addEventListener('touchend', (e) => {
            socialTouchEndX = e.changedTouches[0].screenX;
            const difference = socialTouchStartX - socialTouchEndX;

            if (Math.abs(difference) > 50) {
                if (difference > 0) {
                    slideCards('next');
                } else {
                    slideCards('prev');
                }
            }

            startSocialAutoSlide();
        }, { passive: true });
    }

    function initHeaderScroll() {
        const headerElement = document.querySelector('header');
        const scrollThreshold = 100;
        
        function updateHeaderBackground() {
            if (window.scrollY > scrollThreshold) {
                headerElement?.classList.add('scrolled');
            } else {
                headerElement?.classList.remove('scrolled');
            }
        }
        
        updateHeaderBackground();
        window.addEventListener('scroll', updateHeaderBackground);
    }
    
    function initReadMoreButtons() {
        mainSliderElements.readMoreBtns?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = Array.from(mainSliderElements.slides).findIndex(
                    slide => slide.contains(btn)
                );
                console.log(`Read more clicked for slide ${slideIndex + 1}`);
            });
        });
    }

    // Initialize everything
    function init() {
        if (mainSliderElements.container) {
            initializeMainSlides();
            initMainSliderControls();
            initReadMoreButtons();
            startMainAutoSlide();
        }

            if (socialSliderElements.container) {
                initSocialSliderControls();
                startSocialAutoSlide();
            }

        initSmoothScroll();
        initHeaderScroll();

        // Global keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                if (mainSliderElements.container) {
                    prevMainSlide();
                    resetMainAutoSlide();
                }
                if (socialSliderElements.container) {
                    slideCards('prev');
                }
            } else if (e.key === 'ArrowRight') {
                if (mainSliderElements.container) {
                    nextMainSlide();
                    resetMainAutoSlide();
                }
                if (socialSliderElements.container) {
                    slideCards('next');
                }
            }
        });
    }

    // Start the application
    init();
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const body = document.body;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = 'auto';
    });
});