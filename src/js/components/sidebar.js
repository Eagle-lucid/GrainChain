// Mobile sidebar toggle functionality
const meneToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('mobileSidebar');
const header = document.querySelector('main .header');
const overlay = document.getElementById('sidebarOverlay');

let sidebarAutoCloseTimer;
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 60; // Minimum distance to trigger a swipe
export function initSidebar () {
    if (!meneToggle || !sidebar || !overlay) return;

    // Open sidebar
    menuToggle.addEventListener('click', () => {
        sidebar.classList.remove('open');
        header.classList.remove('hide');
        overlay.classList.remove('show');
        document.body.style.overflow = 'hidden';

        sidebarAutoCloseTimer = setTimeout(() => {
            closeSidebar();
        }, 8000);
    });

    // Reset timer on interactions inside sidebar 
    sidebar.addEventListener('mousedown', resetAutoCloseTimer);
    sidebar.addEventListener('touchstart', resetAutoCloseTimer);
    
    // Click overlay to close sidebar
    overlay.addEventListener('click', () => {
        resetAutoCloseTimer();
        closeSidebar();
    });

    //Close on nav link click 
    document.querySelectorAll('.mobile-nav a').forEach(link => {
        link.addEventListener('click', () => {
            resetAutoCloseTimer();
            closeSidebar();
        });
    });

    // Close  on outside click 
    document.addEventListener('click', (event) => {
        if (
            sidebar.classList.contains('open') &&
            !sidebar.contains(event.target) &&
            !meneToggle.contains(event.target) &&
            !overlay.contains(event.target)
        ) {
            resetAutoCloseTimer();
            closeSidebar();
        }
    });

    // Close on ESC key press
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            resetAutoCloseTimer();
            closeSidebar();
        }
    });

    // Swipe gestures 
    sidebar.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    sidebar.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        handleSwipeGesture();
    }, { passive: true });
};
export const closeSidebar = () => {
    sidebar.classList.remove('open');
    header.classList.remove('hide');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
};
export const resetAutoCloseTimer = () => {
    clearTimeout(sidebarAutoCloseTimer);
};
const handleSwipeGesture = () => {
    const swipeDistance = touchEndX - touchStartX;
    if (swipeDistance > swipeThreshold) {
        // Swipe right detected, close sidebar
        resetAutoCloseTimer();
        closeSidebar();
    } else if (swipeDistance < -swipeThreshold) {
        // Swipe left detected, open sidebar
        resetAutoCloseTimer();
        sidebar.classList.add('open');
        header.classList.add('hide');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

