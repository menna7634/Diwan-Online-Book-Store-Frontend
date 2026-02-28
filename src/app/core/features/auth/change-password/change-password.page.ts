import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, single } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './change-password.page.html',
})
export class ChangePasswordPage {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  token = toSignal(this.route.queryParamMap.pipe(map(params => params.get('token'))));
  changePasswordForm = this.fb.group({
    "old_password": ['',
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
      ],
    ],
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
  showOldPassword = signal(false);
  showPasswordConfirm = false;

  private serverErrorMessages: { [key: string]: string } = {};


  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }
    this.pending.set(true);
    this.authService
      .updateUserProfile({
        password: this.changePasswordForm.get('password')?.value || '',
        oldPassword: this.changePasswordForm.get('old_password')?.value || '',
      })
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: (user) => {
          this.router.navigateByUrl('/profile');
        },
        error: (error) => {
          if(error.error.details === "old password is incorrect")
            this.populateFieldErrors([{context: {key: "old_password"}, message: "Old password is incorrect"}]);
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

      this.changePasswordForm.get(key)?.setErrors({ [`${key}ServerError`]: true });
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
