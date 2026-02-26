import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Order, OrderStatus, OrderBook } from '../../core/types/cart.types';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private cartService = inject(CartService);

  orders: Order[] = [];
  loading = true;
  expandedOrder: string | null = null;

  currentPage = 1;
  totalPages = 1;
  readonly limit = 10;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(page = 1) {
    this.loading = true;
    this.cartService.getMyOrders(page, this.limit).subscribe({
      next: ({ data, totalPages, currentPage }) => {
        this.orders = data;
        this.totalPages = totalPages;
        this.currentPage = currentPage;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleExpand(id: string) {
    this.expandedOrder = this.expandedOrder === id ? null : id;
  }

  trackById(_: number, o: Order) {
    return o._id;
  }

  /** Get cover URL from an OrderBook */
  bookCover(book: OrderBook): string {
    return typeof book.book_id === 'object' ? (book.book_id.book_cover_url ?? '') : '';
  }

  /** Get title from an OrderBook (populated or fallback to stored name) */
  bookTitle(book: OrderBook): string {
    return typeof book.book_id === 'object' ? book.book_id.book_title : book.name;
  }

  /** Calculate order total — must live in component, not template (no arrow fns in Angular expressions) */
  getOrderTotal(order: Order): string {
    return order.books.reduce((s, b) => s + b.price * b.quantity, 0).toFixed(2);
  }

  hasHistory(order: Order): boolean {
    return Array.isArray(order.order_history) && order.order_history.length > 0;
  }

  /** Tailwind classes per order_status */
  statusClass(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      placed: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100   text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100  text-green-700',
      cancelled: 'bg-red-100    text-red-700',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  paymentLabel(method: string): string {
    return method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card';
  }
}
