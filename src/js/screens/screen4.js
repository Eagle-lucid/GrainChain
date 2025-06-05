// src/js/screens/scree4.js
export class Screen4Animations {
    constructor() {
        this.init();
    }

    init() {
        this.animateHeadline();
        this.animateMicrocopy();
        this.animateForm();
    }

    animateHeadline() {
        const headline = document.querySelector('.screen-4 .headline');
        if (!headline) return;

        const splitHeadline = new SplitText(headline, { type: 'words'});
        gsap.from(splitHeadline.words, {
            opacity: 0, y: 40,
            duration: 1.2, stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: headline,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        })
    }

    animateMicrocopy() {
        const microcopy = document.querySelector('.screen-4 .microcopy');
        if (!microcopy) return;

        const splitText = new SplitText(microcopy, { type: 'chars' });
        gsap.fromTo(splitText.chars,
            { opacity: 0, y: 20, scale: 0.95 },
            {
                opacity: 1, y: 0,
                scale: 1, duration: 1.2,
                stagger: 0.05, ease: 'power3.out',
                scrollTrigger: {
                    trigger: microcopy,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }

    animateForm() {
        const form = document.querySelector('.screen-4 .cta-form');
        if (!form) return;

        gsap.from(form, {
            opacity: 0, y: 40,
            duration: 1.2, ease: 'power3.out',
            scrollTrigger: {
                trigger: form,
                start: 'top 85%',
                toggleActions: 'play none none none'
            } 
        });
    }
}