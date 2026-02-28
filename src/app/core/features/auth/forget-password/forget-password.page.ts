import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-forget-password',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './forget-password.page.html',
})
export class ForgetPasswordPage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  status = signal('editing');
  pending = signal(false);
  errorMessage = signal('');

  forgetPasswordForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]]
  });

  onSubmit() {
    if (this.forgetPasswordForm.valid) {
      this.pending.set(true);
      this.authService.forgetPassword(this.forgetPasswordForm.get('email')?.value || '')
        .pipe(finalize(() => this.pending.set(false)))
        .subscribe({
          next: () => {
            this.status.set('sent');
          },
          error: (error) => {
            this.status.set('error');
            this.errorMessage.set(error.message);
          }
        });

    }
  }


}
