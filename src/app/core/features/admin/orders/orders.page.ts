import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { finalize } from 'rxjs';

interface BookSummary {
  _id: string;
  book_title: string;
  book_cover_url?: string;
}

interface OrderBook {
  book_id: string | BookSummary;
  name: string;
  quantity: number;
  price: number;
}

interface ShippingDetails {
  fullName: string;
  phone?: string;
  street: string;
  city: string;
  state?: string;
  country: string;
  zipCode?: string;
}

interface Order {
  _id: string;
  user_id: { _id: string; firstname: string; lastname: string; email: string } | string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  shipping_details: ShippingDetails;
  books: OrderBook[];
  order_history: { status: string; note?: string; changedAt?: string }[];
  total_price: number;
  createdAt: string;
  updatedAt: string;
}

const STATUS_TRANSITIONS: Record<string, string[]> = {
  placed: ['processing'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

const PAYMENT_TRANSITIONS: Record<string, string[]> = {
  pending: ['paid', 'failed'],
  paid: ['refunded'],
  failed: [],
  refunded: [],
};

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.page.html',
})
export class OrdersPage implements OnInit {
  private http = inject(HttpClient);
  private API = environment.apiUrl;
  private cdr = inject(ChangeDetectorRef);
  orders: Order[] = [];
  loading = true;
  currentPage = 1;
  totalPages = 1;
  total = 0;
  readonly limit = 10;

  // Filters
  filterOrderStatus = '';
  filterPaymentStatus = '';
  filterDateFrom = '';
  filterDateTo = '';

  readonly orderStatuses = ['placed', 'processing', 'shipped', 'delivered', 'cancelled'];
  readonly paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

  // Update modal
  showModal = false;
  selectedOrder: Order | null = null;
  newOrderStatus = '';
  newPaymentStatus = '';
  statusNote = '';
  updating = false;
  updateError = '';

  // Expand
  expandedOrder: string | null = null;

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(page = 1) {
    this.loading = true;

    const params: any = { page, limit: this.limit };
    if (this.filterOrderStatus) params.order_status = this.filterOrderStatus;
    if (this.filterPaymentStatus) params.payment_status = this.filterPaymentStatus;
    if (this.filterDateFrom) params.from = this.filterDateFrom;
    if (this.filterDateTo) params.to = this.filterDateTo;

    this.http
      .get<any>(`${this.API}/order`, {
        params,
        headers: { 'Cache-Control': 'no-cache' },
      })
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: (res) => {
          this.orders = res.data;
          this.total = res.pagination?.total ?? 0;
          this.totalPages = res.pagination?.totalPages ?? 1;
          this.currentPage = res.pagination?.page ?? 1;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  applyFilters() {
    this.loadOrders(1);
  }

  resetFilters() {
    this.filterOrderStatus = '';
    this.filterPaymentStatus = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.loadOrders(1);
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filterOrderStatus ||
      this.filterPaymentStatus ||
      this.filterDateFrom ||
      this.filterDateTo
    );
  }

  openUpdateModal(order: Order) {
    this.selectedOrder = order;
    this.newOrderStatus = '';
    this.newPaymentStatus = '';
    this.statusNote = '';
    this.updateError = '';
    this.showModal = true;
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.selectedOrder = null;
  }

  getAllowedOrderStatuses(): string[] {
    if (!this.selectedOrder) return [];
    return STATUS_TRANSITIONS[this.selectedOrder.order_status] ?? [];
  }

  getAllowedPaymentStatuses(): string[] {
    if (!this.selectedOrder) return [];
    return PAYMENT_TRANSITIONS[this.selectedOrder.payment_status] ?? [];
  }

  canSubmit(): boolean {
    return !!(this.newOrderStatus || this.newPaymentStatus);
  }

  submitUpdate() {
    if (!this.selectedOrder || !this.canSubmit()) return;
    this.updating = true;
    this.updateError = '';

    const body: any = {};
    if (this.newOrderStatus) body.order_status = this.newOrderStatus;
    if (this.newPaymentStatus) body.payment_status = this.newPaymentStatus;
    if (this.statusNote) body.note = this.statusNote;

    this.http.patch<any>(`${this.API}/order/${this.selectedOrder._id}`, body)
      .pipe(finalize(() => this.cdr.detectChanges()))
      .subscribe({
        next: (res) => {
          const idx = this.orders.findIndex((o) => o._id === this.selectedOrder!._id);
          if (idx !== -1) this.orders[idx] = res.data.order;
          this.updating = false;
          this.closeModal();
        },
        error: (err) => {
          this.updateError = err.error?.message ?? 'Failed to update order.';
          this.updating = false;
        },
      });
  }

  toggleExpand(id: string) {
    this.expandedOrder = this.expandedOrder === id ? null : id;
  }

  getUserName(order: Order): string {
    if (typeof order.user_id === 'object') {
      return `${order.user_id.firstname} ${order.user_id.lastname}`;
    }
    return 'Unknown User';
  }

  getUserEmail(order: Order): string {
    if (typeof order.user_id === 'object') return order.user_id.email;
    return '';
  }

  bookTitle(book: OrderBook): string {
    return typeof book.book_id === 'object' ? book.book_id.book_title : book.name;
  }

  bookCover(book: OrderBook): string {
    return typeof book.book_id === 'object' ? (book.book_id.book_cover_url ?? '') : '';
  }

  orderStatusClass(status: string): string {
    const map: Record<string, string> = {
      placed: 'bg-amber-100 text-amber-700 border border-amber-200',
      processing: 'bg-blue-100 text-blue-700 border border-blue-200',
      shipped: 'bg-purple-100 text-purple-700 border border-purple-200',
      delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      cancelled: 'bg-red-100 text-red-700 border border-red-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  paymentStatusClass(status: string): string {
    const map: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-700 border border-amber-200',
      paid: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      failed: 'bg-red-100 text-red-700 border border-red-200',
      refunded: 'bg-gray-100 text-gray-600 border border-gray-200',
    };
    return map[status] ?? 'bg-gray-100 text-gray-600';
  }

  paymentLabel(method: string): string {
    return method === 'cash_on_delivery' ? 'Cash on Delivery' : 'Card';
  }

  trackById(_: number, o: Order) {
    return o._id;
  }
}
