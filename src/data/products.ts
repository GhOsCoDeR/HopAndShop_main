import { Product } from '@/types/product'

// Category-specific placeholder images
const placeholders = {
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  appliances: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  gaming: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  supermarket: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}

// Default image fallback
const defaultImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'

// Get placeholder for category
const getPlaceholder = (category: string) => {
  return placeholders[category as keyof typeof placeholders] || defaultImage
}

// Default values for product properties
const defaultProductProps = {
  reviews: 50,
  stock: 100,
  stockStatus: 'in_stock' as const,
  specifications: {
    'Brand': 'Generic',
    'Warranty': '1 Year',
    'Condition': 'New'
  },
  features: ['Premium Quality', 'Official Warranty', 'Free Shipping']
}

// Helper function to create complete products
const createProduct = (product: Partial<Product>): Product => {
  return {
    ...defaultProductProps,
    ...product,
    originalPrice: product.originalPrice || (product.price ? Math.round(product.price * 1.2) : 0),
    image: product.image || getPlaceholder(product.category || '')
  } as Product
}

// Dummy products data with basic properties
const basicProducts = {
  phones: [
    {
      id: '6',
      name: 'iPhone 15 Pro',
      description: 'Latest iPhone with A17 Pro chip',
      price: 999,
      image: placeholders.phones,
      category: 'phones'
    },
    {
      id: '7',
      name: 'Samsung Galaxy S24',
      description: 'Android flagship with AI features',
      price: 899,
      image: placeholders.phones,
      category: 'phones'
    },
    {
      id: '8',
      name: 'Google Pixel 8',
      description: 'Best camera phone with AI',
      price: 799,
      image: placeholders.phones,
      category: 'phones'
    },
    {
      id: '9',
      name: 'OnePlus 12',
      description: 'Fast charging flagship',
      price: 699,
      image: placeholders.phones,
      category: 'phones'
    }
  ],
  laptops: [
    {
      id: '10',
      name: 'MacBook Pro M3',
      description: 'Powerful laptop for professionals',
      price: 1999,
      image: placeholders.laptops,
      category: 'laptops'
    },
    {
      id: '11',
      name: 'Dell XPS 15',
      description: 'Premium Windows laptop',
      price: 1499,
      image: placeholders.laptops,
      category: 'laptops'
    },
    {
      id: '12',
      name: 'Lenovo ThinkPad X1',
      description: 'Business laptop with security',
      price: 1299,
      image: placeholders.laptops,
      category: 'laptops'
    },
    {
      id: '13',
      name: 'HP Spectre x360',
      description: 'Convertible premium laptop',
      price: 1399,
      image: placeholders.laptops,
      category: 'laptops'
    }
  ],
  appliances: [
    {
      id: '14',
      name: 'Smart Refrigerator',
      description: 'WiFi-enabled fridge with screen',
      price: 1999,
      image: placeholders.appliances,
      category: 'appliances'
    },
    {
      id: '15',
      name: 'Robot Vacuum',
      description: 'Smart cleaning assistant',
      price: 299,
      image: placeholders.appliances,
      category: 'appliances'
    },
    {
      id: '16',
      name: 'Smart Washer',
      description: 'Connected laundry machine',
      price: 899,
      image: placeholders.appliances,
      category: 'appliances'
    },
    {
      id: '17',
      name: 'Smart Oven',
      description: 'WiFi-controlled cooking',
      price: 799,
      image: placeholders.appliances,
      category: 'appliances'
    }
  ],
  tvs: [
    {
      id: '18',
      name: 'OLED Smart TV',
      description: '4K display with HDR',
      price: 1999,
      image: placeholders.tvs,
      category: 'tvs'
    },
    {
      id: '19',
      name: 'QLED Gaming TV',
      description: '120Hz refresh rate',
      price: 1499,
      image: placeholders.tvs,
      category: 'tvs'
    },
    {
      id: '20',
      name: 'Mini LED TV',
      description: 'Local dimming technology',
      price: 1299,
      image: placeholders.tvs,
      category: 'tvs'
    },
    {
      id: '21',
      name: 'Smart LED TV',
      description: 'Voice control enabled',
      price: 799,
      image: placeholders.tvs,
      category: 'tvs'
    }
  ],
  fashion: [
    {
      id: '22',
      name: 'Designer Watch',
      description: 'Luxury timepiece',
      price: 299,
      image: placeholders.fashion,
      category: 'fashion'
    },
    {
      id: '23',
      name: 'Leather Bag',
      description: 'Handcrafted accessory',
      price: 199,
      image: placeholders.fashion,
      category: 'fashion'
    },
    {
      id: '24',
      name: 'Sunglasses',
      description: 'Premium eyewear',
      price: 149,
      image: placeholders.fashion,
      category: 'fashion'
    },
    {
      id: '25',
      name: 'Smart Ring',
      description: 'Fitness tracking jewelry',
      price: 199,
      image: placeholders.fashion,
      category: 'fashion'
    }
  ],
  furniture: [
    {
      id: '26',
      name: 'Smart Sofa',
      description: 'Reclining with USB ports',
      price: 999,
      image: placeholders.furniture,
      category: 'furniture'
    },
    {
      id: '27',
      name: 'Gaming Chair',
      description: 'Ergonomic design',
      price: 299,
      image: placeholders.furniture,
      category: 'furniture'
    },
    {
      id: '28',
      name: 'Smart Desk',
      description: 'Height adjustable',
      price: 499,
      image: placeholders.furniture,
      category: 'furniture'
    },
    {
      id: '29',
      name: 'LED Bed',
      description: 'With storage',
      price: 799,
      image: placeholders.furniture,
      category: 'furniture'
    }
  ],
  beauty: [
    {
      id: '30',
      name: 'Smart Mirror',
      description: 'LED with touch screen',
      price: 299,
      image: placeholders.beauty,
      category: 'beauty'
    },
    {
      id: '31',
      name: 'Hair Dryer',
      description: 'Ionic technology',
      price: 89,
      image: placeholders.beauty,
      category: 'beauty'
    },
    {
      id: '32',
      name: 'Facial Steamer',
      description: 'Ultrasonic mist',
      price: 49,
      image: placeholders.beauty,
      category: 'beauty'
    },
    {
      id: '33',
      name: 'Massage Gun',
      description: 'Deep tissue therapy',
      price: 129,
      image: placeholders.beauty,
      category: 'beauty'
    }
  ],
  sports: [
    {
      id: '34',
      name: 'Smart Bike',
      description: 'Connected exercise bike',
      price: 999,
      image: placeholders.sports,
      category: 'sports'
    },
    {
      id: '35',
      name: 'Fitness Tracker',
      description: 'Advanced health metrics',
      price: 199,
      image: '/images/products/sports/35.jpg',
      category: 'sports'
    },
    {
      id: '36',
      name: 'Smart Scale',
      description: 'Body composition analysis',
      price: 89,
      image: '/images/products/sports/36.jpg',
      category: 'sports'
    },
    {
      id: '37',
      name: 'Yoga Mat',
      description: 'Non-slip premium',
      price: 39,
      image: '/images/products/sports/37.jpg',
      category: 'sports'
    }
  ],
  toys: [
    {
      id: '38',
      name: 'Robot Kit',
      description: 'Build your own robot',
      price: 79,
      image: '/images/products/toys/38.jpg',
      category: 'toys'
    },
    {
      id: '39',
      name: 'RC Car',
      description: 'High-speed remote control',
      price: 49,
      image: '/images/products/toys/39.jpg',
      category: 'toys'
    },
    {
      id: '40',
      name: 'Drone',
      description: 'Mini flying camera',
      price: 129,
      image: '/images/products/toys/40.jpg',
      category: 'toys'
    },
    {
      id: '41',
      name: 'VR Headset',
      description: 'Virtual reality gaming',
      price: 299,
      image: '/images/products/toys/41.jpg',
      category: 'toys'
    }
  ],
  books: [
    {
      id: '42',
      name: 'E-Reader',
      description: 'Digital book device',
      price: 139,
      image: '/images/products/books/42.jpg',
      category: 'books'
    },
    {
      id: '43',
      name: 'Smart Notebook',
      description: 'Digital writing pad',
      price: 79,
      image: '/images/products/books/43.jpg',
      category: 'books'
    },
    {
      id: '44',
      name: 'Audio Book Player',
      description: 'Portable audio device',
      price: 89,
      image: '/images/products/books/44.jpg',
      category: 'books'
    },
    {
      id: '45',
      name: 'Book Light',
      description: 'LED reading light',
      price: 19,
      image: '/images/products/books/45.jpg',
      category: 'books'
    }
  ],
  supermarket: [
    {
      id: '60',
      name: 'Organic Fresh Vegetables Pack',
      description: 'Farm fresh assorted organic vegetables pack',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Farm Fresh',
      discountPercentage: 15,
      rating: 4.7
    },
    {
      id: '61',
      name: 'Free Range Eggs (Dozen)',
      description: 'Premium free-range eggs from pasture-raised hens',
      price: 5.99,
      image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Happy Hens',
      discountPercentage: 10,
      rating: 4.8
    },
    {
      id: '62',
      name: 'Grass-Fed Ground Beef',
      description: 'Organic grass-fed beef, 1kg package',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1602470520998-f4a52199a3d6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Organic Farms',
      rating: 4.6
    },
    {
      id: '63',
      name: 'Fresh Baked Whole Grain Bread',
      description: 'Artisanal whole grain bread, baked daily',
      price: 3.99,
      image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Artisan Bakery',
      discountPercentage: 5,
      rating: 4.5,
      express: true
    },
    {
      id: '64',
      name: 'Cold Pressed Olive Oil',
      description: 'Extra virgin olive oil from Mediterranean olives, 750ml',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Mediterranean Delights',
      rating: 4.9
    },
    {
      id: '65',
      name: 'Wild Caught Salmon Fillets',
      description: 'Premium wild caught salmon, 500g',
      price: 19.99,
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Ocean Fresh',
      rating: 4.7,
      express: true
    },
    {
      id: '66',
      name: 'Organic Milk',
      description: 'Organic whole milk from grass-fed cows, 1L',
      price: 3.49,
      image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Green Pastures',
      rating: 4.5
    },
    {
      id: '67',
      name: 'Fresh Berries Mix',
      description: 'Assorted fresh berries pack: strawberries, blueberries, and raspberries',
      price: 7.99,
      image: 'https://images.unsplash.com/photo-1563746924237-f4271dea4919?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Berry Farms',
      discountPercentage: 20,
      rating: 4.6
    },
    {
      id: '68',
      name: 'Organic Coffee Beans',
      description: 'Fair trade organic coffee beans, medium roast, 250g',
      price: 8.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Coffee Collective',
      rating: 4.8
    },
    {
      id: '69',
      name: 'Artisanal Cheese Selection',
      description: 'Premium selection of artisanal cheeses, 400g',
      price: 22.99,
      image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Cheese Masters',
      rating: 4.9,
      express: true
    },
    {
      id: '70',
      name: 'Organic Honey',
      description: 'Pure organic wildflower honey, 500g',
      price: 9.99,
      image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Bee Happy',
      rating: 4.7
    },
    {
      id: '71',
      name: 'Free Range Chicken',
      description: 'Free range whole chicken, approximately 1.5kg',
      price: 15.99,
      image: 'https://images.unsplash.com/photo-1583496660742-9e26b0d13fad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      category: 'supermarket',
      brand: 'Happy Farms',
      discountPercentage: 12,
      rating: 4.5,
      express: true
    }
  ]
}

