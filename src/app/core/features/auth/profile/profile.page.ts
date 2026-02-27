import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidatorFn, Validators, FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { UpdateProfileRequestBody } from '../../../types/auth';


const noFutureDateValidator: ValidatorFn = (control: AbstractControl) => {
  const date = new Date(control.value);
  const today = new Date();
  today.setHours(0, 0, 0);
  if (control.value && date > today) {
    return { futureDate: true }
  }
  return null;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.page.html',
})
export class ProfilePage {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  private serverErrorMessages: { [key: string]: string } = {};
  user = toSignal(this.authService.user$);
  pending = signal(false);
  editForm = this.fb.group({
    "firstname": [this.user()?.firstname, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    "lastname": [this.user()?.lastname, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    "dob": [this.user()?.dob, [Validators.required, noFutureDateValidator]],
    "address_street": [this.user()?.address.street, [Validators.required]],
    "address_city": [this.user()?.address.city, [Validators.required]],
    "address_state": [this.user()?.address.state, [Validators.required]],
    "address_country": [this.user()?.address.country, [Validators.required]],
    "address_zip_code": [this.user()?.address.zipCode, [Validators.required]],
  })

  editMode = signal(false);

  enableEditMode() {
    this.editMode.set(true);
  }
  saveProfile() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    if (this.editForm.dirty) {
      this.editMode.set(false);
      return;
    }

    const body: UpdateProfileRequestBody = {};
    if (this.editForm.get('firstname')?.dirty)
      body['firstname'] = this.editForm.get('firstname')?.value ?? undefined;
    if (this.editForm.get('lastname')?.dirty)
      body['lastname'] = this.editForm.get('lastname')?.value ?? undefined;

    const dobControl = this.editForm.get('dob');
    if (dobControl && dobControl.value)
      body['dob'] = (dobControl.value) ? new Date(dobControl.value) : undefined;

    if (this.editForm.get('address_street')?.dirty) {
      body.address = body.address || {};
      body.address.street = this.editForm.get('address_street')?.value ?? undefined;
    }
    if (this.editForm.get('address_city')?.dirty) {
      body.address = body.address || {};
      body.address.city = this.editForm.get('address_city')?.value ?? undefined;
    }

    if (this.editForm.get('address_state')?.dirty) {
      body.address = body.address || {};
      body.address.state = this.editForm.get('address_state')?.value ?? undefined;
    }

    if (this.editForm.get('address_country')?.dirty) {
      body.address = body.address || {};
      body.address.country = this.editForm.get('address_country')?.value ?? undefined;
    }
    if (this.editForm.get('address_zip_code')?.dirty) {
      body.address = body.address || {};
      body.address.zipCode = this.editForm.get('address_zip_code')?.value ?? undefined;
    }
    this.pending.set(true);
    this.authService.updateUserProfile(body)
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: (user) => {
          console.log(user);
        },
        error: (error) => {
          this.populateFieldErrors(error.error.details);
          console.error(error);
        }
      });
  }

  cancelEditMode() {
    this.editMode.set(false);
  }

  // utils
  private populateFieldErrors(errors: any[]) {
    for (let i = 0; i < errors.length; i++) {
      const error = errors[i];
      const key = error.context.key;
      const message = error.message;

      this.editForm.get(key)?.setErrors({ [`${key}ServerError`]: true })
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
