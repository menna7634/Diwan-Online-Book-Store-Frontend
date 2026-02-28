import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../services/author.service';
import { Author } from '../../../types/author';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authors.page.html',
})
export class AuthorsPage implements OnInit {
  private authorService = inject(AuthorService);
  private cdr = inject(ChangeDetectorRef);

  authors: Author[] = [];
  isLoading = false;
  error = '';
  successMessage = '';

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  isEditing = false;
  currentAuthorId = '';
  authorForm = {
    name: '',
    bio: '',
  };

  ngOnInit(): void {
    this.loadAuthors();
  }

  loadAuthors(page: number = 1): void {
    this.isLoading = true;
    this.error = '';

    this.authorService.getAuthors({ page, limit: this.itemsPerPage }).subscribe({
      next: (res) => {
        this.authors = res.data ?? [];
        this.currentPage = res.pagination.page;
        this.totalPages = res.pagination.totalPages;
        this.totalItems = res.pagination.total;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load authors.';
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  saveAuthor(): void {
    const trimName = this.authorForm.name.trim();
    if (!trimName) {
      this.error = 'Author name is required';
      return;
    }
    if (trimName.length < 2) {
      this.error = 'Author name must be at least 2 characters';
      return;
    }
    if (trimName.length > 200) {
      this.error = 'Author name must be at most 200 characters';
      return;
    }
    if (this.authorForm.bio.length > 2000) {
      this.error = 'Bio must be at most 2000 characters';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    const body = { name: trimName, bio: this.authorForm.bio.trim() || undefined };

    if (this.isEditing) {
      this.authorService.updateAuthor(this.currentAuthorId, body).subscribe({
        next: () => {
          this.successMessage = 'Author updated successfully';
          this.resetForm();
          this.loadAuthors(this.currentPage);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to update author.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    } else {
      this.authorService.createAuthor(body).subscribe({
        next: () => {
          this.successMessage = 'Author created successfully';
          this.resetForm();
          this.loadAuthors(1); // admin sees new author 
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err?.error?.message || 'Failed to create author.';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  // called whenuser clicks the edit button in the table
  editAuthor(author: Author): void {
    this.isEditing = true; //swicth to edit button so when saveAuthor() is called we know this is edit
    this.currentAuthorId = author._id; // remember author id 
    this.authorForm.name = author.name;
    this.authorForm.bio = author.bio ?? '';
    this.error = '';
    this.successMessage = '';
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentAuthorId = '';
    this.authorForm = { name: '', bio: '' };
    //clear message after 5 sec
    setTimeout(() => {
      this.successMessage = '';
      this.error = '';
    }, 5000);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAuthors(page);
    }
  }

}
