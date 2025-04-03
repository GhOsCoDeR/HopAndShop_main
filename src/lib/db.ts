import { hashPassword } from './auth'
import mysql from 'mysql2/promise';

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  createdAt: number
}

// Mock user database with localStorage persistence
const STORAGE_KEY = 'mock_users_db'

const getUsers = (): User[] => {
  if (typeof window === 'undefined') {
    // Server-side: return empty array
    return []
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      // Log retrieved users for debugging
      console.log('Retrieved users from localStorage:', stored)
      return JSON.parse(stored)
    }
    return []
  } catch (error) {
    console.error('Error reading users from storage:', error)
    return []
  }
}

const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') {
    // Server-side: do nothing
    return
  }
  try {
    // Log users being saved for debugging
    console.log('Saving users to localStorage:', JSON.stringify(users))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Error saving users to storage:', error)
  }
}

// Initialize the database with admin user if empty
const initializeDb = () => {
  if (typeof window === 'undefined') {
    return; // Server-side: do nothing
  }
  
  const users = getUsers();
  if (users.length === 0) {
    // Add admin user for convenience
    const adminUser: User = {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123', // In a real app, this would be hashed
      firstName: 'Admin',
      lastName: 'User',
      phone: '1234567890',
      createdAt: Date.now()
    };
    saveUsers([adminUser]);
  }
};

// Initialize DB on module load
if (typeof window !== 'undefined') {
  // Only run in browser environment
  initializeDb();
}

export const findUserByEmail = (email: string): User | undefined => {
  console.log('Looking for user with email:', email)
  const users = getUsers()
  console.log('Current users:', users.map(u => ({ ...u, password: '[REDACTED]' })))
  return users.find((user) => user.email === email)
}

export const createUser = async (userData: Omit<User, 'id' | 'password' | 'createdAt'> & { password: string }): Promise<User> => {
  try {
    console.log('Creating user with data:', { ...userData, password: '[REDACTED]' })
    
    // Check if email already exists
    const existingUser = findUserByEmail(userData.email)
    if (existingUser) {
      throw new Error('Email already in use')
    }
    
    const hashedPassword = await hashPassword(userData.password)
    const users = getUsers()
    const newUser: User = {
      id: String(Date.now()), // Use timestamp as ID for better uniqueness
      ...userData,
      password: hashedPassword,
      createdAt: Date.now()
    }
    users.push(newUser)
    saveUsers(users)
    console.log('User created successfully:', { ...newUser, password: '[REDACTED]' })
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser
    return newUser
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const findUserById = (id: string): User | undefined => {
  const users = getUsers()
  return users.find(user => user.id === id)
}

// Create a connection pool with error handling
let pool: mysql.Pool | null = null;

// Function to create or get MySQL connection pool
export function getPool() {
  if (pool) return pool;
  
  try {
    console.log('Creating MySQL connection pool with:', {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      database: process.env.DB_NAME || 'hopandshop',
      port: Number(process.env.DB_PORT || '3306')
    });
    
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hopandshop',
      port: Number(process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // Test connection by executing a simple query
    pool.execute('SELECT 1')
      .then(() => {
        console.log('MySQL connection established');
      })
      .catch((err) => {
        console.error('MySQL connection test failed:', err);
        pool = null;
      });
    
    console.log('MySQL connection pool created');
    return pool;
  } catch (error) {
    console.error('Error creating MySQL connection pool:', error);
    return null;
  }
}

// Helper function for executing queries with detailed error logging
export async function query(sql: string, params?: any[]): Promise<any> {
  const connectionPool = getPool();
  
  if (!connectionPool) {
    console.error('No MySQL connection pool available');
    return [];
  }
  
  try {
    console.log(`Executing SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
    if (params) console.log('With params:', params);
    
    const [results] = await connectionPool.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error('Database query error:', error.message);
    console.error('Error code:', error.code);
    console.error('SQL statement:', sql.substring(0, 100), sql.length > 100 ? '...' : '');
    console.error('Params:', params);
    throw error;
  }
}

// Initialize database tables if they don't exist
export async function initializeDatabase() {
  const connectionPool = getPool();
  
  if (!connectionPool) {
    console.error('Cannot initialize database: No MySQL connection pool available');
    return;
  }
  
  try {
    console.log('Starting database initialization...');
    
    // Create products table
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255),
        subcategory VARCHAR(255),
        imageUrl VARCHAR(255),
        brand VARCHAR(255),
        inStock BOOLEAN DEFAULT true,
        rating DECIMAL(3, 2) DEFAULT 0,
        numReviews INT DEFAULT 0,
        featured BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Products table initialized');

    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin') DEFAULT 'customer',
        address TEXT,
        phone VARCHAR(20),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table initialized');

    // Create orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        total DECIMAL(10, 2) NOT NULL,
        shippingAddress TEXT NOT NULL,
        paymentMethod VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);
    console.log('Orders table initialized');

    // Create order_items table
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id VARCHAR(255) PRIMARY KEY,
        orderId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);
    console.log('Order_items table initialized');

    // Create cart table
    await query(`
      CREATE TABLE IF NOT EXISTS cart (
        id VARCHAR(255) PRIMARY KEY,
        userId VARCHAR(255) NOT NULL,
        productId VARCHAR(255) NOT NULL,
        quantity INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);
    console.log('Cart table initialized');

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Error initializing database tables:', error);
    throw error;
  }
}

// Export database utilities for use in other modules
export default { getPool, query, initializeDatabase }; 