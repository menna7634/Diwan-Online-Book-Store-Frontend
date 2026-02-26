import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import {
  Cart,
  CartItem,
  CartRaw,
  CartItemRaw,
  BookSummary,
  Order,
  PlaceOrderRequest,
} from '../types/cart.types';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly API = 'http://localhost:3000';

  private http = inject(HttpClient);

  // ── Reactive cart state ───────────────────────────────────────────────────
  private _cart = signal<Cart>({ items: [], totalItems: 0, subtotal: 0, shipping: 0, total: 0 });

  /** Read-only signal consumed by components */
  readonly cart = this._cart.asReadonly();
  readonly cartCount = computed(() => this._cart().totalItems);

  constructor() {
    this.loadCart();
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Flatten raw backend cart → frontend Cart */
  private mapCart(raw: CartRaw): Cart {
    const items: CartItem[] = raw.items.map((i) => {
      const isPopulated = typeof i.book_id === 'object';
      const book = isPopulated ? (i.book_id as BookSummary) : null;
      return {
        id: i._id,
        bookId: isPopulated ? (i.book_id as BookSummary)._id : (i.book_id as string),
        title: book?.book_title ?? 'Unknown Title',
        imageUrl: book?.book_cover_url ?? '',
        price: i.price,
        quantity: i.quantity,
      };
    });
    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal === 0 ? 0 : subtotal >= 50 ? 0 : 5.99;
    return {
      items,
      totalItems: items.reduce((s, i) => s + i.quantity, 0),
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }

  // ── GET /api/cart ─────────────────────────────────────────────────────────
  loadCart(): void {
    this.http
      .get<{ status: string; data: { items: CartItemRaw[]; total: number } }>(`${this.API}/cart`)
      .pipe(
        map((res) =>
          this.mapCart({ _id: '', user_id: '', items: res.data.items, total: res.data.total }),
        ),
        catchError(() => of(this._cart())),
      )
      .subscribe((cart) => this._cart.set(cart));
  }

  // ── POST /api/cart/items   body: { bookId, quantity, price } ──────────────
  addToCart(bookId: string, quantity: number, price: number): Observable<Cart> {
    return this.http
      .post<{
        status: string;
        data: { cart: CartRaw };
      }>(`${this.API}/cart/items`, { bookId, quantity, price })
      .pipe(
        map((res) => this.mapCart(res.data.cart)),
        tap((cart) => this._cart.set(cart)),
      );
  }

  // ── PATCH /api/cart/items/:bookId   body: { quantity } ────────────────────
  setQuantity(bookId: string, quantity: number): Observable<Cart> {
    return this.http
      .patch<{
        status: string;
        data: { cart: CartRaw };
      }>(`${this.API}/cart/items/${bookId}`, { quantity })
      .pipe(
        map((res) => this.mapCart(res.data.cart)),
        tap((cart) => this._cart.set(cart)),
      );
  }

  // ── PATCH /api/cart/items/:bookId/increase   body: { step? } ─────────────
  increaseQuantity(bookId: string, step = 1): Observable<Cart> {
    return this.http
      .patch<{
        status: string;
        data: { cart: CartRaw };
      }>(`${this.API}/cart/items/${bookId}/increase`, { step })
      .pipe(
        map((res) => this.mapCart(res.data.cart)),
        tap((cart) => this._cart.set(cart)),
      );
  }

  // ── PATCH /api/cart/items/:bookId/decrease   body: { step? } ─────────────
  decreaseQuantity(bookId: string, step = 1): Observable<Cart> {
    return this.http
      .patch<{
        status: string;
        data: { cart: CartRaw };
      }>(`${this.API}/cart/items/${bookId}/decrease`, { step })
      .pipe(
        map((res) => this.mapCart(res.data.cart)),
        tap((cart) => this._cart.set(cart)),
      );
  }

  // ── DELETE /api/cart/items/:bookId ────────────────────────────────────────
  removeItem(bookId: string): Observable<Cart> {
    return this.http
      .delete<{ status: string; data: { cart: CartRaw } }>(`${this.API}/cart/items/${bookId}`)
      .pipe(
        map((res) => this.mapCart(res.data.cart)),
        tap((cart) => this._cart.set(cart)),
      );
  }

  // ── DELETE /api/cart ──────────────────────────────────────────────────────
  clearCart(): Observable<Cart> {
    return this.http.delete<{ status: string; data: { cart: CartRaw } }>(`${this.API}/cart`).pipe(
      map((res) => this.mapCart(res.data.cart)),
      tap((cart) => this._cart.set(cart)),
    );
  }

  // ── POST /api/order   body: PlaceOrderRequest ────────────────────────────
  placeOrder(body: PlaceOrderRequest): Observable<Order> {
    return this.http
      .post<{ status: string; data: { order: Order } }>(`${this.API}/order`, body)
      .pipe(map((res) => res.data.order));
  }

  // ── GET /api/order/my ────────────────────────────────────────────────────
  getMyOrders(
    page = 1,
    limit = 10,
  ): Observable<{ data: Order[]; totalPages: number; currentPage: number }> {
    return this.http.get<any>(`${this.API}/order/my`, { params: { page, limit } }).pipe(
      map((res) => ({
        data: res.data as Order[],
        totalPages: res.totalPages ?? 1,
        currentPage: res.currentPage ?? 1,
      })),
    );
  }

  // ── GET /api/order/:orderId ──────────────────────────────────────────────
  getOrderById(orderId: string): Observable<Order> {
    return this.http
      .get<{ status: string; data: { order: Order } }>(`${this.API}/order/${orderId}`)
      .pipe(map((res) => res.data.order));
  }
}
