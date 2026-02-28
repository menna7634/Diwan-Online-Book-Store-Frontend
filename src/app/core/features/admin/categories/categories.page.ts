import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.page.html',
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  error = '';
  successMessage = '';

  currentPage = 1;
  totalPages = 1;
  totalItems = 0;
  itemsPerPage = 10;

  isEditing = false;
  currentCategoryId = '';
  categoryForm = {
    name: '',
  };

  showDeleteModal = false;
  categoryToDelete: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(page: number = 1): void {
    this.isLoading = true;
    this.error = '';

    this.categoryService.getCategories(page, this.itemsPerPage).subscribe({
      next: (res) => {
        this.categories = Array.isArray(res.data) ? res.data : [res.data];

        if (res.pagination) {
          this.currentPage = res.pagination.page;
          this.totalPages = res.pagination.totalPages;
          this.totalItems = res.pagination.total;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'can not load categories. Please try again.';
        this.isLoading = false;
        console.error('Error loading categories:', err);
        this.cdr.detectChanges();
      },
    });
  }

  saveCategory(): void {
    const trimName = this.categoryForm.name.trim();
    if (!trimName) {
      this.error = 'Category name is required';
      return;
    }
    if (trimName.length < 2) {
      this.error = 'Category name must be at least 2 characters';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';

    if (this.isEditing) {
      this.categoryService
        .updateCategory(this.currentCategoryId, this.categoryForm.name)
        .subscribe({
          next: (res) => {
            this.successMessage = 'Category updated successfully';
            this.resetForm();
            this.loadCategories(this.currentPage);
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.error = err.error?.details || err.error?.message || 'Failed to update category';
            this.isLoading = false;
            this.cdr.detectChanges();
          },
        });
    } else {
      this.categoryService.createCategory(this.categoryForm.name).subscribe({
        next: (res) => {
          this.successMessage = 'Category created successfully';
          this.resetForm();
          this.loadCategories(1);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.error?.details || err.error?.message || 'Failed to create category';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    }
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentCategoryId = category._id;
    this.categoryForm.name = category.name;
    this.error = '';
    this.successMessage = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteCategory(id: string): void {
    this.categoryToDelete = id;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    this.isLoading = true;
    this.error = '';
    this.successMessage = '';
    this.showDeleteModal = false;

    this.categoryService.deleteCategory(this.categoryToDelete).subscribe({
      next: () => {
        this.successMessage = 'Category deleted successfully';
        this.categoryToDelete = null;
        if (this.categories.length === 1 && this.currentPage > 1) {
          this.loadCategories(this.currentPage - 1);
        } else {
          this.loadCategories(this.currentPage);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'It might be in use.';
        this.isLoading = false;
        this.categoryToDelete = null;
        this.cdr.detectChanges();
      },
    });
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.currentCategoryId = '';
    this.categoryForm = { name: '' };
    setTimeout(() => {
      this.successMessage = '';
      this.error = '';
    }, 5000);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadCategories(page);
    }
  }
}
