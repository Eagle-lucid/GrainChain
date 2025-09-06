// Export lock and unlock functions for the animation controller

export function lockScroll() {
  document.body.style.overflowY = 'hidden';
}

export function unlockScroll() {
  document.body.style.overflowY = 'auto';
}