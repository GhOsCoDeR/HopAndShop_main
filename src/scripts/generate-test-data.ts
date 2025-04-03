import * as fs from 'fs';
import * as path from 'path';

// Define types
interface Product {
  name: string;
  price: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    imageUrl: string;
  }>;
}

type Categories = {
  [key: string]: Product[];
};

// Define product categories and their sample products
const categories: Categories = {
  electronics: [
    { name: 'Smartphone Pro X', price: 999.99, description: 'Latest smartphone with advanced features' },
    { name: 'Wireless Headphones', price: 199.99, description: 'High-quality wireless headphones' },
    { name: 'Smart Watch', price: 299.99, description: 'Fitness tracking smartwatch' },
    { name: 'Laptop Ultra', price: 1299.99, description: 'High-performance laptop' },
    { name: 'Tablet Mini', price: 499.99, description: 'Compact tablet for everyday use' }
  ],
  clothing: [
    { name: 'Classic T-Shirt', price: 24.99, description: 'Comfortable cotton t-shirt' },
    { name: 'Denim Jeans', price: 59.99, description: 'Classic fit denim jeans' },
    { name: 'Casual Jacket', price: 79.99, description: 'Stylish casual jacket' },
    { name: 'Running Shoes', price: 89.99, description: 'Comfortable running shoes' },
    { name: 'Summer Shorts', price: 34.99, description: 'Lightweight summer shorts' }
  ],
  home: [
    { name: 'Coffee Maker', price: 49.99, description: 'Automatic coffee maker' },
    { name: 'Bed Sheets Set', price: 39.99, description: 'Cotton bed sheets set' },
    { name: 'Smart LED Bulb', price: 29.99, description: 'WiFi-enabled smart bulb' },
    { name: 'Kitchen Blender', price: 69.99, description: 'High-speed blender' },
    { name: 'Wall Clock', price: 19.99, description: 'Modern wall clock' }
  ],
  beauty: [
    { name: 'Face Cream', price: 29.99, description: 'Hydrating face cream' },
    { name: 'Shampoo Set', price: 24.99, description: 'Natural ingredients shampoo' },
    { name: 'Makeup Kit', price: 49.99, description: 'Complete makeup kit' },
    { name: 'Perfume', price: 59.99, description: 'Luxury fragrance' },
    { name: 'Skincare Set', price: 79.99, description: 'Complete skincare routine' }
  ],
  sports: [
    { name: 'Yoga Mat', price: 29.99, description: 'Premium yoga mat' },
    { name: 'Dumbbell Set', price: 89.99, description: 'Adjustable dumbbell set' },
    { name: 'Sports Bag', price: 39.99, description: 'Durable sports bag' },
    { name: 'Running Watch', price: 159.99, description: 'GPS running watch' },
    { name: 'Basketball', price: 24.99, description: 'Professional basketball' }
  ]
};

// Generate unique IDs for products
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Create test data
const testData = {
  categories: Object.keys(categories).map(category => ({
    id: generateId(),
    name: category.charAt(0).toUpperCase() + category.slice(1),
    products: categories[category].map(product => ({
      id: generateId(),
      name: product.name,
      price: product.price,
      description: product.description,
      category: category,
      imageUrl: `/images/products/${category}/${product.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
    }))
  }))
};

// Create directories for images
function createImageDirectories() {
  const baseDir = path.join('public', 'images', 'products');
  Object.keys(categories).forEach(category => {
    const categoryDir = path.join(baseDir, category);
    fs.mkdirSync(categoryDir, { recursive: true });
  });
}

// Save test data to JSON file
function saveTestData() {
  const dataDir = path.join('public', 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(
    path.join(dataDir, 'test_products.json'),
    JSON.stringify(testData, null, 2)
  );
}

// Main function
async function main() {
  try {
    console.log('Generating test data...');
    createImageDirectories();
    saveTestData();
    console.log('Test data generated successfully!');
    console.log(`Total categories: ${testData.categories.length}`);
    console.log(`Total products: ${testData.categories.reduce((acc, cat) => acc + cat.products.length, 0)}`);
  } catch (error) {
    console.error('Error generating test data:', error);
  }
}

main().catch(console.error); 