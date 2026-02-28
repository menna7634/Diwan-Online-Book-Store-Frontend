import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { CategoryService, Category } from '../../../services/category.service';
import { AuthorService } from '../../../services/author.service';
import { Book } from '../../../types/book';
import { Author } from '../../../types/author';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.page.html',
})
export class BooksPage implements OnInit {
  books: Book[] = [];
  authors: Author[] = [];
  categories: Category[] = [];

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  currentPage = 1;
  totalPages = 1;

  searchText = '';

  showForm = false;
  isEditing = false;
  editingBookId = '';

  bookTitle = '';
  bookDescription = '';
  bookPrice = '';
  bookStock = '';
  bookAuthorId = '';
  bookCategories: string[] = [];
  bookCoverFile: File | null = null;
  imagePreview: string | null = null;

  filterAuthorId = '';
  filterCategoryId = '';
  showDeleteModal = false;
  deletingBookId = '';

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadBooks();
    this.loadAuthors();
    this.loadCategories();
  }

  loadBooks(page: number = 1) {
    this.isLoading = true;
    this.errorMessage = '';

    const params: any = { page, limit: 10 };
    if (this.searchText.trim()) {
      params.search = this.searchText.trim();
    }
    if (this.filterAuthorId) {
      params.authorIds = this.filterAuthorId;
    }
    if (this.filterCategoryId) {
      params.categoryIds = this.filterCategoryId;
    }

    this.bookService.getBooks(params).subscribe({
      next: (res) => {
        this.books = res.data;
        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Could not load books. Please try again.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch() {
    this.loadBooks(1);
  }

  resetFilters() {
    this.searchText = '';
    this.filterAuthorId = '';
    this.filterCategoryId = '';
    this.loadBooks(1);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.loadBooks(page);
    }
  }

  loadAuthors() {
    this.authorService.getAuthors({ limit: 100 }).subscribe({
      next: (res) => {
        this.authors = res.data;
        this.cdr.detectChanges();
      },
    });
  }

  loadCategories() {
    this.categoryService.getCategories(1, 100).subscribe({
      next: (res) => {
        this.categories = Array.isArray(res.data) ? res.data : [res.data];
        this.cdr.detectChanges();
      },
    });
  }

  getAuthorName(authorId: string): string {
    const author = this.authors.find((a) => a._id === authorId);
    return author ? author.name : 'Unknown';
  }
  getCategoryNames(ids: string[]): string {
    if (!ids || ids.length === 0) return 'None';
    const names = ids.map((id) => {
      const cat = this.categories.find((c) => c._id === id);
      return cat ? cat.name : '';
    });
    return names.filter((n) => n).join(', ');
  }

  openCreateForm() {
    this.isEditing = false;
    this.editingBookId = '';
    this.bookTitle = '';
    this.bookDescription = '';
    this.bookPrice = '';
    this.bookStock = '';
    this.bookAuthorId = '';
    this.bookCategories = [];
    this.bookCoverFile = null;
    this.imagePreview = null;
    this.errorMessage = '';
    this.showForm = true;
  }

  openEditForm(book: Book) {
    this.isEditing = true;
    this.editingBookId = book._id;
    this.bookTitle = book.book_title;
    this.bookDescription = book.description || '';
    this.bookPrice = book.price.toString();
    this.bookStock = book.stock.toString();
    this.bookAuthorId = book.author_id;
    this.bookCategories = [...book.categories];
    this.bookCoverFile = null;
    this.imagePreview = book.book_cover_url || null;
    this.errorMessage = '';
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  toggleCategory(id: string) {
    const index = this.bookCategories.indexOf(id);
    if (index === -1) {
      this.bookCategories.push(id);
    } else {
      this.bookCategories.splice(index, 1);
    }
  }

  isCategorySelected(id: string): boolean {
    return this.bookCategories.includes(id);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.bookCoverFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(this.bookCoverFile);
    }
  }

  saveBook() {
    if (!this.bookTitle.trim()) {
      this.errorMessage = 'Please enter a book title.';
      return;
    }
    if (!this.bookAuthorId) {
      this.errorMessage = 'Please select an author.';
      return;
    }
    if (this.bookCategories.length === 0) {
      this.errorMessage = 'Please select at least one category.';
      return;
    }
    if (!this.bookPrice || Number(this.bookPrice) <= 0) {
      this.errorMessage = 'Please enter a valid price.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('book_title', this.bookTitle.trim());
    formData.append('description', this.bookDescription.trim());
    formData.append('price', this.bookPrice);
    formData.append('stock', this.bookStock || '0');
    formData.append('author_id', this.bookAuthorId);
    formData.append('categories', JSON.stringify(this.bookCategories));
    if (this.bookCoverFile) {
      formData.append('cover', this.bookCoverFile);
    }

    if (this.isEditing) {
      this.bookService.updateBook(this.editingBookId, formData).subscribe({
        next: () => {
          this.successMessage = 'Book updated!';
          this.isLoading = false;
          this.closeForm();
          this.loadBooks(this.currentPage);
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to update book.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.bookService.createBook(formData).subscribe({
        next: () => {
          this.successMessage = 'Book created!';
          this.isLoading = false;
          this.closeForm();
          this.loadBooks(1);
          this.cdr.detectChanges();
          setTimeout(() => {
            this.successMessage = '';
            this.cdr.detectChanges();
          }, 3000);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Failed to create book.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  openDeleteModal(id: string) {
    this.deletingBookId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.isLoading = true;
    this.showDeleteModal = false;

    this.bookService.deleteBook(this.deletingBookId).subscribe({
      next: () => {
        this.successMessage = 'Book deleted.';
        this.isLoading = false;
        this.loadBooks(this.currentPage);
        this.cdr.detectChanges();
        setTimeout(() => {
          this.successMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete book.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  cancelDelete() {
    this.showDeleteModal = false;
    this.deletingBookId = '';
  }
}
