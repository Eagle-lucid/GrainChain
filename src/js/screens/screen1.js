import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export class Screen1Animations {
    constructor() {
        this.DOM = {
            screen: document.querySelector('.screen--problem'),
            headline: document.querySelector('.screen--problem__headline'),
            text: document.querySelector('.screen--problem__description'),
            bgImages: document.querySelectorAll('.screen--problem__bg-img'),
        };
        this.init();
    }

    init() {
        // Wait for images to load
        window.addEventListener('load', () => {
            this.setupParallax();
            this.setupTextAnimations();
        });
    }

    setupParallax() {
        // Primary BG 
        gsap.to(this.DOM.bgImages[0], {
            y: '-5%',
            scrollTrigger: {
                trigger: this.DOM.screen,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        // Secondary BG
        gsap.to(this.DOM.bgImages[1], {
            y: '15%',
            scrollTrigger: {
                trigger: this.DOM.screen,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    setupTextAnimations() {
        // Headline animation
        gsap.fromTo([this.DOM.headline, this.DOM.text], 
            { opacity: 0, y: 50, scale: 1.1, rotation: 10  },
            {opacity: 1, y: 0,
            scale: 1, rotation: 0,
            stagger: 0.3,
            duration: 1.8, ease: 'power3.out',
            scrollTrigger: {
                trigger: this.DOM.screen,
                start: 'top 80%',
                end: 'bottom top',
                toggleActions: 'play none none none',
                once: true
            }
        }
        );
    }
}