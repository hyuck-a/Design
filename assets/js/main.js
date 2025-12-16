document.addEventListener('DOMContentLoaded', () => {
    // --- 1. 프로젝트 섹션 슬라이더 기능 구현 ---
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');
    const container = document.querySelector('.projects-slider-container');
    const cards = document.querySelectorAll('.project-section-card');

    if (track && prevBtn && nextBtn && container && cards.length > 0) {
        let currentSlide = 0;
        const totalCards = cards.length;

        // CSS에서 설정된 값과 동기화
        const cardWidth = 380;
        const margin = 30;
        const slideStep = cardWidth + margin; // 한 번에 이동할 거리 (카드 1개 너비 + 간격)

        const updateSlider = () => {
            const offset = -currentSlide * slideStep;
            track.style.transform = `translateX(${offset}px)`;

            // 버튼 상태 업데이트: 트랙의 총 너비 계산
            const trackWidth = totalCards * cardWidth + (totalCards - 1) * margin;
            const containerWidth = container.clientWidth;

            // 프로젝트 내용이 컨테이너보다 길 때만 슬라이드 활성화
            if (trackWidth > containerWidth) {
                // 첫 Slide일 때 prev 비활성화
                prevBtn.disabled = currentSlide === 0;

                // 마지막으로 슬라이드 할 수 있는 위치를 계산
                // 컨테이너 너비를 고려하여 다음 버튼 비활성화 시점 결정
                const maxSlideOffset = trackWidth - containerWidth;
                const currentOffset = currentSlide * slideStep;

                // 현재 오프셋이 최대 오프셋을 초과하면 (마지막 슬라이드에 도달) next 버튼 비활성화
                // (약간의 오차를 허용하기 위해 1px 여유를 둡니다)
                nextBtn.disabled = currentOffset >= (maxSlideOffset - 1);

            } else {
                // 프로젝트 4개가 모두 보이는 경우 (슬라이드 불필요)
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

        // 초기 설정 및 화면 크기 변경 시 슬라이더 상태 업데이트
        window.addEventListener('resize', () => {
            currentSlide = 0; // 리사이즈 시 초기화 (안전장치)
            updateSlider();
        });
        updateSlider();
    }


    // --- 2. 커서 추적 및 역동적 발광체 구현 --- (이전과 동일)
    if (window.innerWidth > 768) {
        const glowBlob = document.getElementById('glow-blob');
        const customCursor = document.getElementById('custom-cursor');
        const interactables = document.querySelectorAll('a, button, .card-content');

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
});
