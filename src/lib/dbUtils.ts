import { query } from './db';
import { Product } from '@/types/product';
import { User } from '@/types/user';
import { Order } from '@/types/order';

// Product utilities
export async function getAllProducts(): Promise<Product[]> {
  try {
    return await query('SELECT * FROM products');
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const products = await query('SELECT * FROM products WHERE id = ?', [id]);
    return products.length > 0 ? products[0] : null;
  } catch (error) {
    console.error(`Error getting product with ID ${id}:`, error);
    return null;
  }
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<string | null> {
  try {
    const id = `prod_${Date.now()}`;
    await query(
      `INSERT INTO products 
       (id, name, description, price, category, subcategory, imageUrl, brand, inStock, rating, numReviews, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        product.name,
        product.description || '',
        product.price || 0,
        product.category || '',
        product.subcategory || '',
        product.imageUrl || '',
        product.brand || '',
        product.inStock !== undefined ? product.inStock : true,
        product.rating || 0,
        product.numReviews || 0,
        product.featured || false
      ]
    );
    return id;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<boolean> {
  try {
    // Only update fields that are provided
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(product).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    // Add the ID to the values array for the WHERE clause
    values.push(id);
    
    if (updates.length === 0) {
      return true; // Nothing to update
    }
    
    await query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    return true;
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    return false;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    await query('DELETE FROM products WHERE id = ?', [id]);
    return true;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    return false;
  }
}

// User utilities
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await query('SELECT * FROM users WHERE email = ?', [email]);
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error(`Error getting user with email ${email}:`, error);
    return null;
  }
}

export async function createUser(user: Omit<User, 'id'>): Promise<string | null> {
  try {
    const id = `user_${Date.now()}`;
    await query(
      `INSERT INTO users 
       (id, firstName, lastName, email, password, role, address, phone) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.role || 'customer',
        user.address || '',
        user.phone || ''
      ]
    );
    return id;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

// Order utilities
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const orders = await query('SELECT * FROM orders WHERE userId = ?', [userId]);
    
    // For each order, get the order items
    for (const order of orders) {
      const orderItems = await query(
        'SELECT * FROM order_items WHERE orderId = ?',
        [order.id]
      );
      order.items = orderItems;
    }
    
    return orders;
  } catch (error) {
    console.error(`Error getting orders for user ${userId}:`, error);
    return [];
  }
}

export async function createOrder(order: Omit<Order, 'id'>): Promise<string | null> {
  try {
    const id = `order_${Date.now()}`;
    
    // Insert order
    await query(
      `INSERT INTO orders 
       (id, userId, status, total, shippingAddress, paymentMethod) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        order.userId,
        order.status || 'pending',
        order.total,
        order.shippingAddress,
        order.paymentMethod
      ]
    );
    
    // Insert order items
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        const itemId = `item_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
        await query(
          `INSERT INTO order_items 
           (id, orderId, productId, quantity, price) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            itemId,
            id,
            item.productId,
            item.quantity,
            item.price
          ]
        );
      }
    }
    
    return id;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
} 