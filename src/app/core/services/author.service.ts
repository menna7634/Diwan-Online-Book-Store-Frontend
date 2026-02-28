import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Author, AuthorsListResponse } from '../types/author';
import { Observable } from 'rxjs';

export interface CreateAuthorBody {
  name: string;
  bio?: string;
}

export interface UpdateAuthorBody {
  name?: string;
  bio?: string;
}

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

  createAuthor(body: CreateAuthorBody): Observable<Author> {
    return this.http.post<Author>(`${this.baseUrl}/authors`, body);
  }

  updateAuthor(id: string, body: UpdateAuthorBody): Observable<Author> {
    return this.http.patch<Author>(`${this.baseUrl}/authors/${id}`, body);
  }
}
