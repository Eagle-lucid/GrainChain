// src/js/screens/screen2.js
export class Screen2Animations {
    constructor() {
        this.init();
    }

    init() {
        this.animateHeadline();
        this.animateFloatingIcons();
        this.animateSupplyChainVisual();
        this.animatePHLCounter();
    }

    animateHeadline() {
        const headline = document.querySelector('.scree-2 .headline');
        if (!headline) return;

        const splitHeadline = new SplitText(headline, { type: 'words' });
        gsap.from(splitHeadline.words, {
            opacity: 0,
            duration: 1.2,
            y: 30,
            scale: 0.95,
            stagger: 0.2,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: headline,
                start: 'top 95%',
                toggleActions: 'play none none none'
            }
        });
    }

    animateFloatingIcons() {
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
    }

    animateSupplyChainVisual() {
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
    }
    
    animatePHLCounter() {
        const counters = document.querySelectorAll('.percent');
        
        counters.forEach((counter) => {
            const target = parseInt(counter.dataset.count);
            const isLargeValue = target >= 30; // Determine if this is a "red" case
            
            gsap.to(counter, {
                innerText: target,
                duration: 2.5,
                ease: "power2.out",
                snap: { innerText: 1 },
                scrollTrigger: {
                    trigger: counter,
                    start: "top 80%",
                    toggleActions: "play none none none"
                },
                onUpdate: function() {
                    const currentVal = parseInt(counter.innerText);
                    // For large values (near 50), transition green → yellow → orange → red
                    if (isLargeValue) {
                        if (currentVal < 15) {
                            counter.style.color = `hsl(145, 63%, 42%)`; // Green
                        } else if (currentVal < 30) {
                            counter.style.color = `hsl(51, 100%, 45%)`; // Gold
                        } else if (currentVal < 40) {
                            counter.style.color = `hsl(30, 100%, 50%)`; // Orange
                        } else {
                            counter.style.color = `hsl(0, 100%, 45%)`; // Red
                        }
                    } 
                    // For smaller values (like 25), transition green → gold
                    else {
                        if (currentVal < 15) {
                            counter.style.color = `hsl(145, 63%, 42%)`; // Green
                        } else {
                            counter.style.color = `hsl(51, 100%, 45%)`; // Gold
                        }
                    }
                },
                modifiers: {
                    innerText: (value) => Math.round(value) + "%"
                }
            });
        });
    }
}