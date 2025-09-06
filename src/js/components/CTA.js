import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { closeSidebar } from './sidebar';

export class StickyCTA {
  constructor() {
    // DOM Elements
    this.ctaContainer = document.querySelector('.sticky-cta-container');
    this.ctaButton = document.getElementById('mainStickyCTA');
    this.ctaBadge = this.ctaButton?.querySelector('.cta-badge');
    this.dialog = document.getElementById('ctaFormPopup');
    this.form = document.getElementById('ctaForm');

    // State
    this.spotsLeft = 3; // Example initial spots
    this.lastScrollY = 0;
    this.spotInterval = null;

    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    this.init();
  }

  init() {
    if (!this.ctaButton || !this.dialog) return;

    this.setupAnimations();
    this.handleScroll();
    this.handleSpots();
    this.handlePopup();
    this.handleForm();
  }

  /* -----------------------------
     CTA Floating + Urgency Anim
  ------------------------------ */
  setupAnimations() {
    // Floating effect
    gsap.to(this.ctaButton, {
      y: -6,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // Progress bar urgency
    gsap.fromTo(this.ctaButton,
      { '--progress-width': '0%' },
      {
        '--progress-width': '100%',
        duration: 45,
        ease: "none",
        onComplete: () => {
          this.ctaContainer.setAttribute('data-cta-state', 'urgent');
        }
      }
    );
  }

  /* -----------------------------
     Scroll Shrink Behavior
  ------------------------------ */
  handleScroll() {
    this._scrollHandler = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > this.lastScrollY;

      this.ctaContainer.toggleAttribute(
        'data-shrink',
        scrollingDown && currentY > 100
      );

      this.lastScrollY = currentY;
      gsap.ticker.remove(this._scrollHandler);
    };

    window.addEventListener('scroll', () => {
      gsap.ticker.add(this._scrollHandler);
    }, { passive: true });
  }

  /* -----------------------------
     Spots Badge Logic
  ------------------------------ */
  handleSpots() {
    if (!this.ctaBadge) return;

    const updateBadge = () => {
      if (this.spotsLeft <= 0) return;

      this.spotsLeft--;

      gsap.fromTo(this.ctaBadge,
        { scale: 1.3, backgroundColor: 'rgba(255, 50, 50, 0.4)', color: '#fff' },
        {
          scale: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          color: 'inherit',
          duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          onComplete: () => {
            this.ctaBadge.textContent = 
              this.spotsLeft > 0 ? `${this.spotsLeft} spot${this.spotsLeft !== 1 ? 's' : ''} left` : 'FULL!';
            
            if (this.spotsLeft === 0) {
              this.ctaContainer.setAttribute('data-cta-state', 'urgent');
            }
          }
        }
      );
    };

    this.spotInterval = setInterval(updateBadge, 15000); // Simulate 15s countdown
  }

  /* -----------------------------
     Open/Close Form Popup
  ------------------------------ */
  handlePopup() {
    this.ctaButton.addEventListener('click', () => {
      this.dialog.showModal();
      this.animateDialog('open');
      closeSidebar();
    });

    this.dialog.addEventListener('click', (e) => {
      if (e.target === this.dialog) {
        this.animateDialog('close').then(() => this.dialog.close());
      }
    });
  }

  animateDialog(action) {
    return gsap.to(this.dialog, {
      opacity: action === 'open' ? 1 : 0,
      y: action === 'open' ? 0 : 15,
      duration: 0.25,
      ease: "power2.out"
    });
  }

  /* -----------------------------
     Form Validation & Submit
  ------------------------------ */
  handleForm() {
    if (!this.form) return;

    this.form.addEventListener('input', (e) => {
      const field = e.target;
      const errorEl = document.getElementById(`${field.id}Error`);

      if (!field.validity.valid) {
        this.setError(errorEl, field.validationMessage || 'Invalid input');
      } else {
        this.clearError(errorEl);
      }
    });

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      Array.from(this.form.elements).forEach(field => {
        if (field.required && !field.value.trim()) {
          this.setError(
            document.getElementById(`${field.id}Error`),
            `${field.labels?.[0]?.textContent || 'This field'} is required`
          );
          isValid = false;
        }
      });

      if (isValid) {
        this.showSuccess();
      }
    });
  }

  setError(el, message) {
    if (!el) return;

    gsap.fromTo(el,
      { y: -8, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.25,
        onStart: () => {
          el.textContent = message;
          el.classList.add('active');
        }
      }
    );
  }

  clearError(el) {
    if (!el) return;

    gsap.to(el, {
      opacity: 0,
      y: -8,
      duration: 0.2,
      onComplete: () => el.classList.remove('active')
    });
  }

  /* -----------------------------
     Success State + Confetti
  ------------------------------ */
  showSuccess() {
    this.createConfetti();
    this.ctaContainer.setAttribute('data-cta-state', 'success');

    gsap.to(this.ctaButton, {
      keyframes: [
        { scale: 1.1, duration: 0.15 },
        { scale: 1, duration: 0.1 }
      ]
    });

    this.animateDialog('close').then(() => {
      this.dialog.close();
      this.form.reset();

      const originalText = this.ctaButton.innerHTML;
      this.ctaButton.innerHTML = `
        <span class="cta-core">
          <span class="cta-text">Thank You!</span>
          <span class="cta-badge">✓</span>
        </span>
      `;

      setTimeout(() => {
        this.ctaButton.innerHTML = originalText;
      }, 3000);
    });
  }

  createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    const emojis = ['🌾', '🚜', '🌱', '✨'];

    for (let i = 0; i < 12; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.textContent = emojis[i % emojis.length];
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.animationDelay = `${i * 0.15}s`;
      confettiContainer.appendChild(confetti);
    }

    document.body.appendChild(confettiContainer);
    setTimeout(() => confettiContainer.remove(), 3000);
  }

  /* -----------------------------
     Cleanup
  ------------------------------ */
  destroy() {
    clearInterval(this.spotInterval);
    window.removeEventListener('scroll', this.handleScroll);
    gsap.killTweensOf([this.ctaButton, this.dialog]);
  }
}
