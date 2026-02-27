import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { KeyValuePipe, AsyncPipe } from '@angular/common';
import { BehaviorSubject, finalize } from 'rxjs';
import { Router, RouterLink } from '@angular/router';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl) => {
  const password = control.get('password');
  const password_confirm = control.get('password_confirm');
  if (password?.value != password_confirm?.value) {
    password_confirm?.setErrors({ passwordMismatch: true });
    return { passwordMismatch: true };
  } else {
    password_confirm?.setErrors(null);
  }
  return null;
};
const noFutureDateValidator: ValidatorFn = (control: AbstractControl) => {
  const date = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0);
  if (control.value && date > today) {
    return { futureDate: true };
  }
  return null;
};
@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, KeyValuePipe, AsyncPipe, RouterLink],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  pending = new BehaviorSubject<boolean>(false);
  showPassword = false;
  showPasswordConfirm = false;

  private serverErrorMessages: { [key: string]: string } = {};

  registerForm = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
        ],
      ],
      password_confirm: ['', [Validators.required]],
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      dob: ['', [Validators.required, noFutureDateValidator]],
      address_street: ['', [Validators.required]],
      address_city: ['', [Validators.required]],
      address_state: ['', [Validators.required]],
      address_country: ['', [Validators.required]],
      address_zip_code: ['', [Validators.required]],
    },
    { validators: passwordMatchValidator },
  );

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.pending.next(true);
    this.authService
      .register({
        firstname: this.registerForm.get('firstname')?.value || '',
        lastname: this.registerForm.get('lastname')?.value || '',
        email: this.registerForm.get('email')?.value || '',
        password: this.registerForm.get('password')?.value || '',
        dob: new Date(this.registerForm.get('dob')?.value || ''),
        address: {
          street: this.registerForm.get('address_street')?.value || '',
          city: this.registerForm.get('address_city')?.value || '',
          state: this.registerForm.get('address_state')?.value || '',
          country: this.registerForm.get('address_country')?.value || '',
          zipCode: this.registerForm.get('address_zip_code')?.value || '',
        },
      })
      .pipe(finalize(() => this.pending.next(false)))
      .subscribe({
        next: (user) => {
          console.log(user);
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          if (error.error.details === 'Email already used')
            this.registerForm.get('email')?.setErrors({ emailUsed: true });
          else if (error.error.details) {
            this.populateFieldErrors(error.error.details);
          }
          console.error(error);
        },
      });
  }
  private populateFieldErrors(errors: any[]) {
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      const key = error.context.key;
      const message = error.message;

      this.registerForm.get(key)?.setErrors({ [`${key}ServerError`]: true });
      this.serverErrorMessages[`${key}ServerError`] = message;
    }
  }
  getErrorMessage(errorKey: string, errorValue: any): string {
    const messages: { [key: string]: string } = {
      required: 'This field is required.',
      email: 'Please enter a valid email address.',
      minlength: `Minimum length is ${errorValue?.requiredLength} characters.`,
      maxlength: `Maximum length is ${errorValue?.requiredLength} characters.`,
      futureDate: `can't have future date for date of birth.`,
      pattern: 'Password must contain a mix of letters, numbers, and special characters.',
      emailUsed: 'Email already in use',
    };

    return messages[errorKey] || this.serverErrorMessages[errorKey] || 'Invalid input.';
  }
}
