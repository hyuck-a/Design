document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 페이지 슬라이드 기능 구현 ---
    const pageWrapper = document.getElementById('pageWrapper');
    const sections = document.querySelectorAll('.page-section');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    // 페이지 슬라이드 기능이 활성화된 경우에만 실행
    if (pageWrapper && sections.length > 0 && prevBtn && nextBtn) {
        let currentPageIndex = 0;
        const totalPages = sections.length;

        const updatePage = () => {
            // 100vw 단위로 이동
            const offset = -currentPageIndex * 100;
            pageWrapper.style.transform = `translateX(${offset}vw)`;

            // 버튼 상태 업데이트
            prevBtn.disabled = currentPageIndex === 0;
            nextBtn.disabled = currentPageIndex === totalPages - 1;
        };

        const moveNext = () => {
            if (currentPageIndex < totalPages - 1) {
                currentPageIndex++;
                updatePage();
            }
        };

        const movePrev = () => {
            if (currentPageIndex > 0) {
                currentPageIndex--;
                updatePage();
            }
        };

        nextBtn.addEventListener('click', moveNext);
        prevBtn.addEventListener('click', movePrev);

        // 초기 설정
        updatePage();
    }

    // --- 2. 커서 추적 및 역동적 발광체 구현 ---
    if (window.innerWidth > 768) {
        const glowBlob = document.getElementById('glow-blob');
        const customCursor = document.getElementById('custom-cursor');
        const interactables = document.querySelectorAll('a, button, .card-content, .page-control'); // page-control 추가

        if (glowBlob && customCursor) {
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

                // CSS 적용 (발광체 중심 보정 - 450px의 절반인 225px)
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
    }
});
