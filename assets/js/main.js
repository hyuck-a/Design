document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Project Section Slider Functionality ---
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const container = document.querySelector('.projects-slider-container');
    const cards = document.querySelectorAll('.project-section-card');

    if (track && prevBtn && nextBtn && container && cards.length > 0) {
        let currentSlide = 0;
        const totalCards = cards.length;

        // Synced with CSS values
        const cardWidth = 380;
        const margin = 30;
        const slideStep = cardWidth + margin;

        const updateSlider = () => {
            const offset = -currentSlide * slideStep;
            track.style.transform = `translateX(${offset}px)`;

            // Button State Updates
            const trackWidth = totalCards * cardWidth + (totalCards - 1) * margin;
            const containerWidth = container.clientWidth;

            // Only enable slide if content exceeds container
            if (trackWidth > containerWidth) {
                prevBtn.disabled = currentSlide === 0;

                const maxSlideOffset = trackWidth - containerWidth;
                const currentOffset = currentSlide * slideStep;

                // Disable next button if at the end (with 1px buffer)
                nextBtn.disabled = currentOffset >= (maxSlideOffset - 1);

            } else {
                // All projects visible
                prevBtn.disabled = true;
                nextBtn.disabled = true;
            }
        };

        nextBtn.addEventListener('click', () => {
            currentSlide++;
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            currentSlide--;
            updateSlider();
        });

        // Update on resize
        window.addEventListener('resize', () => {
            updateSlider(); // Simply recalculate, keeping current slide if valid or handled by update logic
        });
        updateSlider();
    }


    // --- 2. Cursor Tracking & Dynamic Glow (Retained) ---
    if (window.innerWidth > 768) {
        const glowBlob = document.getElementById('glow-blob');
        const customCursor = document.getElementById('custom-cursor');
        const interactables = document.querySelectorAll('a, button, .card-content, .nav-links a');

        const homeX = window.innerWidth * 0.75;
        const homeY = window.innerHeight * 0.5;
        let targetX = homeX;
        let targetY = homeY;
        let currentX = homeX;
        let currentY = homeY;
        const lerpFactor = 0.1;
        const returnLerpFactor = 0.01;

        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
        });

        document.addEventListener('mouseleave', () => {
            targetX = homeX;
            targetY = homeY;
        });

        let isClicked = false;
        document.addEventListener('mousedown', () => {
            customCursor.classList.add('cursor-clicked');
            isClicked = true;
        });
        document.addEventListener('mouseup', () => {
            customCursor.classList.remove('cursor-clicked');
            isClicked = false;
        });

        const lerp = (start, end, factor) => {
            return start * (1 - factor) + end * factor;
        };

        const updateBlob = () => {
            const factor = (targetX === homeX && targetY === homeY) ? returnLerpFactor : lerpFactor;

            currentX = lerp(currentX, targetX, factor);
            currentY = lerp(currentY, targetY, factor);

            const translateX = currentX - 225;
            const translateY = currentY - 225;

            const sizeAdjustment = isClicked ? 1.2 : 1.0;
            const blurAdjustment = isClicked ? 250 : 180;

            glowBlob.style.transform = `translate(${translateX}px, ${translateY}px) scale(${sizeAdjustment})`;
            glowBlob.style.filter = `blur(${blurAdjustment}px)`;

            customCursor.style.left = `${targetX}px`;
            customCursor.style.top = `${targetY}px`;

            requestAnimationFrame(updateBlob);
        };

        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('cursor-hover');
            });
        });

        updateBlob();
    }

    // --- 3. Navigation Scroll & Active State ---
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section, #works');

    const setActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            // Offset for header height
            const sectionTop = section.offsetTop - 150;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink);

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initial check
    setActiveLink();
});
