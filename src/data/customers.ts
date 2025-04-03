import { Customer } from '@/types/customer'

export const customers: Customer[] = [
  {
    id: 'CUST001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    createdAt: '2024-01-15',
    lastOrderDate: '2024-03-15',
    totalOrders: 3,
    totalSpent: 899.97
  },
  {
    id: 'CUST002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1 (555) 234-5678',
    address: {
      street: '456 Oak Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA'
    },
    createdAt: '2024-02-01',
    lastOrderDate: '2024-03-14',
    totalOrders: 2,
    totalSpent: 899.97
  },
  {
    id: 'CUST003',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    phone: '+1 (555) 345-6789',
    address: {
      street: '789 Pine Rd',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA'
    },
    createdAt: '2024-02-15',
    lastOrderDate: '2024-03-13',
    totalOrders: 1,
    totalSpent: 149.99
  },
  {
    id: 'CUST004',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1 (555) 456-7890',
    address: {
      street: '321 Elm St',
      city: 'Houston',
      state: 'TX',
      zipCode: '77001',
      country: 'USA'
    },
    createdAt: '2024-03-01',
    lastOrderDate: '2024-03-12',
    totalOrders: 1,
    totalSpent: 449.97
  },
  {
    id: 'CUST005',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1 (555) 567-8901',
    address: {
      street: '654 Maple Dr',
      city: 'Phoenix',
      state: 'AZ',
      zipCode: '85001',
      country: 'USA'
    },
    createdAt: '2024-03-10',
    lastOrderDate: '2024-03-11',
    totalOrders: 1,
    totalSpent: 899.95
  }
] 