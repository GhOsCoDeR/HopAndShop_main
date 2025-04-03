'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { categories } from '@/data/products'

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover our wide range of technology products organized by category
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Link href={category.href}>
              <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white h-full">
                <div className="aspect-w-16 aspect-h-9 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {category.name}
                  </h2>
                  <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300 mt-2">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
} 