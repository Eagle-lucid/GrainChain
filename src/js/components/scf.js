// src/js/components/scf.js
export class SupplyChainQuiz {
    constructor() {
        this.optionButtons = document.querySelectorAll('.option');
        this.stages = document.querySelectorAll('.stage');
        this.stageMap = {
            '1': 'farm',
            '2': 'truck',
            '3': 'warehouse',
            '4': 'store'
        };
        this.init();
    }

    init() {
        this.setupEventListeners() ;
    }

    setupEventListeners() {
        this.optionButtons.forEach(button => {
            button.addEventListener('click', this.handleOptionClick.bind(this));
        });
    }

    handleOptionClick(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        const selectedAnswer = selectedBtn.getAttribute('data-answer');

        this.disableAllOptions();
        this.highlightSelectedOption(selectedBtn, isCorrect);
        this.updateSupplyChainFlow(isCorrect, selectedAnswer);
        this.setupResetTimer();
    }

    disableAllOptions() {
        this.optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'selected', 'fade-in', 'fade-out');
            btn.disabled = true;
        });
    }

    highlightSelectedOption(button, isCorrect) {
        button.classList.add(isCorrect ? 'correct' : 'incorrect');

        const correctOption = document.querySelector('.option[data-correct="true"]');
        if (correctOption && correctOption !== button) {
            correctOption.classList.add('correct');
        }
    }

    updateSupplyChainFlow(isCorrect, selectedAnswer) {
        const selectedStage = this.stageMap[selectedAnswer];

        //Reset all stages
        this.stages.forEach(stage => {
            stage.classList.remove('correct', 'incorrect');
        });

        // Update selected stage
        const stageEl = document.querySelector(`.stage[data-stage="${selectedStage}"]`);
        if (stageEl) {
            stageEl.classList.add(isCorrect ? 'correct' : 'incorrect');
        }

        // Always show correct answer (farm) 
        if (!isCorrect) {
            document.querySelector('.stage[data-stage="farm"]')?.classList.add('correct');
        }
    }

    setupResetTimer() {
        setTimeout(() => {
            this.fadeOutElements();

            setTimeout(() => {
                this.resetElements();

                setTimeout(() => {
                    this.cleanupFadeIn();
                }, 500);
            }, 500);
        }, 3000);
    }

    fadeOutElements() {
        [...this.optionButtons, ...this.stages].forEach(el => {
            el.classList.add('fade-out');
        });
    }

    resetElements() {
        this.optionButtons.forEach(btn => {
            btn.classList.remove('correct', 'incorrect', 'fade-out');
            btn.disabled = false;
            btn.classList.add('fade-in');
        });

        this.stages.forEach(stage => {
            stage.classList.remove('correct', 'incorrect', 'fade-out');
            stage.classList.add('fade-in');
        });
    }

    cleanupFadeIn() {
        [...this.optionButtons, ...this.stages].forEach(el => {
            el.classList.remove('fade-in');
        });
    }
}