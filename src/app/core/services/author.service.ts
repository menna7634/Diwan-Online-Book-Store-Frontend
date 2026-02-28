import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthorsListResponse } from '../types/author';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getAuthors(params?: { page?: number; limit?: number }): Observable<AuthorsListResponse> {
    let httpParams = new HttpParams();
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    return this.http.get<AuthorsListResponse>(`${this.baseUrl}/authors`, {
      params: httpParams,
    });
  }
}
