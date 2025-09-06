import { gsap } from 'gsap';

export class Quiz {
  constructor(container) {
    this.container = container;
    this.options = container.querySelectorAll('.quiz__option');
    this.resultEl = document.createElement('p');
    this.resultEl.className = 'quiz__result';
    this.container.appendChild(this.resultEl);
    this.answered = false;

    this.handleClick = this.handleClick.bind(this);
    this.bindEvents();
  }
  
  bindEvents() {
    this.options.forEach(option => {
      option.addEventListener('click', this.handleClick);
    });
  }

  handleClick(e) {
    if (this.answered) return;
    
    const selected = e.currentTarget;
    const isCorrect = selected.dataset.correct === 'true';
    const correctOption = [...this.options].find(opt => opt.dataset.correct === 'true');

    this.answered = true;

    // Disable all options 
    this.options.forEach(opt => opt.disabled = true);

    // Feedback classes 
    selected.classList.add(isCorrect ? 'quiz__option--correct' : 'quiz__option--wrong');
    if(!isCorrect) correctOption.classList.add('quiz__option--correct');

    // Result message 
    this.resultEl.textContent = isCorrect ? '✅ Correct! Most food is lost at the farm level.' : '❌ Not quite. Most food is lost at the farm level.';
     gsap.fromTo(this.resultEl, 
      { opacity: 0, y: 10 }, 
      { opacity: 1, y: 0, duration: 0.6, 
        ease: 'power2.out' 
      });

      // Highlight supply chain stage 
      const stage = selected.dataset.answer;
      this.highlightSupplyChain(stage);
  }

  highlightSupplyChain(stage) {
    const chainStage = document.querySelector(`.supply-chain__stage[data-stage="${stage}"]`);
    if (!chainStage) return;

    // Remove existing highlights 
    document.querySelectorAll('.supply-chain__stage').forEach(stageEl => {
      stageEl.classList.remove('highlighted');
    });

    chainStage.classList.add('highlighted');

    // Animate Highlight 
    gsap.fromTo(chainStage, {
      boxShadow: '0 0 0 rgba(255,255,255,0)'
    }, {
      boxShadow: '0 0 25px 5px rgba(0,255,128,0.8)',
      duration: 1.2,
      ease: 'power2.out'
    });
  }
  
  resetQuiz() {
    this.options.forEach(opt => {
      opt.disabled = false;
      opt.classList.remove('quiz__option--correct', 'quiz__option--wrong');
    });

    this.resultEl.textContent = '';
    this.resultEl.style.opacity = 0;
    this.answered = false;

    document.querySelectorAll('.supply-chain__stage').forEach(stageEl => {
      stageEl.classList.remove('highlighted');
      stageEl.style.boxShadow = 'none';
    });
  }

  destroy() {
    this.options.forEach(opt => opt.removeEventListener('click', this.handleClick));
  }
}