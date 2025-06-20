// Import GSAP
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
  // 1. State Management
  // ======================
  let isMobileMenuOpen = false;
  let resizeTimeout;
  let mobileMenuCleanup = null;
  
  const mobileMenuComponents = {
    toggle: null,
    sidebar: null,
    overlay: null,
    navItems: null,
    openTimeline: null,
    closeTimeline: null
  };

  // ======================
  // 2. Device Detection
  // ======================
  const isTouchDevice = ('ontouchstart' in window) || 
                       (navigator.maxTouchPoints > 0) || 
                       window.matchMedia('(pointer: coarse)').matches;
  
  if (isTouchDevice) {
    document.documentElement.classList.add('touch-device');
  }

  // ======================
  // 3. Scroll Effects
  // ======================
  const scrollTrigger = ScrollTrigger.create({
    start: 'top top+=10',
    end: 'max',
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.direction === 2 || self.scroll() > 10);
    }
  });

  // ======================
  // 4. Mobile Menu System
  // ======================
  const initMobileMenu = () => {
    // Get elements
    mobileMenuComponents.toggle = document.querySelector('#menuToggle');
    mobileMenuComponents.sidebar = document.querySelector('#mobileSidebar');
    mobileMenuComponents.overlay = document.querySelector('#sidebarOverlay');
    mobileMenuComponents.navItems = document.querySelectorAll('.nav-item');
    const closeBtn = mobileMenuComponents.sidebar?.querySelector('.mobile-sidebar__close-btn');

    // Null check
    if (!mobileMenuComponents.toggle || !mobileMenuComponents.sidebar || !mobileMenuComponents.overlay) return;

    // Clear existing timelines
    if (mobileMenuComponents.openTimeline) mobileMenuComponents.openTimeline.kill();
    if (mobileMenuComponents.closeTimeline) mobileMenuComponents.closeTimeline.kill();

    // Create timelines
    mobileMenuComponents.openTimeline = gsap.timeline({ paused: true })
      .to(mobileMenuComponents.overlay, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: ANIMATION_DURATIONS.normal
      })
      .to(mobileMenuComponents.sidebar, {
        x: 0,
        duration: ANIMATION_DURATIONS.slow,
        ease: EASING.out
      }, 0)
      .to(mobileMenuComponents.navItems, {
        x: 0,
        opacity: 1,
        stagger: 0.05,
        duration: ANIMATION_DURATIONS.normal
      }, 0.1);

    mobileMenuComponents.closeTimeline = gsap.timeline({ paused: true })
      .to(mobileMenuComponents.navItems, {
        x: -20,
        opacity: 0,
        duration: ANIMATION_DURATIONS.fast,
        stagger: 0.02
      })
      .to(mobileMenuComponents.sidebar, { 
        x: '100%', 
        duration: 0.1 
      }, 0)
      .to(mobileMenuComponents.overlay, {
        opacity: 0,
        pointerEvents: 'none',
        duration: ANIMATION_DURATIONS.normal
      }, 0);

    // Event handlers
    const toggleMenu = () => isMobileMenuOpen ? closeMobileMenu() : openMobileMenu();
    const handleEscape = (e) => e.key === 'Escape' && closeMobileMenu();

    // Add event listeners
    mobileMenuComponents.toggle.addEventListener('click', toggleMenu);
    mobileMenuComponents.overlay.addEventListener('click', closeMobileMenu);
    document.addEventListener('keydown', handleEscape);
    closeBtn?.addEventListener('click', closeMobileMenu);

    // Return cleanup function
    return () => {
      mobileMenuComponents.toggle?.removeEventListener('click', toggleMenu);
      mobileMenuComponents.overlay?.removeEventListener('click', closeMobileMenu);
      document.removeEventListener('keydown', handleEscape);
      closeBtn?.removeEventListener('click', closeMobileMenu);
    };
  };

  const openMobileMenu = () => {
    if (isMobileMenuOpen) return;
    
    isMobileMenuOpen = true;
    document.body.classList.add('mobile-menu-open');
    mobileMenuComponents.toggle?.setAttribute('aria-expanded', 'true');
    mobileMenuComponents.sidebar?.setAttribute('aria-hidden', 'false');
    
    // Focus management
    requestAnimationFrame(() => {
      const firstItem = mobileMenuComponents.sidebar?.querySelector('.nav-item a');
      firstItem?.focus();
    });
    
    mobileMenuComponents.openTimeline?.restart();
  };

  const closeMobileMenu = () => {
    if (!isMobileMenuOpen) return;
    
    isMobileMenuOpen = false;
    document.body.classList.remove('mobile-menu-open');
    mobileMenuComponents.toggle?.setAttribute('aria-expanded', 'false');
    mobileMenuComponents.sidebar?.setAttribute('aria-hidden', 'true');
    mobileMenuComponents.toggle?.focus();
    
    mobileMenuComponents.closeTimeline?.restart();
  };

  // ======================
  // 5. Desktop Dropdowns
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
  // 6. Responsive Setup
  // ======================
  const checkViewport = () => {
    // Cleanup previous instances
    if (mobileMenuCleanup) mobileMenuCleanup();
    
    // Close menu if resizing to desktop
    if (isMobileMenuOpen && window.innerWidth >= 992) {
      closeMobileMenu();
    }

    // Initialize appropriate version
    if (window.innerWidth >= 992) {
      initDesktopDropdowns();
    } else {
      mobileMenuCleanup = initMobileMenu();
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
  // 7. Reduced Motion
  // ======================
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set('.nav-list__dropdown-menu, .nav-list__dropdown-menu li', {
      opacity: 1, 
      y: 0
    });
  }

  // ======================
  // 8. Cleanup Function
  // ======================
  return () => {
    // Cleanup GSAP instances
    scrollTrigger.kill();
    mobileMenuComponents.openTimeline?.kill();
    mobileMenuComponents.closeTimeline?.kill();
    
    // Cleanup dropdown timelines
    document.querySelectorAll('.nav-list__dropdown').forEach(dropdown => {
      dropdown._openTimeline?.kill();
      dropdown._closeTimeline?.kill();
    });
    
    // Remove event listeners
    window.removeEventListener('resize', checkViewport);
    document.removeEventListener('keydown', handleEscapeKey);
    
    // Execute mobile menu cleanup if exists
    if (mobileMenuCleanup) mobileMenuCleanup();
  };
};