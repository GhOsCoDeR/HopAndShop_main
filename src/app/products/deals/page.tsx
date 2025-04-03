'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

// Sample deals data - updated to match the Product type
const dealsData: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3",
    category: "Electronics",
    rating: 4.5,
    reviews: 128,
    stock: 50,
    specifications: {
      'Brand': 'Premium Audio',
      'Battery Life': '20 hours',
      'Connectivity': 'Bluetooth 5.0'
    },
    features: [
      'Active Noise Cancellation',
      'Premium Sound Quality',
      'Long Battery Life'
    ],
    discountPercentage: 20,
    originalPrice: 379,
    express: true
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Advanced smartwatch with health monitoring features",
    price: 399,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3",
    category: "Electronics",
    rating: 4.7,
    reviews: 89,
    stock: 35,
    specifications: {
      'Brand': 'TechWear',
      'Battery Life': '48 hours',
      'Water Resistance': '5 ATM'
    },
    features: [
      'Heart Rate Monitoring',
      'GPS Tracking',
      'Sleep Analysis'
    ],
    discountPercentage: 20,
    originalPrice: 499,
    express: true
  }
]

export default function DealsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Special Deals</h1>
        <p className="text-gray-600 mb-8">Discover our amazing discounts on premium products!</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dealsData.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 