import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookService } from '../../core/services/book.service';
import { AuthorService } from '../../core/services/author.service';
import { Book } from '../../core/types/book';
import { Author } from '../../core/types/author';

@Component({
  selector: 'app-home',
  imports: [RouterModule, CommonModule],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private bookService = inject(BookService);
  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);

  popularBooks: Book[] = [];
  isLoadingPopular = false;
  popularError = '';

  popularAuthors: Author[] = [];
  isLoadingPopularAuthors = false;
  popularAuthorsError = '';

  // run this code when home page opens
  ngOnInit(): void {
    this.loadPopularBooks();
    this.loadPopularAuthors();
  }

  private loadPopularBooks(): void {
    this.isLoadingPopular = true;
    this.popularError = '';

    // HTTP is async, the data does not come instantly so we use .subscribe to handle success and error
    this.bookService.getBooks({ page: 1, limit: 4 }).subscribe({
      next: (response) => {
        this.popularBooks = response.data;
        this.isLoadingPopular = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.popularError = 'Failed to load popular books.';
        this.isLoadingPopular = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadPopularAuthors(): void {
    this.isLoadingPopularAuthors = true;
    this.popularAuthorsError = '';

    // HTTP is async, same as books: .subscribe for success and error
    this.authorService.getAuthors({ page: 1, limit: 4 }).subscribe({
      next: (response) => {
        this.popularAuthors = response.data;
        this.isLoadingPopularAuthors = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.popularAuthorsError = 'Failed to load popular authors.';
        this.isLoadingPopularAuthors = false;
        this.cdr.detectChanges();
      },
    });
  }
}

