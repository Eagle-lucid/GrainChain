// src/js/components/cta.js

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { closeSidebar, resetAutoCloseTimer } from './sidebar';

export const initCTA = () => {
    const stickyCTA = document.querySelector('.sticky-cta');
    if (!stickyCTA) return;

    // Reveal sticky CTA on scroll
    ScrollTrigger.create({
        trigger: '.screen-1',
        start: 'top center',
        toggleClass: {targets: '.sticky-cta', className: 'active' }
    });

    gsap.fromTo('.sticky-cta', 
        { opacity: 0, y: 30, pointerEvents: 'none' },
        {
            opacity: 1,
            y: 0,
            pointerEvents: 'auto',
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.screen-1',
                start: 'top center',
                toggleActions: 'play none none reverse',
            }
        }
    );

    // CYA Click: scroll to screen-4 (target section)
    stickyCTA.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.querySelector('.screen-4');
        if (targetSection) {
            gsap.to(window, {
                scrollTo: {
                    y: targetSection,
                    autoKill: false,
                    offsetY: 50 // Adjust offset if needed
                },
                duration: 1,
                ease: 'power2.inOut'
            });

            // Close sidebar if open
            const sidebar = document.getElementById('mobileSidebar')
            if (sidebar.classList.contains('open')) {
                resetAutoCloseTimer();
                closeSidebar();
            }
        }
    });
    // Close sticky CTA on click outside
    document.addEventListener('click', (e) => {
        if (!stickyCTA.contains(e.target) && !e.target.closest('.sidebar')) {
            gsap.to('.sticky-cta', {
                opacity: 0,
                y: 30,
                pointerEvents: 'none',
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });
}