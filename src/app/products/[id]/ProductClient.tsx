'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, Heart } from 'lucide-react'
import CartAnimation from '@/components/CartAnimation'
import { Product } from '@prisma/client'

interface ProductClientProps {
  product: Product
}

export default function ProductClient({ product }: ProductClientProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [showAnimation, setShowAnimation] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  const handleAddToCart = () => {
    setShowAnimation(true)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image || '',
      quantity: 1
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative aspect-w-1 aspect-h-1">
          <Image
            src={product.image || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <div className="mt-2 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-200'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">
              ({product.reviews} reviews)
            </span>
          </div>
          
          <p className="mt-4 text-gray-500">{product.description}</p>
          
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-gray-900">
                ${(product.price || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">
                {product.stock} in stock
              </p>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`mt-6 w-full py-3 px-4 rounded-md flex items-center justify-center space-x-2 ${
                product.stock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } text-white transition-colors`}
            >
              <ShoppingCart className="w-5 h-5" />
              <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
      </div>

      {showAnimation && (
        <CartAnimation
          productImage={product.image || '/placeholder.png'}
          productName={product.name}
          onComplete={() => setShowAnimation(false)}
        />
      )}
    </div>
  )
} 