// Import lock and unlock functions from the animation controller
import { lockScroll, unlockScroll } from '../core/animation-controller.js';
import { SplitText  } from 'gsap/all';
import { gsap } from 'gsap';

export function initScreen0() {
    lockScroll();
    setTimeout(() => window.scrollTo(0, 0), 50);

    // Animate logo text 
    const logo = document.querySelector('.logo');
    if (!logo) return; // guard clause to ensure logo exists

    const splitLogo = new SplitText(logo, { type: 'chars' });
    splitLogo.chars.forEach(char => {
        char.style.background = 'linear-gradient(190deg, hsl(51, 100%, 45%) 50%, hsl(145, 63%, 42%) 100%)';
        char.style.webkitBackgroundClip = 'text';
        char.style.backgroundClip = 'text';
        char.style.color = 'transparent';
        char.style.webkitTextFillColor = 'transparent';
        char.style.textShadow = '2px 2px 10px hsla(0, 0%, 0%, 0.75)';
    });

    // Timeline for screen 0 animations 
    const screen0TL = gsap.timeline();

    screen0TL.fromTo(
        splitLogo.chars, 
        {opacity: 0, y: 50},
        {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power4.out',
            stagger: { amount: 1.2, from: 'start' }
        }
    );
    screen0TL.fromTo(
        '.screen-0-subheading p',
        { opacity: 0, y: 15, scale: 0.96 }, 
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: 'power2.out'
        },'-=0.5'
    );

    screen0TL.to(
        '.continue-hint',
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.3'  
    );

    // Auto-exit and event-based exit for screen 0
    const exitScreen0 = () => {
        document.querySelector('.screen-0')?.classList.add('fade-out');
        gsap.to('.screen-0', {
            y: '-=100%',
            duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => {
                document.querySelector('.screen-0').style.display = 'none';
                unlockScroll();
            }
        });
    };

    const autoExit = setTimeout(exitScreen0, 6000);
    ['click', 'wheel', 'touchstart', 'keydown'].forEach(evt => {
        window.addEventListener(evt, () => {
            clearTimeout(autoExit);
            exitScreen0();
        },
        { once: true}
        );
    });
}