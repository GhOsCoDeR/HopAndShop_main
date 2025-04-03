'use client'

import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'
import { products } from '@/lib/data'

export default function DealsPage() {
  // Filter products with special deals or discounts
  const deals = products.filter(product => 
    // If we have any criteria to consider a product as a "deal"
    product.price < 100 // Just an example filter, adjust based on your data
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-8"
      >
        Special Deals
      </motion.h1>

      {deals.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No special deals available at the moment.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={{
                id: product.id,
                name: product.name,
                price: product.price,
                description: product.description,
                category: product.category,
                image: product.imageUrl || '/images/products/placeholder.png',
                rating: 4.5,
                reviews: 10,
                stock: 100,
                specifications: {},
                features: [],
                discountPercentage: 15 // Adding a sample discount for testing
              }} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
} 