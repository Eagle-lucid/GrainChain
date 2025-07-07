// src/js/screens/screen4.js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { FormValidator } from '../components/form-validation.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

export class Screen4Animations {
  constructor() {
    this.DOM = this.getDOMElements();
    if (!this.DOM.screen) return;

    this.FormValidator = new FormValidator(this.DOM.form);

    this.resetInitialStates();
    this.initAnimations();
    this.setupScrollTriggers();
  }

  getDOMElements() {
    return {
      screen: document.querySelector('.screen--mission'),
      headerTitle: document.querySelector('.screen--mission__header-title'),
      tagline: document.querySelector('.screen--mission__header-tagline'),
      form: document.querySelector('.screen--mission__form'),
      fields: gsap.utils.toArray(document.querySelectorAll('.screen--mission .form-field'))
    };
  }

  resetInitialStates() {
    // Make sure states match the animation
    if (this.DOM.headerTitle) gsap.set(this.DOM.headerTitle, { autoAlpha: 1, y: 0 });
    if (this.DOM.tagline) gsap.set(this.DOM.tagline, { autoAlpha: 0, y: 20 });
    if (this.DOM.form) gsap.set(this.DOM.form, { autoAlpha: 0, y: 30 });
    if (this.DOM.fields.length > 0) {
      gsap.set(this.DOM.fields, { autoAlpha: 0, y: 20 });
    }
  }

  initAnimations() {
    this.animateHeader();
    this.animateTagline();
    this.animateForm();
  }

  animateHeader() {
    const { headerTitle } = this.DOM;
    if (!headerTitle) return;

    const splitHeadline = new SplitText(headerTitle, {
      type: 'words,chars',
      wordsClass: 'word',
      charsClass: 'char'
    });

    gsap.from(splitHeadline.chars, {
      autoAlpha: 0, y: 30,
      duration: 1, stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headerTitle,
        start: 'top 85%',
        toggleActions: 'play none none none',
        markers: true
      }
    });
  }

  animateTagline() {
    const { tagline } = this.DOM;
    if (!tagline) return;

    gsap.fromTo(tagline, 
      {autoAlpha: 0, y: 20},
      {
        autoAlpha: 1, y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: tagline,
          start: 'top 85%',
          toggleActions: 'play none none none',
          markers: true
        }
      }
    );
  }

  animateForm() {
    const { form, fields } = this.DOM;
    if (!form) return;

    // Timeline for the form & fields
    const tl =gsap.timeline({
      scrollTrigger: {
        trigger: form,
        start: 'top 90%',
        toggleActions: 'play none none none', 
        markers: true
      }
    })

    // Animate form wrapper
    tl.fromTo(form, 
      { autoAlpha: 0, y: 30 }, 
    {
      autoAlpha: 1, y: 0,
      duration: 1, ease: 'back.out(1.2)'
    }
  );

  // Animate each field

  tl.fromTo(fields, 
    {autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1, y: 0,
      duration: 0.6, stagger: 0.1,
      ease: 'power2.out'
    },
    '-=0.5'
    );
  }

  setupScrollTriggers() {
    window.addEventListener('load', () => ScrollTrigger.refresh(true));
  }
}
