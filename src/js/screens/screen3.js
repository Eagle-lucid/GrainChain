// src/js/screens/screen3.js
export class Screen3Animations {
    constructor() {
        this.bgContainer = document.querySelector('.screen-3 .bg-dynamic');
        this.init();
    }

    init() {
        this.animateHeadline();
        this.animateVisionSlides();
        this.setupBackgroundChanges();
        this.animateColorShift();
        this.animateTechTags();
        this.animateVoiceover();
    }

    animateHeadline() {
        // animate the headline
        const headline = document.querySelector('.screen-3 .headline');
        if (!headline) return;

        const splitHeadline = new SplitText(headline, {type: 'words'});
        gsap.from(splitHeadline.words, {
            opacity: 0,
            y: 40, duration: 1.2,
            stagger: 0.2, ease: 'power3.out',
            scrollTrigger: {
                trigger: headline,
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    animateVisionSlides() {
        gsap.utils.toArray('.vision-slide').forEach((slide, i) => {
            gsap.from(slide, {
                opacity: 0,
                x: 80,
                duration: 1.2,
                delay: 1 * 0.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: slide,
                    start: 'top 90%',
                    toggleActions: 'play  none none none' 
                }
            });

            gsap.from(slide.querySelector('p'), {
                opacity: 0,
                y: 30, duration: 1.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: slide,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    setupBackgroundChanges() {
        gsap.utils.toArray('.vision-slide').forEach(slide => {
            ScrollTrigger.create({
                trigger: slide,
                start: 'top 85%',
                onEnter: () => {
                    this.bgContainer.computedStyleMap.backgroundImages = `url(${slide.dataset.bg})`;
                }, 
                onLeaveBack: () => {
                    const prevSlide = slide.previousElementSibling;
                    if (prevSlide?.classList.contains('vision-slide')) {
                        this.bgContainer.computedStyleMap.backgroundImages = `url(${prevSlide.dataset.bg})`;
                    }
                }
            });
        });
    }

    animateColorShift() {
        ScrollTrigger.create({
            trigger: '.vision-slide:last-child',
            start: 'top 85%',
            onEnter: () => this.bgContainer.classList.add('rich-color'),
            onLeaveBack: () => this.bgContainer.classList.remove('rich-color')
        });
    }

    animateTechTags() {
        gsap.from('.tech-tags', {
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.tech-tags',
                start: 'top 85%',
                toggleActions: 'play none none none'
            }
        });
    }

    animateVoiceover() {
        gsap.from('.voiceover-text', {
            opacity: 0,
            y: 40, duration: 1.2,
            delay: 0.3, ease: 'power3.out',
            scrollTrigger: {
                trigger: '.voiceover-text',
                start: 'top 85%',
                toggleActions: 'play none none none'
            } 
        });
    }
}