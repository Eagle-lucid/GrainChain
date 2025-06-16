// Import gsap
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    // Detect touch devices 
    if ('ontouchstart' in window) {
        document.documentElement.classList.add('touch-device');
    }

    /*  ===== Scroll Effects ===== */
    ScrollTrigger.create({
        start: 'top top+=10', end: 'max',
        onUpdate: (self) => {
            header.classList.toggle('scrolled', self.direction === 2 || self.scroll() > 10);
        }
    });

    /*  ===== Dropdown Animations ===== */
    const dropdowns = document.querySelectorAll('.nav-list__dropdown');
    dropdowns.forEach(dropdown => {
        const menu = document.querySelector('.nav-list__dropdown');
        const items = menu.querySelectorAll('li');
        let openTimeline, closeTimeline;

        // Create animation timelines 
        const createTimelines = () => {
            openTimeline = gsap.timeline({ paused: true })
            .to(menu, {
                opacity: 1, y: 0,
                duration: 0.3, ease: 'power2.out'
            })
            .to(items, {
                opacity: 1, y: 0,
                stagger: 0.05, duration: 0.2,
                ease: 'back.out(1.2)'
            }, 0.1);

            closeTimeline = gsap.timeline({ paused: true })
            .to(items, {
                opacity: 0, y: -6,
                duration: 0.15, ease: 'power2.in'
            })
            .to(menu, {
                opacity: 0, y: -8,
                duration: 0.2, ease: 'power2.in'
            }, 0);
        };

        // Initialize timelines 
        createTimelines();

        // Event handlers 
        const handleOpen = () => {
            closeTimeline.pause();
            openTimeline.restart();
        };

        const handleClose = () => {
            openTimeline.pause();
            closeTimeline.restart();
        }

        // Desktop interactions 
        dropdown.addEventListener('mouseenter', handleOpen);
        dropdown.addEventListener('mouseleave', handleClose);

        // Touch device interactions 
        if (document.documentElement.classList.contains('touch-device')) {
            dropdown.addEventListener('click', (e) => {
                if (window.innerWidth >= 992) return;

                e.preventDefault();
                dropdown.classList.toggle('active');

                if (dropdown.classList.contains('active')) {
                    handleOpen();
                } else {
                    handleClose();
                }
            });
        }
    });

    /* ==== Reduced Motion Preference */
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion:reduce)');

    if (prefersReducedMotion.matches) {
        gsap.set('.nav-list__dropdown-menu, .nav-list__dropdown-menu li', {
            opacity: 1, y: 0
        });
    }
};