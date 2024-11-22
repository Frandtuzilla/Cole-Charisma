// ==========================================================================
// Table of Contents:
// 1. Constants & Variables
// 2. Smooth Scroll
// 3. Slider Functionality
//    3.1 Slide Management
//    3.2 Navigation Controls
//    3.3 Auto Slide
// 4. Event Listeners
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // 1. Constants & Variables
    // ==========================================================================
    const sliderElements = {
        container: document.querySelector('.slider'),
        slides: document.querySelectorAll('.slide'),
        prevBtn: document.querySelector('.slider-nav .prev-btn'),
        nextBtn: document.querySelector('.slider-nav .next-btn'),
        readMoreBtns: document.querySelectorAll('.read-more-btn')
    };

    const sliderConfig = {
        currentIndex: 0,
        totalSlides: sliderElements.slides.length,
        autoSlideDelay: 5000,
        autoSlideInterval: null,
        isTransitioning: false
    };

    // 2. Smooth Scroll
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('nav ul li a').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
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

    // 3. Slider Functionality
    // ==========================================================================
    // Initialize slider positions
    function initializeSlides() {
        sliderElements.slides.forEach((slide, index) => {
            slide.style.transform = `translateX(${index * 100}%)`;
        });
    }

    // Update slides positions
    function updateSlides() {
        if (sliderConfig.isTransitioning) return;
        
        sliderConfig.isTransitioning = true;

        // Update positions of all slides
        sliderElements.slides.forEach((slide, index) => {
            const offset = 100 * (index - sliderConfig.currentIndex);
            slide.style.transform = `translateX(${offset}%)`;
        });

        // Reset transition lock
        setTimeout(() => {
            sliderConfig.isTransitioning = false;
        }, 500);
    }

    function nextSlide() {
        if (sliderConfig.isTransitioning) return;
        sliderConfig.currentIndex = (sliderConfig.currentIndex + 1) % sliderConfig.totalSlides;
        updateSlides();
    }

    function prevSlide() {
        if (sliderConfig.isTransitioning) return;
        sliderConfig.currentIndex = (sliderConfig.currentIndex - 1 + sliderConfig.totalSlides) % sliderConfig.totalSlides;
        updateSlides();
    }

    // 3.3 Auto Slide
    function startAutoSlide() {
        sliderConfig.autoSlideInterval = setInterval(nextSlide, sliderConfig.autoSlideDelay);
    }

    function stopAutoSlide() {
        clearInterval(sliderConfig.autoSlideInterval);
    }

    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    // 4. Event Listeners
    // ==========================================================================
    function initSliderControls() {
        // Navigation button controls
        sliderElements.prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });

        sliderElements.nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });

        // Hover controls for auto-slide
        sliderElements.container.addEventListener('mouseenter', stopAutoSlide);
        sliderElements.container.addEventListener('mouseleave', startAutoSlide);

        // Touch events for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        sliderElements.container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, { passive: true });

        sliderElements.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const difference = touchStartX - touchEndX;

            // Determine swipe direction
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }

            startAutoSlide();
        }, { passive: true });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoSlide();
            }
        });
    }

    function initReadMoreButtons() {
        sliderElements.readMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const slideIndex = Array.from(sliderElements.slides).findIndex(
                    slide => slide.contains(btn)
                );
                // Handle read more click - you can customize this part
                console.log(`Read more clicked for slide ${slideIndex + 1}`);
            });
        });
    }

    // Initialize everything
    function init() {
        initSmoothScroll();
        initializeSlides(); // Initialize slide positions
        initSliderControls();
        initReadMoreButtons();
        startAutoSlide();
    }

    // Start the application
    init();
});