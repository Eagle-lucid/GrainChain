// GSAP plugin registration
import { gsap } from 'gsap';
import { TextPlugin, SplitText, ScrollTrigger } from 'gsap/all';

export function initGSAPPlugins() {
    gsap.registerPlugin(TextPlugin, SplitText, ScrollTrigger);
}