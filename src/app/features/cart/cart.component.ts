import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/types/cart.types';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
})
export class CartComponent {
  cartService = inject(CartService);
  cart = this.cartService.cart;

  loading = false;
  updatingBook: string | null = null;
  removingBook: string | null = null;

  readonly Math = Math;

  trackByBookId(_: number, item: CartItem) {
    return item.bookId;
  }

  increaseQty(item: CartItem) {
    this.updatingBook = item.bookId;
    this.cartService.increaseQuantity(item.bookId).subscribe({
      complete: () => (this.updatingBook = null),
      error: () => (this.updatingBook = null),
    });
  }

  decreaseQty(item: CartItem) {
    this.updatingBook = item.bookId;
    this.cartService.decreaseQuantity(item.bookId).subscribe({
      complete: () => (this.updatingBook = null),
      error: () => (this.updatingBook = null),
    });
  }

  removeItem(bookId: string) {
    this.removingBook = bookId;
    this.cartService.removeItem(bookId).subscribe({
      complete: () => (this.removingBook = null),
      error: () => (this.removingBook = null),
    });
  }

  clearCart() {
    if (confirm('Clear your entire cart?')) {
      this.cartService.clearCart().subscribe();
    }
  }
}
