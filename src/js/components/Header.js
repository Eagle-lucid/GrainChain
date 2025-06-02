// Import gsap
import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export const initHeaderScroll = () => {
    // Sticky header class toggle
    ScrollTrigger.create({
        start: 'top -10',
        end: 99999,
        toggleClass: {
            targets: 'main .header',
            className: 'scrolled'
        }
    });

    // Logo text shrink & fade 
    gsap.to('.logo-text', {
        scrollTrigger: {
            trigger: 'main .header',
            start: 'top bottom-=100',
            end: '+=150',
            scrub: true,
            toggleActions: 'play none none reverse'
        },
        scale: 0.94,
        opacity: 0.85,
        ease: 'power2.out'
    });
};