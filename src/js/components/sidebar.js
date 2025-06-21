import { gsap }from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

// Elements
let sidebar;
let toggleBtn;
let overlay;
let navItems;
let closeBtn;

// Animation timelines
let openTimeline;
let closeTimeline;

// State
let isOpen = false;
let autoCloseTimer;

// Initialize elements
const initElements = () => {
  sidebar = document.querySelector('#mobileSidebar');
  toggleBtn = document.querySelector('#menuToggle'); 
  overlay = document.querySelector('#sidebarOverlay');
  navItems = document.querySelectorAll('.nav-item'); 
  closeBtn = document.querySelector('.mobile-sidebar__close-btn');
};

// Create animations
const createAnimations = () => {
  openTimeline = gsap.timeline({ paused: true })
    .to(overlay, {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.3
    })
    .to(sidebar, {
      x: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, 0)
    .to(navItems, {
      x: 0,
      opacity: 1,
      stagger: 0.05,
      duration: 0.3
    }, 0.1);

  closeTimeline = gsap.timeline({ paused: true })
    .to(navItems, {
      x: 20,
      opacity: 0,
      duration: 0.2,
      stagger: 0.02
    })
    .to(sidebar, { 
      x: '-100%', 
      duration: 0.1 
    }, 0)
    .to(overlay, {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.3
    }, 0);
};

// Menu control functions
export const closeSidebar = () => {
  if (!isOpen) return;
  isOpen = false;
  document.body.classList.remove('mobile-menu-open'); 
  toggleBtn?.setAttribute('aria-expanded', 'false');
  sidebar?.setAttribute('aria-hidden', 'true');
  closeTimeline.restart();
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
};

export const resetAutoCloseTimer = () => {
  if (autoCloseTimer) clearTimeout(autoCloseTimer);
  autoCloseTimer = setTimeout(() => {
    closeSidebar();
  }, 5000); // 5 second timeout
};

const openSidebar = () => {
  if (isOpen) return;
  isOpen = true;
  document.body.classList.add('mobile-menu-open'); // Changed to match your header's class
  toggleBtn?.setAttribute('aria-expanded', 'true');
  sidebar?.setAttribute('aria-hidden', 'false');
  openTimeline.restart();
  
  // Focus management
  requestAnimationFrame(() => {
    const firstItem = sidebar?.querySelector('.nav-item a');
    firstItem?.focus();
  });
};

const toggleSidebar = () => isOpen ? closeSidebar() : openSidebar();

// Initialize
export const initSidebar = () => {
  initElements();
  if (!sidebar || !toggleBtn) return;

  // Active Link logic
  const setActiveLink = () => {
    const links = document.querySelectorAll('.nav-link');
    const currentPath = window.location.hash || '#problem';

    links.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
            link.classList.remove('active');
            closeSidebar();
        }
    });
  };

  setActiveLink();

  // update on hash change 
  window.addEventListener('hashchange', setActiveLink);
  createAnimations();

  // Event listeners
  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSidebar();
  });
  overlay?.addEventListener('click', closeSidebar);
  closeBtn?.addEventListener('click', closeSidebar);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeSidebar();
  });

  // Cleanup
  return () => {
    toggleBtn?.removeEventListener('click', toggleSidebar);
    overlay?.removeEventListener('click', closeSidebar);
    closeBtn?.removeEventListener('click', closeSidebar);
    document.removeEventListener('keydown', closeSidebar);
    if (autoCloseTimer) clearTimeout(autoCloseTimer);
    openTimeline?.kill();
    closeTimeline?.kill();
  };
};