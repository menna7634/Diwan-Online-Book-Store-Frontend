import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { CartService } from '../../core/services/cart.service';
import { Book } from '../../core/types/book';
import { ReviewFormComponent } from './book-details/review-form/review-form';
import { ReviewListComponent } from './book-details/review-list/review-list';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ReviewFormComponent, ReviewListComponent],
  templateUrl: './book-detail.page.html',
})
export class BookDetailPage implements OnInit {
  private bookService = inject(BookService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  book: Book | null = null;
  isLoading = false;
  errorMessage = '';
  addToCartPending = false;
  addToCartError = '';

  ngOnInit(): void {
    // read the id from url
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.errorMessage = 'Book not found.';
      return;
    }

    this.loadBook(id);
  }

  private loadBook(id: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBook(id).subscribe({
      next: (book) => {
        this.book = book;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load book.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  addToCart(): void {
    if (!this.book) return;
    this.addToCartPending = true;
    this.addToCartError = '';

    this.cartService.addToCart(this.book._id, 1, this.book.price).subscribe({
      next: () => {
        this.addToCartPending = false;
        this.cdr.detectChanges();
        this.router.navigate(['/cart']);
      },
      error: () => {
        this.addToCartError = 'Could not add to cart.';
        this.addToCartPending = false;
        this.cdr.detectChanges();
      },
    });
  }
}
