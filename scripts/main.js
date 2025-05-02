// Scroll behavior for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
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
