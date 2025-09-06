import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { TextPlugin } from 'gsap/TextPlugin';
import { SupplyChainQuiz } from '../components/scf.js';
import { Quiz } from '../components/quiz.js';

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, TextPlugin);

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
            stats: document.querySelectorAll('.stats__value'),
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
        this.animateStatsCounter();
        this.animateContent();
    }

    setupStaticFallback() {
        gsap.set([
            this.DOM.headline,
            this.DOM.supplyChain,
            this.DOM.quiz,
            this.DOM.content,
            ...this.DOM.stats
        ], { opacity: 1 });
    }

        animateHeadline() {
      if (!this.DOM.headline) return;

      if (this.options.useSplitText) {
        const split = new SplitText(this.DOM.headline, {
          type: 'lines,words',
          linesClass: 'line',
          wordsClass: 'word'
        });

        console.log('SplitText words:', split.words);

        // Make sure parent is visible
        gsap.set(this.DOM.headline, { opacity: 1, visibility: 'visible' });

        const anim = gsap.from(split.words, {
          opacity: 0, y: 30,
          duration: 1.2, stagger: 0.05,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: this.DOM.headline,
            start: 'top 85%',
            toggleActions: 'play none none none',
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

  const statItems = document.querySelectorAll('.stats__item');
  if (!statItems.length) return;

  statItems.forEach(item => {
    const valueElement = item.querySelector('.stats__value');
    const label = item.querySelector('.stats__label');

    if (!valueElement || !label) return;

    const target = parseInt(valueElement.dataset.count, 10);
    const obj = { val: 0 };

    valueElement.textContent = '0%';
    valueElement.style.opacity = '0';
    label.style.opacity = '0';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 80%',
        once: true,
        onEnter: () => console.log(`Triggered stats for ${target}%`)
      }
    });

    tl.to([valueElement, label], {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.out'
    });

    tl.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        const val = Math.round(obj.val);
        valueElement.textContent = `${val}%`;
        this.updateCounterColor(valueElement, val);

        const intensity = val / 100 * 0.5;
        valueElement.style.textShadow = `1px 1px 6px rgba(${val}, ${100 - val}, 0, ${intensity})`;
      },
      onComplete: () => {
        valueElement.textContent = `${target}%`;
        this.updateCounterColor(valueElement, target);
      }
    }, "<");

    this.animations.push(tl);
  });
}

    updateCounterColor(el, val) {
      if (val < 30) {
        el.style.color = 'orange';
      } else if (val < 70) {
        el.style.color = 'red';
      } else {
        el.style.color = 'green';
      }
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

    cleanUp() {
        this.animations.forEach(anim => {
            anim?.kill?.();
            anim?.revert?.();
        });
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        this.quiz?.destroy?.();
        this.supplyChainQuiz?.destroy?.();
    }
}