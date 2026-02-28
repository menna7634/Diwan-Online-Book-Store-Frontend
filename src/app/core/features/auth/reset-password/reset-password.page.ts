import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { finalize, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.page.html',
})
export class ResetPasswordPage {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  token = toSignal(this.route.queryParamMap.pipe(map(params => params.get('token'))));
  resetPasswordForm = this.fb.group({
    'password': [
      '',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
      ],
    ],
    'password_confirm': ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

  pending = signal(false);
  showPassword = false;
  showPasswordConfirm = false;

  private serverErrorMessages: { [key: string]: string } = {};

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    const password = this.resetPasswordForm.get('password')?.value || ''
    this.authService
      .resetPassword(password, this.token() || '')
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: (user) => {
          this.router.navigateByUrl('/login');
        },
        error: (error) => {
          if (error.error.details) {
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

      this.resetPasswordForm.get(key)?.setErrors({ [`${key}ServerError`]: true });
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
