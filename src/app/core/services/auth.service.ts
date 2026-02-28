import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { User } from '../types/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { RegisterationRequestBody, UpdateProfileRequestBody } from '../types/auth';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private _user$ = new BehaviorSubject<User | null>(null);
  public user$ = this._user$.asObservable();

  register(userData: RegisterationRequestBody) {
    return this.http.post<User>(`${environment.apiUrl}/auth/register`, userData);
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, {
      email,
      password
    }).pipe(
      tap((tokens) => this.saveTokens(tokens)),
      switchMap(tokens => this.getUserProfile()),
      tap((user) => this._user$.next(user))
    );
  }
  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/profile`)
  }

  verify(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/auth/verify?token=${token}`);
  }
  updateUserProfile(data: UpdateProfileRequestBody): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/profile`, data).pipe(
      tap(user => this._user$.next(user)),
    );
  }
  forgetPassword(email:string) {
    return this.http.post(`${environment.apiUrl}/auth/forget-password`, {
      "email": email,
    });
  }
  resetPassword(newPassword: string, token: string) {
    return this.http.post(`${environment.apiUrl}/auth/reset-password`, {
      "password": newPassword,
      "token": token
    });
  }
  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, null).pipe(
      finalize(() => {
        this.clearTokens();
        this._user$.next(null);
      })
    );
  }

  hydrate(): Observable<User | null> {
    if (!this.getAccessToken())
      return of(null);
    return this.getUserProfile().pipe(
      tap(user => this._user$.next(user)),
      catchError(() => {
        this.clearTokens();
        return of(null);
      })
    )
  }

  refreshAccessToken(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/refresh`, {
      refresh_token: localStorage.getItem("refresh_token")
    }).pipe(
      tap((body: any) => localStorage.setItem("access_token", body.access_token)),
      catchError((error) => {
        this.clearTokens();
        this._user$.next(null);
        return throwError(() => error);
      })
    )
  }

  getAccessToken() {
    return localStorage.getItem("access_token");
  }


  private saveTokens(tokens: AuthResponse) {
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
  }

  private clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }

}
