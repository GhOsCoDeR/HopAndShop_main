'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { motion } from 'framer-motion'
import { products } from '@/data/products'
import { Product } from '@/types/product'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (query) {
      setIsLoading(true)
      // Simulate a small delay to show loading state
      const timer = setTimeout(() => {
        const filteredResults = products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase()) ||
          (product.brand && product.brand.toLowerCase().includes(query.toLowerCase()))
        )
        setResults(filteredResults)
        setIsLoading(false)
      }, 300)
      
      return () => clearTimeout(timer)
    }
  }, [query])

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900">Please enter a search term</h1>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Search results for "{query}"
        </h1>
        <p className="text-gray-500 mt-2">
          {isLoading ? 'Searching...' : `Found ${results.length} results`}
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-square mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-500">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
} 