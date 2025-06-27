import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { SupplyChainQuiz } from '../components/scf.js';
import { Quiz } from '../components/quiz.js';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

export class Screen2Animations {
    constructor(options = {}) {
        this.options = {
            animateIcons: true,
            useSplitText: true,
            ...options
        };

        this.animations = [];
        this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.DOM = this.getDOMElements();

        try {
            this.initComponents();
            this.initAnimations()
        } catch (error) {
            console.error('[Screen2] Initialization failed:', error);
            this.setupStaticFallback();
        }
    }

    getDOMElements() {
        return {
            screen: document.querySelector('.screen--hidden-cost'),
            headline: document.querySelector('.screen--hidden-cost__headline'),
            floatingIcons: document.querySelectorAll('.screen--hidden-cost__floating-icon'),
            gradientOverlay: document.querySelector('.screen--hidden-cost__gradient-overlay'),
            supplyChain: document.querySelector('.supply-chain'),
            stats: document.querySelectorAll('.stats-value'),
            quiz: document.querySelector('.quiz'),
            content: document.querySelector('.screen--hidden-cost__content')
        };
    }

    initComponents() {
        if (this.DOM.quiz) {
            this.quiz = new Quiz(this.DOM.quiz);
        }
        if (this.DOM.supplyChain) {
            this.supplyChainQuiz = new SupplyChainQuiz(this.DOM.supplyChain)
        }
    }

    initAnimations() {
        if (this.preferReducedMotion) {
            this.setupStaticFallback();
            return;
        }

        this.animateHeadline();
        this.animateFloatingIcons();
        this.animateGradient();
        this.animateSupplyChainVisual();
        this.animateStatsCounter();
        this.animateContent();
    }

    setupStaticFallback() {
        gsap.set([
            this.DOM.headline,
            this.DOM.supplyChain,
            this.DOM.quiz,
            this.DOM.content
        ], { opacity: 1 });
    }

    animateHeadline() {
        if (!this.DOM.headline) return;
        if (this.options.useSplitText) {
            const split = new SplitText(this.DOM.headline, {
                types: 'lines, words',
                linesClass: 'line',
                wordsClass: 'word'
            });

            const anim = gsap.from(split.words, {
                opacity: 0, y: 30,
                duration: 1.2, stagger: 0.05,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: this.DOM.headline,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });
            this.animations.push(anim);
        } else {
            const anim = gsap.from(this.DOM.headline, {
                opacity: 0, y: 40,
                duration: 1.2, ease: 'power3.out',
                scrollTrigger: {
                    trigger: this.DOM.headline,
                    start: 'top 85%',
                }
            });
            this.animations.push(anim);
        }
    }

    animateFloatingIcons() {
        if (!this.DOM.floatingIcons?.length || !this.options.animateIcons) return;

        const movements = [
            { y: -15, x: -10, rotation: -3},
            { y: 20, x: 5, rotation: 2},
            { y: -10, x: 15, rotation: -1},
            { y: 15, x: -5, rotation: 4},
            { y: -5, x: 10, rotation: -2},
            { y: 10, x: -15, rotation: 3},
            { y:-20, x: 5, rotation: -4},
            { y: 5, x: 15, rotation: 1}
        ];

        this.DOM.floatingIcons.forEach((icon, i) => {
            const move = movements[i % movements.length];
            const anim = gsap.to(icon, {
                ...move,
                duration: 5 + (i * 0.5),
                repeat: -1, yoyo: true,
                ease: 'sine.inOut', delay: i * 0.3,
            });
            this.animations.push(anim);
        });
    }

    animateGradient() {
        if (!this.DOM.gradientOverlay) return;

        const anim = gsap.to(this.DOM.gradientOverlay, {
          backgroundPosition: '100% 50%',
          duration: 20,
          ease: 'linear',
          repeat: -1
        });
        this.animations.push(anim);
    }

    animateStatsCounter() {
        if (!this.DOM.stats.length) return;

        this.DOM.stats.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const isCritical = target >= 30;

            const anim = gsap.to(counter, {
                textContent: target, duration: 2.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: counter.closest('.stats__item') || counter,
                    start: 'top 80%'
                },
                onUpdate: () => this.updateCounterColor(counter, isCritical),
                modifiers: {
                    innerText: value => `${Math.round(value)}%`
                }
            });
            this.animations.push(anim);
        });
    }

    animateContent() {
        if (!this.DOM.content) return;

        const anim = gsap.from(this.DOM.content, {
            opacity: 0, y: 20,
            stagger: 0.1, duration: 0.6,
            scrollTrigger: {
                trigger: this.DOM.content,
                start: 'top 85%'
            }
        });
        this.animations.push(anim);
    }

    updateCounterColor(counter, isCritical) {
        const val = parseInt(counter.innerText);
        counter.style.color = isCritical ?
        val < 15 ? 'var(--success-color)' :
        val < 30 ? 'var(--warning-color)' :
        val < 40 ? 'var(--accent-color)' :
        'var(--error-color)' :
        val < 15 ? 'var(--success-color)' :
        'var(--warning-color)';
    }

    cleanUp() {
        this.animations.forEach(anim => {
            anim?.kill?.();
            anim?.revert?.();
        });
        ScrollTrigger.getAll().forEach(statusbar.kill());
        this.quiz?.destroy?.();
        this.supplyChainQuiz?.destroy?.();
    }
}