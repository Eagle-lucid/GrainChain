// src/js/screens/screen3.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import ColdTruck from '../../assets/images/cold-truck.jpg';
import FarmerAlert from '../../assets/images/farmer-alert-call.jpg';
import ProduceData from '../../assets/images/produce-data.jpg';

gsap.registerPlugin(ScrollTrigger, SplitText);

export class Screen3Animations {
  constructor() {
    this.DOM = this.getDOMElements();
    this.animations = [];
    this.preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.setSlideBackgrounds();
    this.DOM.bg.style.backgroundImage = `url(${this.DOM.slides[0].dataset.bg})`;

    if (this.DOM.screen) {
      this.resetInitialStates();

      if (this.preferReducedMotion) {
        this.setupStaticFallback();
      } else {
        this.init();
      }
    }
  }

  getDOMElements() {
    return {
      screen: document.querySelector('.screen--vision'),
      bg: document.querySelector('.screen--vision__bg'),
      headline: document.querySelector('.screen--vision__headline'),
      slides: document.querySelectorAll('.screen--vision__slide'),
      tags: document.querySelector('.screen--vision__tags'),
      voiceover: document.querySelector('.screen--vision__voiceover'),
      blockquote: document.querySelector('.screen--vision blockquote')
    };
  }

  setSlideBackgrounds() {
    // Import images 
    this.DOM.slides[0].dataset.bg = ColdTruck;
    this.DOM.slides[1].dataset.bg = FarmerAlert;
    this.DOM.slides[2].dataset.bg = ProduceData;
  }

  resetInitialStates() {
    // Headline container stays visible for SplitText
    if (this.DOM.headline) gsap.set(this.DOM.headline, { autoAlpha: 1, y: 0});

    gsap.set([
      this.DOM.slides,
      this.DOM.tags.children,
      this.DOM.voiceover,
      this.DOM.blockquote
    ], { autoAlpha: 0, y: 40, x: 0 });
  }

  setupStaticFallback() {
    gsap.set([
      this.DOM.headline,
      this.DOM.slides,
      this.DOM.tags,
      this.DOM.voiceover,
      this.DOM.blockquote
    ], { autoAlpha: 1, y: 0, x: 0 });
  }

  init() {
    this.animateHeadline();
    this.animateSlides();
    this.animateBlockquote();
    this.animateTagsAndVoiceover();
    this.setupBackgroundChanges();
  }

  // Headline Animation 
  animateHeadline() {
    const split = new SplitText(this.DOM.headline, { 
      type: 'words', wordsClass: 'split-word' 
    });
    gsap.set(split.words, { autoAlpha: 0, y: 40 });

    const anim = gsap.to(split.words, {
      autoAlpha: 1, y: 0,
      duration: 1.2, stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: this.DOM.headline,
        start: 'top 80%',
        toggleActions: 'play none none none',
        markers: true
      }
    });
    this.animations.push(anim);
  }
   
  // Slides 
  animateSlides() {
    this.DOM.slides.forEach((slide, i) => {
      const slideAnim = gsap.to(slide, {
        autoAlpha: 1, x: 0,
        duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: slide,
          start: 'top 80%',
          toggleActions: 'play none none none',
          markers: true
        }
      });
      
      const caption = slide.querySelector('figcaption');
      if (caption) {
        gsap.set(caption, { autoAlpha: 0, y: 20 });
        const captionAnim = gsap.to(caption, {
          autoAlpha: 1, y: 0,
          duration: 0.8, delay: 0.3,
          ease: 'back.out',
          scrollTrigger: {
            trigger: slide,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
        this.animations.push(captionAnim);
      }

      this.animations.push(slideAnim);
    });
}

  // Blockquote 
  animateBlockquote() {
    if (this.DOM.blockquote) {
      const anim = gsap.to(this.DOM.blockquote, {
        autoAlpha: 1, y: 0,
        duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: this.DOM.blockquote,
          start: 'top 80%',
          toggleActions: 'play none none none',
          markers: true
        }
      });
      this.animations.push(anim);
    }
  }

// Tags & Voiceover 
  animateTagsAndVoiceover() {
    if (this.DOM.tags) {
      gsap.set(this.DOM.tags.children, { autoAlpha: 0, y: 40 });

      const tagsAnim =gsap.to(this.DOM.tags.children, {
        autoAlpha: 1, y: 0,
        duration: 0.8, stagger: 0.15,
        ease: 'back.out',
        scrollTrigger: {
          trigger: this.DOM.tags,
          start: 'top 80%',
          toggleActions: 'play none none none',
          markers: true
        }
      });
      this.animations.push(tagsAnim);
    }

    if (this.DOM.voiceover) {
      const voiceAnim = gsap.to(this.DOM.voiceover, {
        autoAlpha: 1, y: 0,
        duration: 1, ease: 'power2.out',
        scrollTrigger: {
          trigger: this.DOM.voiceover,
          start: 'top 80%',
          toggleActions: 'play none none none',
          markers: true
        }
      });
      this.animations.push(voiceAnim);
    }
  }

  // Background Changes Animation
  setupBackgroundChanges() {
    this.DOM.slides.forEach(slide => {
      const trigger = ScrollTrigger.create({
        trigger: slide,
        start: 'top 50%',
        onEnter: () => this.updateBackground(slide),
        onEnterBack: () => this.updateBackground(slide),
        markers: true
      });
      this.animations.push(trigger);
    });
  }

  updateBackground(slide) {
    gsap.to(this.DOM.bg, {
      opacity: 0, duration: 0.5,
      onComplete: () => {
        this.DOM.bg.style.backgroundImage = `url(${slide.dataset.bg})`;
        gsap.to(this.DOM.bg, { opacity: 0.15, duration: 1 });
      }
    })
  }
  
  cleanUp() {
    this.animations.forEach(anim => anim?.kill?.());
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }
}