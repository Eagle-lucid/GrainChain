// Register Plugins
gsap.registerPlugin(TextPlugin, SplitText, ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  // === Lock scroll initially ===
  document.body.style.overflowY = 'hidden';
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 50);
  // === Screen 0 Intro Animation ===
  const logo = document.querySelector('.logo');
  const splitLogo = new SplitText(logo, { type: 'chars' });

  splitLogo.chars.forEach(char => {
    char.style.background = 'linear-gradient(190deg, hsl(51, 100%, 45%) 50%, hsl(145, 63%, 42%) 100%)';
    char.style.webkitBackgroundClip = 'text';
    char.style.backgroundClip = 'text';
    char.style.color = 'transparent';
    char.style.webkitTextFillColor = 'transparent';
    char.style.textShadow = '2px 2px 10px hsla(0, 0%, 0%, 0.75)';
  });

  const screen0TL = gsap.timeline();
  screen0TL.fromTo(splitLogo.chars, {
    opacity: 0,
    y: 50
  }, {
    opacity: 1,
    y: 0,
    duration: 1.2,
    ease: 'power4.out',
    stagger: { amount: 1.2, from: 'start' }
  });

  screen0TL.fromTo('.screen-0-subheading p', {
    opacity: 0,
    scale: 0.96,
    y: 15
  }, {
    opacity: 1,
    scale: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out'
  }, '-=0.5');

  screen0TL.to('.continue-hint', {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  }, '-=0.3');

  function exitScreen0() {
    document.querySelector('.screen-0').classList.add('fade-out');
    gsap.to('.screen-0', {
      y: '-100%',
      duration: 1.2,
      ease: 'power4.inOut',
      onComplete() {
        document.querySelector('.screen-0').style.display = 'none';
        document.body.style.overflowY = 'auto'; // Unlock scroll

      }
    });
  }

  const autoExit = setTimeout(exitScreen0, 6000);
  ['click', 'wheel', 'touchstart', 'keydown'].forEach(evt => {
    window.addEventListener(evt, () => {
      clearTimeout(autoExit);
      exitScreen0();
    }, { once: true });
  });

  // === Header Scroll Behavior ===
  ScrollTrigger.create({
    start: 'top -10',
    end: 99999,
    toggleClass: {
      targets: 'main .header',
      className: 'scrolled'
    }
  });

  gsap.to('.logo-text', {
    scrollTrigger: {
      trigger: 'main .header',
      start: 'top bottom-=100',
      end: '+=150',
      scrub: true
    },
    scale: 0.94,
    opacity: 0.85,
    ease: 'power2.out'
  });

  // === CTA Reveal ===
  ScrollTrigger.create({
    trigger: '.screen-1',
    start: 'top center',
    toggleClass: {
      targets: '.sticky-cta',
      className: 'active'
    }
  });

  gsap.fromTo('.sticky-cta', {
    opacity: 0,
    y: 30,
    pointerEvents: 'none'
  }, {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto',
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.screen-1',
      start: 'top center',
      toggleActions: 'play none none reverse'
    }
  });

  // === Screen 1 Scroll Animations ===
  gsap.to('.screen-1', {
    scale: 1,
    ease: 'power1.out',
    scrollTrigger: {
      trigger: '.screen-1',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  gsap.from('.screen-1 .headline', {
    opacity: 0,
    y: 40,
    duration: 1.5,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.screen-1',
      start: 'top center'
    }
  });

  gsap.from('.screen-1 .description', {
    opacity: 0,
    y: 20,
    duration: 1.2,
    delay: 0.3,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.screen-1',
      start: 'top center'
    }
  });

  // === Screen 2 Animations ===
  const headline = document.querySelector('.screen-2 .headline');
  if (headline) {
    const splitHeadline = new SplitText(headline, { type: 'words' });
    gsap.from(splitHeadline.words, {
      opacity: 0,
      y: 30,
      scale: 0.95,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: headline,
        start: 'top 95%',
        markers: true,
        toggleActions: 'play none none none'
      }
    });
  }

  const floatingIcons = document.querySelectorAll('.floating-icon');
  floatingIcons.forEach((icon, i) => {
    gsap.to(icon, {
      y: -30,
      x: gsap.utils.random(-10, 10),
      duration: gsap.utils.random(4, 7),
      rotation: gsap.utils.random(-5, 5),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.3
    });
  });

  gsap.from('.icon', {
    opacity: 0,
    y: 40,
    scale: 0.9,
    stagger: 0.25,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.supply-chain-visual',
      start: 'top bottom-=100',
      once: true,
      toggleActions: 'play none none none'
    }
  });
  // ==== PHL Loss Counter ====
  const counters = document.querySelectorAll('.percent');

  counters.forEach(counter => {
    const target = parseInt(counter.dataset.count);
    const label = counter.dataset.label || '';

    // Animate from 0 to target value
    gsap.fromTo(counter, 
        {innerText: 0}, 
    {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        modifiers: {
            innerText: value => {
                const rounded = Math.round(value);
                counter.style.color = getColorByPercentage(rounded);
                return `${rounded}%`;
            }
        }
    }
);
  });
  // Function to get color based on percentage
  function getColorByPercentage(value) {
    if (value < 10) return 'hsl(145, 63%, 42%)'; // Green
    if (value < 20) return 'hsl(51, 100%, 45%)'; // Yellow
    if (value < 30) return 'hsl(30, 100%, 50%)'; // Orange
    return 'hsl(0, 100%, 50%)'; // Red
  }

  /*
  // Horizontal scroll with ScrollTrigger pinned to wrapper
  gsap.to('.slide-wrapper', {
    xPercent: -100,
    ease: 'none',
    scrollTrigger: {
      trigger: '.slide-wrapper',
      start: 'top top',
      end: () => '+=' + document.querySelector('.slide-wrapper').offsetWidth / 2,
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });
  gsap.from('.screen-3', {
    x: 100,
    opacity: 0,
    duration: 1.2,
    scrollTrigger: {
        trigger: '.screen-3',
        start: 'left center',
        toggleActions: 'play none none reverse'
    }
  });*/

  // === Screen 3 Animations ===
  const screen3HL = document.querySelector('.screen-3 .headline');
  if (screen3HL) {
    const splitVisionHeadline = new SplitText(screen3HL, { type: 'words'});
    gsap.from(splitVisionHeadline.words, {
      opacity: 0,
      y: 40,
      duration: 1.2,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: screen3HL,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    })
  }

  // Animate vision slides 
  gsap.utils.toArray('.vision-slide').forEach((slide, i) => {
     gsap.from(slide, {
      opacity: 0,
      x: 80,
      duration: 1.2,
      delay: i * 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: slide,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
     })
  })
    // JS Logic to Animate BG + Text
  const bgContainer = document.querySelector('.screen-3 .bg-dynamic');

  gsap.utils.toArray('.vision-slide').forEach((slide, i) => {
    // Set background image
    const bgUrl = slide.dataset.bg;
     // Trigger BG change on slide enter
    ScrollTrigger.create({
      trigger: slide,
      start: 'top 85%',
      onEnter: () => {
        // Change BG image 
        bgContainer.style.backgroundImage = `url(${bgUrl})`;
      },
      // Reverse for upward scroll 
      onLeaveBack: () => {
        const prevSlide = slide.previousElementSibling;
        if (prevSlide?.classList.contains('vision-slide')) {
          bgContainer.style.backgroundImage = `url(${prevSlide.dataset.bg})`;
      }
    }
    });

    // Animate text color change on slide enter
  gsap.from(slide.querySelector('p'), {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: slide,
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
   });
  });
    
     // Animate Color Shift 
     ScrollTrigger.create({
      trigger: '.vision-slide:last-child',
      start: 'top 85%',
      onEnter: () => {
        document.querySelector('.bg-dynamic').classList.add('rich-color');
      },
      onLeaveBack: () => {
        document.querySelector('.bg-dynamic').classList.remove('rich-color');
      }
     });
    window.addEventListener('load', () => {
      // Animate Tech Tags
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
    
    // Animate Voiceover Text
    gsap.from('.voiceover-text', {
      opacity: 0,
      y: 40,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.voiceover-text',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    });
    // ==== Screen 4 Animations ====
    const screen4HL = document.querySelector('.screen-4 .headline');
    if (screen4HL) {
      const splitScreen4HL = new SplitText(screen4HL, { type: 'words' });
      gsap.from(splitScreen4HL.words, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: screen4HL,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
    // Animate screen 4 content
    const screen4MS = document.querySelector('.screen-4 .microcopy');
    if (screen4MS) {
      const splitMicrocopy = new SplitText(screen4MS, { type: 'chars' });
      gsap.fromTo(splitMicrocopy.chars, {
        opacity: 0,
        y: 20,
        scale: 0.95
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.05,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: screen4MS,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
    // Animate screen 4 form
    const form = document.querySelector('.screen-4 .cta-form');
    if (form) {
      gsap.from(form, {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: form,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
    }
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});

// Cache reusable DOM selections
const optionButtons = document.querySelectorAll('.option');
const stages = document.querySelectorAll('.stage');

// Stage update function
function updateSupplyChainFlow(isCorrect, selectedAnswer) {
    const stageMap = {
        '1': 'farm',
        '2': 'truck',
        '3': 'warehouse',
        '4': 'store'
    };

    const selectedStage = stageMap[selectedAnswer];

    // Clear existing stage classes
    stages.forEach(stage => stage.classList.remove('correct', 'incorrect'));

    // Apply correct/incorrect classes
    const stageEl = document.querySelector(`.stage[data-stage="${selectedStage}"]`);
    if (isCorrect) {
        stageEl?.classList.add('correct');
    } else {
        stageEl?.classList.add('incorrect');
        // Always mark the correct one for feedback (assumes farm is correct)
        document.querySelector(`.stage[data-stage="farm"]`)?.classList.add('correct');
    }
}

// Option click logic
optionButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        const selectedAnswer = selectedBtn.getAttribute('data-answer');

        // Disable all options and reset styles
        optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'selected', 'fade-in', 'fade-out');
            btn.disabled = true;
        });

        // Highlight selected answer
        selectedBtn.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Ensure only one correct option is marked
        const correctOption = document.querySelector(`.option[data-correct="true"]`);
        if (correctOption && correctOption !== selectedBtn) {
            correctOption.classList.add('correct');
        }

        // Update stages with animation
        updateSupplyChainFlow(isCorrect, selectedAnswer);

        // Start reset timer
        setTimeout(() => {
            // Fade out elements
            [...optionButtons, ...stages].forEach(el => el.classList.add('fade-out'));

            // Wait for fade-out to finish
            setTimeout(() => {
                optionButtons.forEach(btn => {
                    btn.classList.remove('correct', 'incorrect', 'fade-out');
                    btn.disabled = false;
                    btn.classList.add('fade-in');
                });

                stages.forEach(stage => {
                    stage.classList.remove('correct', 'incorrect', 'fade-out');
                    stage.classList.add('fade-in');
                });

                // Cleanup fade-in after animation
                setTimeout(() => {
                    [...optionButtons, ...stages].forEach(el => el.classList.remove('fade-in'));
                }, 500);

            }, 500); 
        }, 3000);
    });
});
// Function for validation testing
const form = document.querySelector('.cta-form');
const inputs = form.querySelectorAll('input, select');

inputs.forEach(input => {
    input.addEventListener('blur', () => {
        if (input.checkValidity()) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }
    });

    input.addEventListener('input', () => {
        input.classList.remove('valid', 'invalid');
    });
});
// Function to toggle sidebar and hide header 
const menuToggle = document.getElementById('menuToggle');
const header = document.querySelector('main .header');
const sidebar = document.getElementById('mobileSidebar');
const overlay = document.getElementById('sidebarOverlay');
let sidebarAutoCloseTimer;
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 60;

menuToggle.addEventListener('click', () => {
    sidebar.classList.add('open');
    header.classList.add('hide');
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';

    // Start auto-close timer
    sidebarAutoCloseTimer = setTimeout(() => {
       closeSidebar()
    }, 8000);
});
//  Reset Timer if User Touches or Clicks Inside Sidebar
sidebar.addEventListener('mousedown', resetAutoCloseTimer);
sidebar.addEventListener('touchstart', resetAutoCloseTimer);

// Function Close Sidebar Utility
function closeSidebar() {
    sidebar.classList.remove('open');
    header.classList.remove('hide');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
}
function resetAutoCloseTimer() {
  clearTimeout(sidebarAutoCloseTimer);
}
// Click outside (overlay)
overlay.addEventListener('click', () => {
    resetAutoCloseTimer();
    closeSidebar();
});
// Close on link click inside sidebar
document.querySelectorAll('.mobile-nav a').forEach(link => {
  link.addEventListener('click', () => {
    resetAutoCloseTimer();
    closeSidebar();
  });
});
// Close on outside click
document.addEventListener('click', (e) => {
    if (
        sidebar.classList.contains('open') &&
        !sidebar.contains(e.target) &&
        !menuToggle.contains(e.target)&&
        !overlay.contains(e.target)
    ) {
        resetAutoCloseTimer()
        closeSidebar();
    }
});
// Close on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        resetAutoCloseTimer();
        closeSidebar();
    }
}); 
// Start touch
sidebar.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
}, {passive: true});
// End touch
sidebar.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipeGesture();
}, {passive: true});
function handleSwipeGesture () {
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > swipeThreshold) {
        resetAutoCloseTimer();
        closeSidebar();
    }
};
// JS logic for Sticky CTA button 
const stickyCTA = document.querySelector('.sticky-cta');
if (stickyCTA) {
  stickyCTA.addEventListener('click', () => {
    const formSection = document.querySelector('.screen-4');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
      // Optionally close sidebar if open
      if (sidebar.classList.contains('open')) {
        resetAutoCloseTimer();
        closeSidebar();
      }
    }
  })
}