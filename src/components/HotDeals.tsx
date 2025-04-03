'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import { Timer } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { hotDeals } from '@/data/products'

export default function HotDeals() {
  const { addItem } = useCartStore()

  const handleAddToCart = (deal: typeof hotDeals[0]) => {
    addItem({
      ...deal,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Hot Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hotDeals.map((deal) => (
            <div key={deal.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative">
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Hot Deal
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{deal.name}</h3>
                <p className="text-gray-600 mb-4">{deal.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${deal.price}</span>
                    {deal.originalPrice && (
                      <span className="text-gray-500 line-through ml-2">${deal.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-600 ml-1">{deal.rating}</span>
                    <span className="text-gray-500 ml-1">({deal.reviews})</span>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(deal)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 