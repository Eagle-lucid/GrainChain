// src/js/screens/screen1.js
export class Screen1Animations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScreenAnimation();
        this.setupContentAnimations();    
    }

    setupScreenAnimation() {
        gsap.to('.screen-1', {
            scale: 1,
            ease: 'power1.out',
            scrollTrigger: {
                trigger: '.screen-1',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        })
    }

    setupContentAnimations() {
        this.animateHeadline();
        this.animateDescription();
    }

    animateHeadline() {
        gsap.from('.screen-1 .headline', {
          opacity: 0,
          y: 40,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.screen-1',
            start: 'top center'
          }
        });
    }

    animateDescription() {
        gsap.from('.screen-1 .description', {
            opacity: 0,
            y: 20,
            duration: 1.2,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.screen-1',
                start: 'top center'
            }
        })
    }
}