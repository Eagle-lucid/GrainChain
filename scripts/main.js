// Scroll behavior for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const cta = document.querySelector('.sticky-cta');
    const trigger = document.querySelector('.screen-0');
    const triggerButton = trigger.getBoundingClientRect().bottom;

    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }

    if (window.scrollY > triggerButton) {
        cta.classList.add('active');
    } else {
        cta.classList.remove('active');
    }
})
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