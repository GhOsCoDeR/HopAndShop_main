import fs from 'fs';
import path from 'path';
import { User } from './db';

// Path to the data file - use absolute path to ensure consistency
const DATA_DIR = path.resolve(process.cwd(), 'public', 'data');
const DATA_FILE = path.resolve(DATA_DIR, 'users.json');

console.log('Server storage initialized with path:', DATA_FILE);

// Ensure the data directory exists
const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    console.log('Creating data directory:', DATA_DIR);
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

// Get users from the file
export const getServerUsers = (): User[] => {
  try {
    ensureDataDir();
    
    if (!fs.existsSync(DATA_FILE)) {
      console.log('Users file not found, creating with admin user');
      // Initialize with admin user
      const adminUser: User = {
        id: '1',
        email: 'admin@example.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        phone: '1234567890',
        createdAt: Date.now()
      };
      
      fs.writeFileSync(DATA_FILE, JSON.stringify([adminUser], null, 2));
      return [adminUser];
    }
    
    console.log('Reading users from file:', DATA_FILE);
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const users = JSON.parse(data);
    console.log(`Found ${users.length} users in storage file`);
    return users;
  } catch (error) {
    console.error('Error reading server users:', error);
    return [];
  }
};

// Save users to the file
export const saveServerUsers = (users: User[]): void => {
  try {
    ensureDataDir();
    console.log(`Saving ${users.length} users to file:`, DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
    console.log('Users saved successfully');
  } catch (error) {
    console.error('Error saving server users:', error);
  }
};

// Find a user by email
export const findServerUserByEmail = (email: string): User | undefined => {
  const users = getServerUsers();
  console.log(`Looking for user with email: ${email} among ${users.length} users`);
  const user = users.find(user => user.email === email);
  if (user) {
    console.log('User found:', user.email);
  } else {
    console.log('User not found with email:', email);
  }
  return user;
};

// Create a new user
export const createServerUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
  const users = getServerUsers();
  
  console.log('Creating user with data:', { 
    ...userData, 
    password: userData.password ? '[REDACTED]' : undefined 
  });
  
  // Check if email already exists
  const existingUser = users.find(user => user.email === userData.email);
  if (existingUser) {
    console.log('Email already exists:', userData.email);
    throw new Error('Email already in use');
  }
  
  const newUser: User = {
    id: String(Date.now()),
    ...userData,
    createdAt: Date.now()
  };
  
  users.push(newUser);
  saveServerUsers(users);
  
  console.log('User created successfully:', {
    ...newUser,
    password: '[REDACTED]'
  });
  
  return newUser;
};

// Find a user by ID
export const findServerUserById = (id: string): User | undefined => {
  const users = getServerUsers();
  console.log(`Looking for user with ID: ${id} among ${users.length} users`);
  const user = users.find(user => user.id === id);
  if (user) {
    console.log('User found by ID:', user.email);
  } else {
    console.log('User not found with ID:', id);
  }
  return user;
}; 