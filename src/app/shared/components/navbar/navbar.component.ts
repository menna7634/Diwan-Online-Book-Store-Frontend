// navbar.component.ts
import { Component, OnInit, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { map, shareReplay } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  private authService = inject(AuthService);

  isLoggedIn = this.authService.user$.pipe(map(user => !!user), shareReplay(1));
  isAdmin = this.authService.user$.pipe(map(user => user?.role == 'admin'), shareReplay(1));
  cartCount = 0;
  userInitial = this.authService.user$.pipe(map(user => user?.firstname.charAt(0).toUpperCase() || 'U'), shareReplay(1));
  dropdownOpen = false;
  mobileOpen = false;

  constructor(private router: Router) { }



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
    this.authService.logout().subscribe({
      next: () => {
        this.dropdownOpen = false;
        this.mobileOpen = false;
        this.router.navigate(['/auth/login']);
      }
    });

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