// Create product objects with all the default properties
export const products = [
  // Phones
  ...basicProducts.phones.map(product => createProduct({
    ...product,
    rating: 4.5 + Math.random() * 0.5,
    stock: 10 + Math.floor(Math.random() * 100),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : undefined,
    brand: ['Apple', 'Samsung', 'Google', 'OnePlus'][Math.floor(Math.random() * 4)]
  })),
  
  // Laptops
  ...basicProducts.laptops.map(product => createProduct({
    ...product,
    rating: 4.2 + Math.random() * 0.7,
    stock: 5 + Math.floor(Math.random() * 30),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 20) : undefined,
    brand: ['Apple', 'Dell', 'Lenovo', 'HP'][Math.floor(Math.random() * 4)]
  })),
  
  // Appliances
  ...basicProducts.appliances.map(product => createProduct({
    ...product,
    rating: 4.0 + Math.random() * 0.8,
    stock: 3 + Math.floor(Math.random() * 20),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 25) : undefined,
    brand: ['Samsung', 'LG', 'Whirlpool', 'Bosch'][Math.floor(Math.random() * 4)]
  })),
  
  // TVs
  ...basicProducts.tvs.map(product => createProduct({
    ...product,
    rating: 4.3 + Math.random() * 0.6,
    stock: 2 + Math.floor(Math.random() * 15),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : undefined,
    brand: ['Samsung', 'LG', 'Sony', 'TCL'][Math.floor(Math.random() * 4)]
  })),
  
  // Fashion
  ...basicProducts.fashion.map(product => createProduct({
    ...product,
    rating: 4.0 + Math.random() * 0.9,
    stock: 20 + Math.floor(Math.random() * 80),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 40) : undefined,
    brand: ['Adidas', 'Nike', 'Gucci', 'Zara'][Math.floor(Math.random() * 4)]
  })),
  
  // Furniture
  ...basicProducts.furniture.map(product => createProduct({
    ...product,
    rating: 4.1 + Math.random() * 0.7,
    stock: 2 + Math.floor(Math.random() * 10),
    discountPercentage: Math.random() > 0.5 ? Math.floor(Math.random() * 25) : undefined,
    brand: ['IKEA', 'Ashley', 'La-Z-Boy', 'Herman Miller'][Math.floor(Math.random() * 4)]
  })),
  
  // Supermarket
  ...basicProducts.supermarket.map(product => createProduct({
    ...product,
    rating: product.rating || (4.5 + Math.random() * 0.5),
    stock: 10 + Math.floor(Math.random() * 50),
    specifications: {
      'Brand': product.brand || 'Generic',
      'Origin': ['Local', 'Imported', 'Organic Farm', 'Sustainable Source'][Math.floor(Math.random() * 4)],
      'Storage': ['Refrigerated', 'Room Temperature', 'Cool and Dry', 'Frozen'][Math.floor(Math.random() * 4)]
    },
    features: [
      'High Quality', 
      'Fresh Products', 
      'Sustainably Sourced', 
      'No Preservatives',
      'Organic'
    ].slice(0, 2 + Math.floor(Math.random() * 3))
  }))
]

