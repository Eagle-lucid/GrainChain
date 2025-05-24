// Register Plugins
gsap.registerPlugin(SplitText, ScrollTrigger);

// Wait until DOM is fully loaded
window.addEventListener('DOMContentLoaded', () => {
  // Lock scroll initially
  document.body.style.overflowY = 'hidden';
  window.scrollTo(0, 0);

    // Split the logo text into individual characters
    const  splitLogo = new SplitText('.logo', {type: 'chars'});
    // Apply styles to each char span
    splitLogo.chars.forEach(char => {
      char.style.background = 'linear-gradient(190deg, hsl(51, 100%, 45%) 50%, hsl(145, 63%, 42%) 100%)';
      char.style.webkitBackgroundClip = 'text';
      char.style.backgroundClip = 'text';
      char.style.color = 'transparent';
      char.style.webkitTextFillColor = 'transparent';
      char.style.textShadow = '2px 2px 10px hsla(0, 0%, 0%, 0.75)';
    });

    // Create GSAP timeline 
    const screen0TL = gsap.timeline();
    screen0TL.fromTo(splitLogo.chars, {
        opacity: 0,
        y: 50
    }, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: {
            amount: 1.2,
            from: 'start'
        }
    });

    // Animate subheading with slight zoom & lift 
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

    // Hint ("Tap to continue")
    screen0TL.to('.continue-hint', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.3');

    // Exit animation function
    function exitScreen0() {
        document.querySelector('.screen-0').classList.add('fade-out');
        gsap.to('.screen-0', {
           y: '-100%',
           duration: 1.2,
           ease: 'power4.inOut',
           onComplete() {
               document.querySelector('.screen-0').style.display = 'none';
               document.body.style.overflowY = 'auto'; // Unlock scroll
               document.querySelector('.screen-1').scrollIntoView({ behavior: 'smooth'});
           }
        });
    }
    // Auto-exit after delay (if user doesn’t act)
    const autoExit = setTimeout(exitScreen0, 6000);

    // Allow early exit by user interaction
    ["click", "wheel", "touchstart", "keydown"].forEach(evt => {
        window.addEventListener(evt, () => {
            clearTimeout(autoExit); // Clear the auto-exit timer
            exitScreen0(); // Trigger exit animation
        }, { once: true });
    });
});

// Scroll-triggered Header Styling
    ScrollTrigger.create({
      start: 'top -10',
      end: 99999,
      toggleClass: {
        targets: 'main .header',
        className: 'scrolled'
      }
    });

    // Animate the Logo on Scroll (optional polish)
    gsap.to('.logo-text', {
    scrollTrigger: {
    trigger: 'main .header',
    start: 'top top',
    end: '+=150',
    scrub: true
  },
    scale: 0.94,
    opacity: 0.85,
    ease: 'power2.out'
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
// CTA reveal animation
ScrollTrigger.create({
  trigger: '.screen-1',  // Show when screen-1 enters view
  start: 'top center',
  toggleClass: {
    targets: '.sticky-cta',
    className: 'active'
  }
});
gsap.fromTo('.sticky-cta', 
  { opacity: 0, y: 30, pointerEvents: 'none' },
  {
    opacity: 1,
    y: 0,
    pointerEvents: 'auto',
    scrollTrigger: {
      trigger: '.screen-1',
      start: 'top center',
      toggleActions: 'play none none reverse'
    },
    duration: 0.6,
    ease: 'power2.out'
  }
);
