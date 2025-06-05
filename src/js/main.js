// src/js/main.js
import { initGSAPPlugins } from './core/gsap-register.js';
import { lockScroll } from './core/animation-controller.js';
import { initHeaderScroll } from './components/header.js';
import { initCTA } from './components/cta.js';
import { initSidebar } from './components/sidebar.js';
import { AllScreensAnimations } from './screens/screens.js';
import { SupplyChainQuiz } from './components/scf.js';
import { FormValidator } from './components/form-validation.js';

class GrainChainApp {
  constructor() {
    this.init();
  }

  init() {
    try {
      this.initPlugins();
      this.initComponents();
      this.initAnimations();
      this.setupGlobalEvents();
    } catch (error) {
      console.error('GrainChainApp initialization error:', error);
      this.showErrorFallback();
    }
  }

  initPlugins() {
    initGSAPPlugins();
    lockScroll(); // Initial scroll lock
  }

  initComponents() {
    initHeaderScroll();
    initCTA();
    initSidebar();
    new FormValidator('.cta-form');
    new SupplyChainQuiz();
  }

  initAnimations() {
    this.screenAnimations = new AllScreensAnimations();
  }

  setupGlobalEvents() {
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
      this.trackPerformance();
    });
  }

  trackPerformance() {
    if (window.PerformanceObserver) {
      const perfObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach(entry => {
          console.log('[Performance]', entry.name, entry.duration);
        });
      });
      perfObserver.observe({ entryTypes: ['measure', 'paint'] });
    }
  }

  showErrorFallback() {
    // Basic fallback content if critical JS fails
    document.body.innerHTML = `
      <div class="error-fallback">
        <h1>Something went wrong</h1>
        <p>Please refresh the page or try again later.</p>
      </div>
    `;
  }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  new GrainChainApp();
});