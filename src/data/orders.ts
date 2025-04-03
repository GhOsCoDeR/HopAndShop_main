import { Order } from '@/types/order'

export const orders: Order[] = [
  {
    id: 'ORD001',
    date: '2024-03-15',
    total: 299.99,
    status: 'delivered',
    customerId: 'CUST001',
    items: [
      {
        productId: 'PROD001',
        quantity: 1,
        price: 299.99
      }
    ]
  },
  {
    id: 'ORD002',
    date: '2024-03-14',
    total: 599.98,
    status: 'processing',
    customerId: 'CUST002',
    items: [
      {
        productId: 'PROD002',
        quantity: 2,
        price: 299.99
      }
    ]
  },
  {
    id: 'ORD003',
    date: '2024-03-13',
    total: 149.99,
    status: 'shipped',
    customerId: 'CUST003',
    items: [
      {
        productId: 'PROD003',
        quantity: 1,
        price: 149.99
      }
    ]
  },
  {
    id: 'ORD004',
    date: '2024-03-12',
    total: 449.97,
    status: 'pending',
    customerId: 'CUST004',
    items: [
      {
        productId: 'PROD001',
        quantity: 1,
        price: 299.99
      },
      {
        productId: 'PROD003',
        quantity: 1,
        price: 149.99
      }
    ]
  },
  {
    id: 'ORD005',
    date: '2024-03-11',
    total: 899.95,
    status: 'delivered',
    customerId: 'CUST005',
    items: [
      {
        productId: 'PROD002',
        quantity: 3,
        price: 299.99
      }
    ]
  }
] 