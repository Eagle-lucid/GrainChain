// src/js/components/form-validation.js
import gsap from 'gsap';

export class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (!this.form) return;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addCustomValidation();
    }

    setupEventListeners() {
        const inputs = this.form.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.validateField(input));
        });

        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
                this.animateInvalidFields();
            } else {
                this.animateSuccess();
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
        this.showErrorMessage(field, '');
    }

    markInvalid(field) {
        field.classList.remove('valid');
        field.classList.add('invalid');
        this.showErrorMessage(field);
    }

    showErrorMessage(field) {
        const parent = field.closest('.form-group');
        if (!parent) return;

        let errorElement = parent.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            parent.appendChild(errorElement);
        }

        if (field.validity.valueMissing) {
            errorElement.textContent = 'This field is required.';
        } else if (field.type === 'email' && field.validity.typeMismatch) {
            errorElement.textContent = 'Please enter a valid email address.';
        } else {
            errorElement.textContent = field.validationMessage;
        }
    }

    validateForm() {
        let isValid = true;
        const fields = this.form.querySelectorAll('input[required], textarea[required], select[required]');

        fields.forEach(field => {
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
            x: -10,
            duration: 0.3,
            ease: 'power1.out',
            stagger: 0.05,
            repeat: 2,
            yoyo: true
        });
    }

    animateSuccess() {
        const formElements = this.form.querySelectorAll('.form-group');
        gsap.to(formElements, {
            opacity: 0,
            y: -20,
            duration: 0.5,
            stagger: 0.1,
            onComplete: () => {
                this.form.innerHTML = `
                <div class="form-success">
                    <svg class="checkMark" viewBox="0 0 52 52">
                        <circle class="checkMark--circle" cx="26" cy="26" r="25" fill="none"/>
                        <path class="checkMark--check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                    <h3>Thank you for joining!</h3>
                    <p>We'll contact you shortly</p>
                </div>
                `;
                this.animateCheckMark();
            }
        });
    }

    animateCheckMark() {
        const successElement = this.form.querySelector('.form-success');
        const checkMark = successElement.querySelector('.checkMark');

        gsap.set(successElement, { opacity: 0, y: 20 });
        gsap.set(checkMark, { scale: 0 });

        gsap.timeline()
            .to(successElement, { opacity: 1, y: 0, duration: 0.5 })
            .to(checkMark, { scale: 1, duration: 0.5, ease: 'back.out' }, '-=0.3');
    }

    addCustomValidation() {
        // Custom email validation
        const emailField = this.form.querySelector('#email');
        if (emailField) {
            emailField.addEventListener('input', () => {
                emailField.setCustomValidity(
                    emailField.validity.typeMismatch ? 'Please enter a valid email address.' : ''
                );
            });
        }

        // Custom select validation
        const roleSelect = this.form.querySelector('#role');
        if (roleSelect) {
            roleSelect.addEventListener('change', () => {
                roleSelect.setCustomValidity(
                    roleSelect.value === '' ? 'Please select a role.' : ''
                );
            });
        }
    }
}
