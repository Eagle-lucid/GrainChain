import { gsap } from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Animation Constants
const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.4
};

const EASING = {
  in: 'power2.in',
  out: 'power2.out',
  bounce: 'back.out(1.2)'
};

export const initHeaderScroll = () => {
  const header = document.querySelector('.header');
  if (!header) return;

  // ======================
  // 1. Device Detection
  // ======================
  const isTouchDevice = ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0) || 
                       window.matchMedia('(pointer: coarse)').matches;

  // ======================
  // 2. Scroll Effects
  // ======================
  const scrollTrigger = ScrollTrigger.create({
    start: 'top top+=10',
    end: 'max',
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.direction === 2 || self.scroll() > 10);
    }
  });

  // ======================
  // 3. Desktop Dropdowns
  // ======================
  const initDesktopDropdowns = () => {
    const dropdowns = document.querySelectorAll('.nav-list__dropdown');
    if (!dropdowns.length) return;

    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector('.nav-list__dropdown-menu');
      const items = menu?.querySelectorAll('li');
      if (!menu || !items) return;

      // Clear existing timelines
      dropdown._openTimeline?.kill();
      dropdown._closeTimeline?.kill();

      // Create timelines
      dropdown._openTimeline = gsap.timeline({ paused: true })
        .to(menu, {
          opacity: 1,
          y: 0,
          pointerEvents: 'auto',
          duration: ANIMATION_DURATIONS.normal,
          ease: EASING.out
        })
        .to(items, {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: ANIMATION_DURATIONS.fast,
          ease: EASING.bounce
        }, 0.1);

      dropdown._closeTimeline = gsap.timeline({ paused: true })
        .to(items, {
          opacity: 0,
          y: -6,
          duration: ANIMATION_DURATIONS.fast,
          ease: EASING.in
        })
        .to(menu, {
          opacity: 0,
          y: -8,
          pointerEvents: 'none',
          duration: ANIMATION_DURATIONS.fast,
          ease: EASING.in
        }, 0);

      const handleOpen = () => {
        dropdown._closeTimeline.pause();
        dropdown._openTimeline.restart();
      };

      const handleClose = () => {
        dropdown._openTimeline.pause();
        dropdown._closeTimeline.restart();
      };

      // Event listeners
      dropdown.addEventListener('mouseenter', handleOpen);
      dropdown.addEventListener('mouseleave', handleClose);

      if (isTouchDevice) {
        dropdown.addEventListener('click', (e) => {
          if (window.innerWidth >= 992) {
            e.preventDefault();
            return;
          }
          dropdown.classList.toggle('active');
          dropdown.classList.contains('active') ? handleOpen() : handleClose();
        });
      }
    });
  };

  // ======================
  // 4. Responsive Setup
  // ======================
  let resizeTimeout;
  const checkViewport = () => {
    if (window.innerWidth >= 992) {
      initDesktopDropdowns();
    }
  };

  // Initial setup
  checkViewport();

  // Debounced resize handler
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(checkViewport, 200);
  });

  // ======================
  // 5. Reduced Motion
  // ======================
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.nav-list__dropdown-menu, .nav-list__dropdown-menu li', {
      opacity: 1, 
      y: 0
    });
  }

  // ======================
  // 6. Cleanup Function
  // ======================
  return () => {
    // Cleanup GSAP instances
    scrollTrigger.kill();
    
    // Cleanup dropdown timelines
    document.querySelectorAll('.nav-list__dropdown').forEach(dropdown => {
      dropdown._openTimeline?.kill();
      dropdown._closeTimeline?.kill();
    });
    
    // Remove event listeners
    window.removeEventListener('resize', checkViewport);
  };
};