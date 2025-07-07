// src/js/components/form-validation.js
import gsap from 'gsap';

export class FormValidator {
  constructor(formElement) {
    this.form = typeof formElement === 'string'
      ? document.querySelector(formElement)
      : formElement;

    if (!this.form) return;

    this.fields = this.form.querySelectorAll('input, textarea, select');
    this.submitBtn = this.form.querySelector('button[type="submit"]');
    this.btnText = this.submitBtn.querySelector('.btn__text');
    this.btnLoader = this.submitBtn.querySelector('.btn__loader');

    this.init();
  }

  init() {
    this.fields.forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.validateField(field));
    });

    this.form.addEventListener('submit', e => {
      e.preventDefault();

      if (!this.validateForm()) {
        this.animateInvalidFields();
      } else {
        this.handleSubmitSuccess();
      }
    });
  }

  validateField(field) {
    if (field.checkValidity()) {
      this.markValid(field);
    } else {
      this.markInvalid(field);
    }
  }

  markValid(field) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    field.setAttribute('aria-invalid', 'false');
    this.toggleError(field, '');
  }

  markInvalid(field) {
    field.classList.remove('valid');
    field.classList.add('invalid');
    field.setAttribute('aria-invalid', 'true');
    this.toggleError(field);
  }

  toggleError(field, message = null) {
    const container = field.closest('.form-field');
    if (!container) return;

    let errorEl = container.querySelector('.form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'form-error';
      container.appendChild(errorEl);
    }

    const helperEl = container.querySelector('.form-helper');
    if (helperEl) helperEl.hidden = !!message;

    if (!message) {
      if (field.validity.valueMissing) {
        message = 'This field is required.';
      } else if (field.type === 'email' && field.validity.typeMismatch) {
        message = 'Please enter a valid email.';
      } else {
        message = field.validationMessage;
      }
    }

    errorEl.textContent = message;
    errorEl.hidden = !message;
  }

  validateForm() {
    let isValid = true;
    this.fields.forEach(field => {
      this.validateField(field);
      if (!field.checkValidity()) {
        isValid = false;
      }
    });
    return isValid;
  }

  animateInvalidFields() {
    const invalidFields = this.form.querySelectorAll('.invalid');
    gsap.from(invalidFields, {
      x: -8,
      duration: 0.2,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1,
      stagger: 0.05
    });
  }

  handleSubmitSuccess() {
    // Show loader
    this.showLoader();

    // Fake async
    setTimeout(() => {
      this.hideLoader();
      this.animateFormOut();
    }, 3000);
  }

  showLoader() {
    this.submitBtn.disabled = true;
    if (this.btnText) this.btnText.style.display = 'none';
    if (this.btnLoader) this.btnLoader.hidden = false;
  }

  hideLoader() {
    this.submitBtn.disabled = false;
    if (this.btnText) this.btnText.style.display = 'inline-block';
    if (this.btnLoader) this.btnLoader.hidden = true;
  }

  animateFormOut() {
    const elements = this.form.querySelectorAll('.form-field, .screen--mission__submit');
    gsap.to(elements, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      stagger: 0.1,
      onComplete: () => {
        this.showSuccessMessage();
        this.clearFields();
      }
    });
  }

  showSuccessMessage() {
    this.form.innerHTML = `
      <div class="form-success">
        <svg class="checkMark" viewBox="0 0 52 52">
          <circle class="checkMark--circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkMark--check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
        <h3>Thank you for joining!</h3>
        <p>We'll be in touch soon...</p>
      </div>
    `;

    const successEl = this.form.querySelector('.form-success');
    const checkMark = successEl.querySelector('.checkMark');

    gsap.set(successEl, { opacity: 0, y: 20 });
    gsap.set(checkMark, { scale: 0 });

    gsap.timeline()
      .to(successEl, { opacity: 1, y: 0, duration: 0.5 })
      .to(checkMark, { scale: 1, duration: 0.5, ease: 'back.out' }, '-=0.3');
  }

  clearFields() {
    this.fields.forEach(field => {
      field.value = '';
      field.classList.remove('valid', 'invalid');
      field.setAttribute('aria-invalid', 'false');
    });
  }
}
