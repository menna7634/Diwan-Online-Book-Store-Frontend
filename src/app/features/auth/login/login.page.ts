import { Component, importProvidersFrom, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.page.html',
})
export class LoginPage implements OnInit{
  authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  returnUrl = '/';
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  })

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
  }
  errorMessage = "";

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm);
      const email = this.loginForm.value['email'] || "";
      const password = this.loginForm.value['password'] || "";
      this.authService.login(email, password).subscribe({
        next: (user) => {
          this.router.navigateByUrl(this.returnUrl);
        },
        error: (error) => {
          if (error.status === 401) {
            console.log("setting error")
            this.loginForm.get('email')?.setErrors({ serverError: 'Email or Password is wrong' });
            console.error(this.loginForm);

          }
        }
      });
    } else {
    }
  }


}
