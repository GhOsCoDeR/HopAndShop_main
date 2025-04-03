'use client'

import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

export default function DebugPage() {
  // Test products
  const testProducts = [
    {
      id: "test1",
      name: "Sample Product with Discount",
      description: "A test product with a discount applied",
      price: 100,
      originalPrice: 120,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60",
      category: "Electronics",
      rating: 4.5,
      reviews: 120,
      stock: 5,
      specifications: {},
      features: [],
      discountPercentage: 15,
      express: true
    },
    {
      id: "test2",
      name: "Sample Product without Discount",
      description: "A test product without any discount",
      price: 85,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=60",
      category: "Audio",
      rating: 4,
      reviews: 85,
      stock: 15,
      specifications: {},
      features: []
    }
  ]
  
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Debug Product Cards</h1>
      
      <div className="mb-8">
        <Link href="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testProducts.map(product => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
} 