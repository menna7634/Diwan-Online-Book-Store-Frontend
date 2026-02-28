import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { ShippingDetails, PaymentMethod } from '../../core/types/cart.types';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private cartService = inject(CartService);

  cart = this.cartService.cart;

  currentStep = 1;
  steps = ['Shipping', 'Payment'];
  submitted = false;
  placing = false;
  orderPlaced = false;
  placedOrderId = '';

  selectedPayment: PaymentMethod = 'cash_on_delivery';

  paymentMethods: { id: PaymentMethod; label: string; desc: string; icon: string }[] = [
    { id: 'cash_on_delivery', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: '💵' },
    { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', icon: '💳' },
  ];

  shipping: ShippingDetails = {
    fullName: '',
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
  };

  isPhoneValid(): boolean {
    return /^(010|011|012)\d{8}$/.test(this.shipping.phone);
  }

  isZipValid(): boolean {
    return /^\d+$/.test(this.shipping.zipCode);
  }

  isAddressValid(): boolean {
    const { fullName, street, city, state, country, zipCode, phone } = this.shipping;
    return (
      !!(fullName && street && city && state && country && zipCode && phone) &&
      this.isPhoneValid() &&
      this.isZipValid()
    );
  }

  goToPayment() {
    this.submitted = true;
    if (!this.isAddressValid()) return;
    this.submitted = false;
    this.currentStep = 2;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  placeOrder() {
    this.placing = true;

    this.cartService
      .placeOrder({
        payment_method: this.selectedPayment,
        shipping_details: this.shipping,
      })
      .subscribe({
        next: (order) => {
          this.placing = false;
          this.placedOrderId = order._id;
          this.orderPlaced = true;
          // Cart is cleared on the backend after placing order
          // reload it
          this.cartService.loadCart();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        error: () => {
          this.placing = false;
          alert('Something went wrong. Please try again.');
        },
      });
  }
}
