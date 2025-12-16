
document.addEventListener('DOMContentLoaded', () => {

    // --- Reveal Animations on Scroll ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));


    // --- Active Link Highlighting ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // --- Mobile Menu Toggle (Simple) ---
    const hamburger = document.querySelector('.hamburger');
    const navUl = document.querySelector('.nav-links');

    if (hamburger && navUl) {
        hamburger.addEventListener('click', () => {
            const isHidden = navUl.style.display === 'none' || navUl.style.display === '';
            if (window.innerWidth <= 768) {
                navUl.style.display = isHidden ? 'flex' : 'none';
                navUl.style.flexDirection = 'column';
                navUl.style.position = 'absolute';
                navUl.style.top = '70px';
                navUl.style.left = '0';
                navUl.style.width = '100%';
                navUl.style.background = '#0c0c0e';
                navUl.style.padding = '2rem';
            }
        });
    }

    // --- Carousel Logic (Added) ---
    const track = document.getElementById('carouselTrack');
    if (track) {
        const cards = Array.from(track.children);
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');

        // 뷰포트 너비에 따라 한 번에 몇 개의 카드를 보여줄지 결정 (CSS의 min-width와 일치해야 함)
        const getCardsPerView = () => window.innerWidth <= 768 ? 1 : 3;
        let currentCardIndex = 0;

        const updateCarousel = () => {
            const cardsPerView = getCardsPerView();
            // (100% / cardsPerView)는 한 카드의 너비를 백분율로 나타냅니다.
            const cardWidthPercentage = 100 / cardsPerView;
            const offset = -currentCardIndex * cardWidthPercentage;

            // CSS Transform으로 슬라이딩 애니메이션 적용
            track.style.transform = `translateX(${offset}%)`;

            // 버튼 상태 업데이트
            if (prevBtn) prevBtn.disabled = currentCardIndex === 0;

            // 슬라이드 가능한 최대 지점 계산
            const maxIndex = Math.max(0, cards.length - cardsPerView);
            if (nextBtn) nextBtn.disabled = currentCardIndex >= maxIndex;
        };

        const moveNext = () => {
            const cardsPerView = getCardsPerView();
            const maxIndex = cards.length - cardsPerView;
            if (currentCardIndex < maxIndex) {
                currentCardIndex++;
                updateCarousel();
            }
        };

        const movePrev = () => {
            if (currentCardIndex > 0) {
                currentCardIndex--;
                updateCarousel();
            }
        };

        if (nextBtn) nextBtn.addEventListener('click', moveNext);
        if (prevBtn) prevBtn.addEventListener('click', movePrev);

        // 초기 로드 시 및 창 크기 변경 시 캐러셀 업데이트
        window.addEventListener('resize', () => {
            // 뷰포트 변경 시 currentCardIndex를 0으로 리셋하여 예상치 못한 슬라이딩 오류 방지
            currentCardIndex = 0;
            updateCarousel();
        });

        updateCarousel(); // 초기 상태 설정
    }

    // --- Dynamic Cursor Interaction (with Lerp & Return to Home) ---
    if (window.innerWidth > 768) {
        const glowBlob = document.getElementById('glow-blob');
        const customCursor = document.getElementById('custom-cursor');
        const interactables = document.querySelectorAll('a, button, .card-content, .carousel-control');

        if (glowBlob && customCursor) {
            // Position variables
            const homeX = window.innerWidth * 0.75; // 3/4 Width
            const homeY = window.innerHeight * 0.5; // Center Height

            let targetX = homeX;
            let targetY = homeY;
            let currentX = homeX;
            let currentY = homeY;

            // Tuning parameters
            const lerpFactor = 0.1; // Smooth following speed
            const returnLerpFactor = 0.02; // Slower return speed

            // State
            let isHovering = false;
            let isClicked = false;

            // 1. Normalize Mouse Event
            const onMouseMove = (e) => {
                targetX = e.clientX;
                targetY = e.clientY;
                isHovering = true;
            };

            // 2. Return to Home Trigger
            const onMouseLeave = () => {
                targetX = homeX;
                targetY = homeY;
                isHovering = false;
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseleave', onMouseLeave);

            // Click State Tracking
            document.addEventListener('mousedown', () => {
                isClicked = true;
                customCursor.classList.add('cursor-clicked');
            });
            document.addEventListener('mouseup', () => {
                isClicked = false;
                customCursor.classList.remove('cursor-clicked');
            });

            // Linear Interpolation Helper
            const lerp = (start, end, factor) => {
                return start * (1 - factor) + end * factor;
            };

            // Animation Loop
            const updateBlob = () => {
                // Determine speed factor based on state
                // If mouse is inside (isHovering), follow faster. If outside, return slower.
                // Note: document.body:hover trick might be simpler, but using explicit state is safer.
                const factor = isHovering ? lerpFactor : returnLerpFactor;

                currentX = lerp(currentX, targetX, factor);
                currentY = lerp(currentY, targetY, factor);

                // Center correction (Blob size 450px -> half is 225px)
                const translateX = currentX - 225;
                const translateY = currentY - 225;

                // Venom Effect: Scale up and blur more on click
                const scale = isClicked ? 1.2 : 1.0;
                const blurVal = isClicked ? 250 : 180; // dynamic blur

                // Apply styles
                glowBlob.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                glowBlob.style.filter = `blur(${blurVal}px)`;

                // Cursor strictly follows mouse (or target if we wanted it to return too, but usually cursor stays with mouse)
                // However, if mouse leaves window, targetX goes to home. 
                // We should probably keep custom cursor at mouse position always, 
                // BUT if mouse leaves, system cursor disappears. 
                // Let's just follow targetX/Y which represents "intended focus".
                customCursor.style.left = `${targetX}px`;
                customCursor.style.top = `${targetY}px`;

                requestAnimationFrame(updateBlob);
            };

            // Ignite loop
            updateBlob();

            // Hover effects on interactive elements
            interactables.forEach(el => {
                el.addEventListener('mouseenter', () => customCursor.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => customCursor.classList.remove('cursor-hover'));
            });
        }
    }

});
