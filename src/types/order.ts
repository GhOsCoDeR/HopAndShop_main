export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  name?: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt?: string;
} 