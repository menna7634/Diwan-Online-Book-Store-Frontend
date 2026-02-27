import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../core/services/book.service';
import { Book, BooksListResponse, BooksPagination } from '../../core/types/book';

@Component({
  selector: 'app-books-page',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

  // simple filter state
  search = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sortOption: 'newest' | 'oldest' | 'priceLowHigh' | 'priceHighLow' = 'newest';

  ngOnInit(): void {
    // .subscribe used to Listen for query param changes, so when user change page for example, the sub runs again so we run this block again
    this.route.queryParamMap.subscribe((params) => {
      const page = Number(params.get('page')) || 1;
      const limit = Number(params.get('limit')) || 12;

      const search = params.get('search') || '';
      const minPriceParam = params.get('minPrice');
      const maxPriceParam = params.get('maxPrice');
      const sort = (params.get('sort') as 'price' | 'createdAt' | null) || null;
      const order = (params.get('order') as 'asc' | 'desc' | null) || null;

      this.search = search;
      this.minPrice = minPriceParam !== null ? Number(minPriceParam) : null;
      this.maxPrice = maxPriceParam !== null ? Number(maxPriceParam) : null;
      this.sortOption = this.mapSortOrderToOption(sort, order);

      this.loadBooks(page, limit, search, this.minPrice, this.maxPrice, sort, order);
    });
  }

  private loadBooks(
    page: number,
    limit: number,
    search?: string,
    minPrice?: number | null,
    maxPrice?: number | null,
    sort?: 'price' | 'createdAt' | null,
    order?: 'asc' | 'desc' | null,
  ): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.bookService.getBooks({
      page,
      limit,
      search: search || undefined,
      minPrice: minPrice ?? undefined,
      maxPrice: maxPrice ?? undefined,
      sort: sort || undefined,
      order: order || undefined,
    }).subscribe({
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

  applyFilters(): void {
    const { sort, order } = this.mapOptionToSortOrder(this.sortOption);

    this.router.navigate(['/books'], {
      queryParams: {
        page: 1,
        search: this.search || null,
        minPrice: this.minPrice ?? null,
        maxPrice: this.maxPrice ?? null,
        sort,
        order,
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters(): void {
    this.search = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.sortOption = 'newest';

    this.router.navigate(['/books'], {
      queryParams: {
        page: 1,
        search: null,
        minPrice: null,
        maxPrice: null,
        sort: null,
        order: null,
      },
      queryParamsHandling: 'merge',
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

  // for backend ----> ui
  private mapSortOrderToOption(sort: 'price' | 'createdAt' | null,order: 'asc' | 'desc' | null,): 'newest' | 'oldest' | 'priceLowHigh' | 'priceHighLow' {
    if (sort === 'price' && order === 'asc') return 'priceLowHigh';
    if (sort === 'price' && order === 'desc') return 'priceHighLow';
    if (sort === 'createdAt' && order === 'asc') return 'oldest';
    return 'newest';
  }

  // for ui ---> backend ( when user clicks apply)
  private mapOptionToSortOrder(option: 'newest' | 'oldest' | 'priceLowHigh' | 'priceHighLow'): {
    sort: 'price' | 'createdAt';
    order: 'asc' | 'desc';
  } {
    switch (option) {
      case 'oldest':
        return { sort: 'createdAt', order: 'asc' };
      case 'priceLowHigh':
        return { sort: 'price', order: 'asc' };
      case 'priceHighLow':
        return { sort: 'price', order: 'desc' };
      default:
        return { sort: 'createdAt', order: 'desc' };
    }
  }
}

