import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { map, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-verify',
  imports: [RouterLink],
  templateUrl: './verify.page.html',
})
export class VerifyPage implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  status = signal<'pending' | 'success' | 'error'>('pending');
  errorMessage = signal('');
  ngOnInit(): void {
    this.route.queryParams.pipe(

      switchMap(params => {
        if (!params['token']) return throwError(() => new Error("No Token"));
        return this.authService.verify(params['token']);
      })
    ).subscribe({
      next: (value) => {
        this.status.set('success');
      },
      error: (err) => {
        this.status.set('error');
        this.errorMessage.set(err.error.message);
      }
    })
  }
}
