export interface Product {
  id: string
  name: string
  price: number
  description: string
  category: string
  imageUrl: string
}

interface Category {
  id: string
  name: string
  products: Product[]
}

// Test data
const testData = {
  categories: [
    {
      id: "electronics",
      name: "Electronics",
      products: [
        {
          id: "smartphone",
          name: "Smartphone Pro X",
          price: 999.99,
          description: "Latest smartphone with advanced features",
          category: "electronics",
          imageUrl: "/images/products/electronics/smartphone-pro-x.jpg"
        },
        {
          id: "headphones",
          name: "Wireless Headphones",
          price: 199.99,
          description: "High-quality wireless headphones",
          category: "electronics",
          imageUrl: "/images/products/electronics/wireless-headphones.jpg"
        },
        {
          id: "smartwatch",
          name: "Smart Watch",
          price: 299.99,
          description: "Fitness tracking smartwatch",
          category: "electronics",
          imageUrl: "/images/products/electronics/smart-watch.jpg"
        },
        {
          id: "laptop",
          name: "Laptop Ultra",
          price: 1299.99,
          description: "High-performance laptop",
          category: "electronics",
          imageUrl: "/images/products/electronics/laptop-ultra.jpg"
        },
        {
          id: "tablet",
          name: "Tablet Mini",
          price: 499.99,
          description: "Compact tablet for everyday use",
          category: "electronics",
          imageUrl: "/images/products/electronics/tablet-mini.jpg"
        }
      ]
    },
    {
      id: "clothing",
      name: "Clothing",
      products: [
        {
          id: "tshirt",
          name: "Classic T-Shirt",
          price: 24.99,
          description: "Comfortable cotton t-shirt",
          category: "clothing",
          imageUrl: "/images/products/clothing/classic-t-shirt.jpg"
        },
        {
          id: "jeans",
          name: "Denim Jeans",
          price: 59.99,
          description: "Classic fit denim jeans",
          category: "clothing",
          imageUrl: "/images/products/clothing/denim-jeans.jpg"
        },
        {
          id: "jacket",
          name: "Casual Jacket",
          price: 79.99,
          description: "Stylish casual jacket",
          category: "clothing",
          imageUrl: "/images/products/clothing/casual-jacket.jpg"
        },
        {
          id: "shoes",
          name: "Running Shoes",
          price: 89.99,
          description: "Comfortable running shoes",
          category: "clothing",
          imageUrl: "/images/products/clothing/running-shoes.jpg"
        },
        {
          id: "shorts",
          name: "Summer Shorts",
          price: 34.99,
          description: "Lightweight summer shorts",
          category: "clothing",
          imageUrl: "/images/products/clothing/summer-shorts.jpg"
        }
      ]
    },
    {
      id: "home",
      name: "Home",
      products: [
        {
          id: "coffee",
          name: "Coffee Maker",
          price: 49.99,
          description: "Automatic coffee maker",
          category: "home",
          imageUrl: "/images/products/home/coffee-maker.jpg"
        },
        {
          id: "sheets",
          name: "Bed Sheets Set",
          price: 39.99,
          description: "Cotton bed sheets set",
          category: "home",
          imageUrl: "/images/products/home/bed-sheets-set.jpg"
        },
        {
          id: "bulb",
          name: "Smart LED Bulb",
          price: 29.99,
          description: "WiFi-enabled smart bulb",
          category: "home",
          imageUrl: "/images/products/home/smart-led-bulb.jpg"
        },
        {
          id: "blender",
          name: "Kitchen Blender",
          price: 69.99,
          description: "High-speed blender",
          category: "home",
          imageUrl: "/images/products/home/kitchen-blender.jpg"
        },
        {
          id: "clock",
          name: "Wall Clock",
          price: 19.99,
          description: "Modern wall clock",
          category: "home",
          imageUrl: "/images/products/home/wall-clock.jpg"
        }
      ]
    }
  ]
};

// Export all products as a flat array
export const products: Product[] = testData.categories.flatMap(category => 
  category.products.map(product => ({
    ...product,
    category: category.name
  }))
);

// Export categories
export const categories = testData.categories;

// Export the full product data
export const fullProductData = testData; 