// src/js/screens/screen0.js
import { lockScroll, unlockScroll } from "../core/animation-controller";
import { gsap } from 'gsap';
import { SplitText } from "gsap/SplitText";

export class Screen0Animations {
    constructor() {
        this.autoExitTimeout = null;
        this.init();
    }
    
    init() {
        this.setupScrollControl();
        this.animateLogo();
        this.setupExitBehavior();
    }

    setupScrollControl() {
        lockScroll();
        unlockScroll(() => window.scrollTo(0, 0), 50);
    }

    animateLogo() {
        const logo = document.querySelector('.logo')
        if (!logo) return;

        // Text styling
        const splitLogo = new SplitText(logo, { type: 'chars' });
        this.styleLogoChars(splitLogo.chars);

        //Timeline construction
        this.createIntroTimeline(splitLogo.chars);
    }

    styleLogoChars(chars) {
        chars.forEach(char => {
            Object.assign(char.style, {
                background: 'linear-gradient(190deg, hsl(51, 100%, 45%) 50%, hsl(145, 63%, 42%) 100%)',
                webkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                webkitTextFillColor: 'transparent',
                textShadow: '2px 2px 10px hsla(0, 0%, 0%, 0.75)'
            });
        });
    }

    createIntroTimeline(logoChars) {
        const timeline = gsap.timeline();

        timeline.fromTo(
            logoChars,
            {opacity: 0, y: 50},
            {
                opacity: 1, y: 0,
                duration: 1.2, ease: 'power4.out',
                stagger: {amount: 1.2, from: 'start'}
            }
        );

        timeline.fromTo(
            '.screen-0-subheading p',
            { opacity: 0, y: 15, scale: 0.96},
            {
                opacity: 1, y: 0,
                duration: 1, scale: 1,
                ease: 'power2.out'
            },
            '-=0.5'
        );
        timeline.to(
            '.continue-hint',
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
            '-=0.3'
        );
    }

    setupExitBehavior() {
        this.autoExitTimeout = setTimeout(() => this.exitScreen(), 6000);

        ['click', 'wheel', 'touchstart', 'keydown'].forEach(evt => {
            window.addEventListener(evt, this.handleEarlyExit.bind(this), {
                once: true
            });
        });
    }

    handleEarlyExit() {
        clearTimeout(this.autoExitTimeout);
        this.exitScreen();
    }

    exitScreen() {
        const screen = document.querySelector('.screen-0');
        if (!screen) return;

        screen.classList.add('fade-out');

        gsap.to(screen, {
            y: '-100%', duration: 1.2,
            ease: 'power4.inOut',
            onComplete: () => {
                screen.style.display = 'none';
                unlockScroll();
            }
        });
    }
}