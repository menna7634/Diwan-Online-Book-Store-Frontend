import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService } from '../../../../core/services/review';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ReviewFormComponent {
  @Input() bookId: string = '';
  @Output() reviewAdded = new EventEmitter<void>();

  selectedRating: number = 0;
  comment: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private reviewService: ReviewService) {}

  setRating(star: number): void {
    this.selectedRating = star;
  }

  submitReview(): void {
    if (this.selectedRating === 0) {
      this.errorMessage = 'Please select a rating';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.reviewService.addReview({
      book_id: this.bookId,
      rating: this.selectedRating,
      comment: this.comment
    }).subscribe({
      next: () => {
        this.successMessage = 'Review added successfully!';
        this.selectedRating = 0;
        this.comment = '';
        this.isLoading = false;
        this.reviewAdded.emit();
      },
      error: (err) => {
        this.errorMessage = err.error?.details || 'Failed to add review';
        this.isLoading = false;
      }
    });
  }
}