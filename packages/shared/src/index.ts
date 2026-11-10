// Shared Zupit Data Models and Enums

export type UserRole = 'customer' | 'rider' | 'merchant' | 'admin';
export type ServiceType = 'food' | 'grocery' | 'bike_taxi';
export type PaymentMode = 'cod' | 'online';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';
export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'picked_up' | 'delivered' | 'cancelled';
export type RideStatus = 'requested' | 'accepted' | 'arrived' | 'ongoing' | 'completed' | 'cancelled';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Merchant {
  id: string;
  name: string;
  phone: string;
  addressText: string;
  latitude: number;
  longitude: number;
  serviceType: 'food' | 'grocery';
  isOpen: boolean;
  bannerUrl?: string;
  rating: number;
}

export interface MenuItem {
  id: string;
  merchantId: string;
  categoryId?: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  isVeg: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: number;
  customerId: string;
  merchantId: string;
  riderId?: string;
  serviceType: 'food' | 'grocery';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  deliveryAddressText: string;
  createdAt: string;
}

