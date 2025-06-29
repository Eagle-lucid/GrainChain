// src/js/screens/screen3.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
gsap.registerPlugin(ScrollTrigger, SplitText);
export class Screen3Animations {
    constructor() {
        this.DOM = {
            screen: document.querySelector('.screen--vision'),
            bg: document.querySelector('.screen--vision__bg'),
            headline: document.querySelector('.screen--vision__headline'),
            slides: document.querySelectorAll('.screen--vision__slide'),
            tags: document.querySelector('.screen--vision__tags'),
            voiceover: document.querySelector('.screen--vision__voiceover')
        };

        if (this.DOM.screen) {
            this.resetInitialStates();
            this.init();
        }
    }

    resetInitialStates() {
        gsap.set([this.DOM.headline, this.DOM.slides, this.DOM.tags, this.DOM.voiceover], {
            opacity: 1,
            visibility: 'visible'
        });

        gsap.set([this.DOM.headline, this.DOM.slides, this.DOM.tags, this.DOM.voiceover], {
            opacity: 0
        });
    }

    init() {
        this.animateHeadline();
        this.animateSlides();
        this.setupBackgroundChanges();
        this.animateTagsAndVoiceover(); 
    }

    animateHeadline() {
        try {
            const split = new SplitText(this.DOM.headline,{ type: 'words' });
            gsap.from(split.words, {
                opacity: 0, y: 40,
                durations: 1.2, stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: this.DOM.headline,
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });
        } catch (e) {
           console.warn("SplitText failed, using fallback animation");
           gsap.from(this.DOM.headline, {
            opacity: 0, y: 40, duration: 1
           }) 
        }
    }

    animateSlides() {
        this.DOM.slides.forEach((slide, i) => {
            // Slide container animation 
            gsap.from(slide, {
                opacity: 0, 
                x: i % 2 === 0 ? 80 : -80,
                duration: 1, delay: i * 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: slide,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            // Figcaption animation 
            gsap.from(slide.querySelector('figcaption'), {
                opacity: 0, y: 20,
                duration: 0.8, delay: i * 0.2 + 0.3,
                ease: 'back.out'
            });
        });
    }

    setupBackgroundChanges() {
        this.DOM.slides.forEach(slide => {
            ScrollTrigger.create({
                trigger: slide, start: 'top 50%',
                onEnter: () => {
                    this.DOM.bg.style.backgroundImage = `url(${slide.dataset.bg})`;
                    gsap.to(this.DOM.bg, { opacity: 0.25, duration: 1 });
                },
                onEnterBack: () => {
                    this.DOM.bg.style.backgroundImage = `url(${slide.dataset.bg})`;
                    gsap.to(this.DOM.bg, { opacity: 0.25, duration: 1 });
                }
            });
        });
    }

    animateTagsAndVoiceover() {
        // Tags Animation 
        gsap.from(this.DOM.tags.children, {
            opacity: 0, y: 40,
            duration: 0.8, stagger: 0.15,
            ease: 'back.out',
            scrollTrigger: {
                trigger: this.DOM.tags,
                start: 'top 75%',
                toggleActions: 'play none none none'
            }
        });

        // Voiceover animation 
        gsap.from(this.DOM.voiceover, {
            opacity: 0, y: 40, 
            duration: 1, ease: 'power2.out',
            scrollTrigger: {
                trigger: this.DOM.voiceover, 
                start: 'top 70%',
                toggleActions: 'play none none none'
            } 
        });
    }
}
console.log("GSAP version:", gsap.version); 
console.log("ScrollTrigger:", ScrollTrigger ? "Loaded" : "Missing");