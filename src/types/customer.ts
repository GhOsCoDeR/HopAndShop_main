export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  totalOrders: number
  totalSpent: number
  joinDate: string
  lastOrder: string
  status: 'active' | 'inactive' | 'blocked'
  orders?: Order[]
  profilePicture?: string
  notes?: string
}

export interface Order {
  id: string
  customerId: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  items: OrderItem[]
  total: number
  paymentMethod: string
  shippingAddress: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  price: number
  subtotal: number
} 