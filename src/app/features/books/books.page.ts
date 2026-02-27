import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book, BooksListResponse, BooksPagination } from '../../core/types/book';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './books.page.html',
})
export class BooksPage implements OnInit {
  private bookService = inject(BookService);
  //read the current URL query params,like ?page=2
  private route = inject(ActivatedRoute); 
  //to change the URL when user clicks Next / Previous.
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  books: Book[] = [];
  pagination: BooksPagination | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    // .subscribe used to Listen for query param changes, so when user change page for example, the sub runs again so we run this block again
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const limit = Number(params.get('limit')) || 12;
      this.loadBooks(page, limit);
    });
  }

  private loadBooks(page: number, limit: number): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks({ page, limit }).subscribe({
      next: (response: BooksListResponse) => {
        this.books = response.data;
        this.pagination = response.pagination;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load books.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  goToPage(page: number): void {
    // if backend hasn't loaded yet, there is no pagination info, so don't paginate too early
    if (!this.pagination) return;
    // only allow valid page numbers (no page 0 and no page beyond last page)
    if (page < 1 || page > this.pagination.totalPages) return;

    // Navigate to /books and update the page query param, keeping any other existing params
    this.router.navigate(['/books'], {
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  nextPage(): void {
    if (this.pagination?.hasNextPage) {
      this.goToPage(this.pagination.page + 1);
    }
  }

  previousPage(): void {
    if (this.pagination?.hasPrevPage) {
      this.goToPage(this.pagination.page - 1);
    }
  }
}

