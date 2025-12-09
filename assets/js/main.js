
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
            // Toggle logic here - for now just basic toggle class or style
            // In a real app we might animate a drawer
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

});
