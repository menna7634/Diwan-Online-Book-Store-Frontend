export interface BookSummary {
  _id: string;
  book_title: string;
  book_cover_url?: string;
}

export interface CartItemRaw {
  _id: string;
  book_id: string | BookSummary;
  quantity: number;
  price: number;
}

export interface CartRaw {
  _id: string;
  user_id: string;
  items: CartItemRaw[];
  total: number;
}

export interface CartItem {
  id: string; // CartItemRaw._id
  bookId: string; // book_id string
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  shipping: number;
  total: number;
}

// Shipping / Order

export interface ShippingDetails {
  fullName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
}

/** Body sent to POST /api/orders */
export interface PlaceOrderRequest {
  payment_method: 'cash_on_delivery' | 'card';
  shipping_details: ShippingDetails;
}

export interface OrderBook {
  book_id: string | BookSummary;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'cash_on_delivery' | 'card';

export interface Order {
  _id: string;
  user_id: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  shipping_details: ShippingDetails;
  books: OrderBook[];
  order_history: { status: string; note?: string; createdAt?: string }[];
  createdAt: string;
  updatedAt: string;
}
