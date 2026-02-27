import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../../core/services/review';

@Component({
  selector: 'app-review-list',
  templateUrl: './review-list.html',
  standalone: true,
  imports: [CommonModule],
})
export class ReviewListComponent implements OnInit {
  @Input() bookId: string = '';

  reviews: any[] = [];
  avgRating: number = 0;
  totalReviews: number = 0;
  currentPage: number = 1;
  totalPages: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  loadReviews(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.reviewService.getReviews(this.bookId, this.currentPage).subscribe({
      next: (res) => {
        this.reviews = res.data.data;
        this.avgRating = res.data.avgRating;
        this.totalReviews = res.data.totalReviews;
        this.totalPages = res.data.pagination.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load reviews';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadReviews();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadReviews();
    }
  }

  onReviewDeleted(): void {
    this.loadReviews();
  }
}
