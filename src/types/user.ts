export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  address?: string;
  phone?: string;
  createdAt?: string;
} 