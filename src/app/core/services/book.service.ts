import { inject, Injectable } from '@angular/core'; //inject: modern Angular way to get dependencies
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Book, BooksListResponse, BooksQueryParams } from '../types/book';
import { Observable } from 'rxjs';

//Injectable: tells Angular this class is a service
@Injectable({ providedIn: 'root' }) //Angular creates one shared instance for the whole app
export class BookService {
  private http = inject(HttpClient); //access to http tools
  private baseUrl = environment.apiUrl;

  getBooks(params?: BooksQueryParams): Observable<BooksListResponse> {
    //observble is a container for future result because data is not ready yet, it takes ms to get fetched
    let httpParams = new HttpParams();

    //if search = "happy" query string becomes ?search=happy
    //HttpParams is immutable, so .set() returns a new object, that is why we re-assign so it saves
    if (params?.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params?.page) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params?.limit) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }
    if (params?.authorIds) {
      httpParams = httpParams.set('authorIds', params.authorIds);
    }
    if (params?.categoryIds) {
      httpParams = httpParams.set('categoryIds', params.categoryIds);
    }
    if (params?.minPrice !== undefined) {
      httpParams = httpParams.set('minPrice', params.minPrice.toString());
    }
    if (params?.maxPrice !== undefined) {
      httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
    }
    if (params?.sort) {
      httpParams = httpParams.set('sort', params.sort);
    }
    if (params?.order) {
      httpParams = httpParams.set('order', params.order);
    }

    // HttpClient has a get<t> function
    return this.http.get<BooksListResponse>(`${this.baseUrl}/books`, {
      params: httpParams,
    });
  }

  getBook(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.baseUrl}/books/${id}`);
  }

  createBook(formData: FormData): Observable<Book> {
    return this.http.post<Book>(`${this.baseUrl}/books`, formData);
  }

  updateBook(id: string, formData: FormData): Observable<Book> {
    return this.http.patch<Book>(`${this.baseUrl}/books/${id}`, formData);
  }

  deleteBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }
}
