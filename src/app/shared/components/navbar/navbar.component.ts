// navbar.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;
  userInitial = '';
  dropdownOpen = false;
  mobileOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    //  هتجيب البيانات دي من AuthService
    // مثال:
    // this.isLoggedIn = this.authService.isLoggedIn();
    // this.isAdmin = this.authService.isAdmin();
    // this.userInitial = this.authService.getUserInitial();
  }

  onSearch(event: any): void {
    const query = event.target.value;
    if (query.trim()) {
      this.router.navigate(['/books'], { queryParams: { search: query } });
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobile(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  logout(): void {
    // this.authService.logout();
    this.isLoggedIn = false;
    this.dropdownOpen = false;
    this.mobileOpen = false;
    this.router.navigate(['/auth/login']);
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.dropdownOpen = false;
    }
  }
}
