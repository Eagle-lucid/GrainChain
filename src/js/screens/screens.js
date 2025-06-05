// Import all screens
import { Screen0Animations } from './screen0.js';
import { Screen1Animations } from './screen1.js';
import { Screen2Animations } from './screen2.js'; 
import { Screen3Animations } from './screen3.js';
import { Screen4Animations } from './screen4.js';

export class AllScreensAnimations {
    constructor() {
        this.screens = {
        screen0: new Screen0Animations(),
        screen1: new Screen1Animations(),
        screen2: new Screen2Animations(),
        screen3: new Screen3Animations(),
        screen4: new Screen4Animations()
        }
    }
}