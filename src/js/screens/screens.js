// Import all screens
import { Screen0Animations } from './screen0.js';
import { Screen1Animations } from './screen1.js';
import { Screen2Animations } from './screen2.js'; 
import { Screen3Animations } from './screen3.js';
import { Screen4Animations } from './screen4.js';

export class AllScreensAnimations {
    constructor() {
        this.screens = {};
        this.initScreens();
    }

    initScreens() {
        this.screens.screen0 = new Screen0Animations();
        this.screens.screen1 = new Screen1Animations();

        this.screens.screen2 = new Screen2Animations();

        this.screens.screen3 = new Screen3Animations();
        this.screens.screen4 = new Screen4Animations();
    }

    cleanUp() {
        Object.values(this.screens).forEach(screen => {
            if (screen && typeof screen.cleanup === 'function') {
                screen.cleanup();
            }
        });
    }
}