export const categories = [
  {
    id: 'computing',
    name: 'Computing',
    description: 'High-performance laptops for work and gaming',
    image: '/images/categories/computing.svg',
    href: '/category/computing'
  },
  {
    id: 'phones',
    name: 'Phones & Tablets',
    description: 'Latest smartphones and tablets',
    image: '/images/categories/phones.svg',
    href: '/category/phones'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Premium electronics and gadgets',
    image: '/images/categories/electronics.svg',
    href: '/category/electronics'
  },
  {
    id: 'appliances',
    name: 'Appliances',
    description: 'Home and kitchen appliances',
    image: '/images/icons/appliances.svg',
    href: '/category/appliances'
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Trendy clothing and accessories',
    image: '/images/icons/fashion.svg',
    href: '/category/fashion'
  },
  {
    id: 'supermarket',
    name: 'Supermarket',
    description: 'Fresh groceries and everyday essentials',
    image: '/images/icons/supermarket.svg',
    href: '/category/supermarket'
  },
  {
    id: 'health',
    name: 'Health & Beauty',
    description: 'Beauty products and personal care',
    image: '/images/icons/health.svg',
    href: '/category/health'
  },
  {
    id: 'home',
    name: 'Home & Office',
    description: 'Furniture and office supplies',
    image: '/images/icons/home.svg',
    href: '/category/home'
  },
  {
    id: 'gaming',
    name: 'Gaming',
    description: 'Gaming consoles and accessories',
    image: '/images/icons/gaming.svg',
    href: '/category/gaming'
  },
  {
    id: 'sporting',
    name: 'Sporting Goods',
    description: 'Sports equipment and accessories',
    image: '/images/icons/sport.svg',
    href: '/category/sporting'
  }
]

// Filter products for hot deals (products with originalPrice)
export const hotDeals = products.filter(product => product.originalPrice)

// Filter products for featured section (products with high ratings)
export const featuredProducts = products.filter(product => product.rating >= 4.7) 