import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient) {}

  getReviews(bookId: string, page = 1, limit = 10): Observable<any> {
    const params = new HttpParams()
      .set('book_id', bookId)
      .set('page', page)
      .set('limit', limit);

    return this.http.get(this.apiUrl, { params });
  }

  addReview(data: { book_id: string; rating: number; comment?: string }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteReview(reviewId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${reviewId}`);
  }
}