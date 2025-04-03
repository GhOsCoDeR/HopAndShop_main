import { Customer, Order } from '@/types/customer';

// Define a User interface that matches the structure in users.json
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdAt: number;
  password: string; // Note: We won't display this, but need it for the interface
  isAdmin?: boolean; // Make this optional since it may only exist on some users
}

// Function to convert a User to a Customer
const userToCustomer = (user: User): Customer => {
  // Get order data for this user (if any)
  const orderData = getUserOrders(user.id);
  
  return {
    id: user.id,
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    phone: user.phone || '',
    address: '', // User data doesn't store address by default
    city: '',
    state: '',
    country: '',
    zipCode: '',
    totalOrders: orderData.orders.length,
    totalSpent: orderData.totalSpent,
    joinDate: new Date(user.createdAt).toISOString().split('T')[0],
    lastOrder: orderData.lastOrder || '',
    status: 'active', // Default status
    orders: orderData.orders
  };
};

// Helper function to get orders for a user
const getUserOrders = (userId: string): { orders: Order[], totalSpent: number, lastOrder: string } => {
  if (typeof window === 'undefined') {
    return { orders: [], totalSpent: 0, lastOrder: '' };
  }
  
  try {
    // Try to get orders from localStorage
    const ordersString = localStorage.getItem('user_orders');
    const ordersData = ordersString ? JSON.parse(ordersString) : {};
    
    // Get orders for this specific user
    const userOrders: Order[] = ordersData[userId] || [];
    
    // Calculate total spent
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
    
    // Get last order date
    const lastOrder = userOrders.length > 0 
      ? userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : '';
    
    return { orders: userOrders, totalSpent, lastOrder };
  } catch (error) {
    console.error('Error getting user orders:', error);
    return { orders: [], totalSpent: 0, lastOrder: '' };
  }
};

// Fetch users from the server file
const fetchServerUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch('/data/users.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching server users:', error);
    return [];
  }
};

// In a real application, this would connect to your backend
class UserCustomerService {
  // Get all customers
  async getCustomers(): Promise<Customer[]> {
    try {
      const users = await fetchServerUsers();
      // Filter out admin users (since one has isAdmin: true flag)
      const regularUsers = users.filter(user => 
        user.firstName && 
        user.lastName && 
        !user.isAdmin && 
        user.id !== '1'  // Skip the default admin user
      );
      return regularUsers.map(userToCustomer);
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }

  // Get customer by ID
  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const users = await fetchServerUsers();
      const user = users.find(u => u.id === id);
      return user ? userToCustomer(user) : null;
    } catch (error) {
      console.error('Error getting customer by ID:', error);
      return null;
    }
  }

  // Get customer orders
  async getCustomerOrders(customerId: string): Promise<Order[]> {
    try {
      const { orders } = getUserOrders(customerId);
      return orders;
    } catch (error) {
      console.error('Error getting customer orders:', error);
      return [];
    }
  }

  // Search customers
  async searchCustomers(query: string): Promise<Customer[]> {
    try {
      const users = await fetchServerUsers();
      // Filter out admin users and search
      const filteredUsers = users.filter(user => 
        user.firstName && 
        user.lastName && 
        !user.isAdmin && 
        user.id !== '1' && // Skip the default admin user
        (
          user.firstName.toLowerCase().includes(query.toLowerCase()) ||
          user.lastName.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.phone?.includes(query) ||
          user.id.includes(query)
        )
      );
      
      return filteredUsers.map(userToCustomer);
    } catch (error) {
      console.error('Error searching customers:', error);
      return [];
    }
  }

  // Add a sample order for demonstration purposes
  async addSampleOrder(customerId: string): Promise<Order | null> {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      // Get existing orders data
      const ordersString = localStorage.getItem('user_orders');
      const ordersData = ordersString ? JSON.parse(ordersString) : {};
      
      // Get customer
      const customer = await this.getCustomerById(customerId);
      if (!customer) {
        return null;
      }
      
      // Create a sample order
      const newOrder: Order = {
        id: `ORD${Date.now()}`,
        customerId,
        date: new Date().toISOString().split('T')[0],
        status: 'delivered',
        items: [
          {
            id: `ITEM${Date.now()}`,
            productId: 'PROD001',
            productName: 'Sample Product',
            quantity: 1,
            price: 99.99,
            subtotal: 99.99
          }
        ],
        total: 99.99,
        paymentMethod: 'Credit Card',
        shippingAddress: customer.address || 'Sample Address',
      };
      
      // Add to user's orders
      const userOrders = ordersData[customerId] || [];
      userOrders.push(newOrder);
      ordersData[customerId] = userOrders;
      
      // Save back to localStorage
      localStorage.setItem('user_orders', JSON.stringify(ordersData));
      
      return newOrder;
    } catch (error) {
      console.error('Error adding sample order:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const userCustomerService = new UserCustomerService(); 