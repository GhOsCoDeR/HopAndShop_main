'use client'

import { useState, useEffect } from 'react'
import { useWishlistStore } from '@/store/wishlistStore'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShoppingCart, Heart, ArrowLeft, Trash2 } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import { Product } from '@/types/product'
import Footer from '@/components/Footer'

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlistStore()
  const { addItem } = useCartStore()
  const [mounted, setMounted] = useState(false)

  // Fix hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId)
    toast.success('Removed from wishlist')
  }

  const handleAddToCart = (product: Product) => {
    addItem({
      ...product,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  const handleMoveAllToCart = () => {
    items.forEach(product => {
      addItem({
        ...product,
        quantity: 1
      })
    })
    toast.success(`Added ${items.length} items to cart!`)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-500 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 mx-auto text-gray-300" />
            <h2 className="mt-4 text-xl font-medium text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-500">Add items to your wishlist to save them for later.</p>
            <Link 
              href="/" 
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-500">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
              <button 
                onClick={handleMoveAllToCart}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium"
              >
                Move all to cart
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
              {items.map((product) => (
                <motion.div 
                  key={product.id} 
                  className="group relative"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                    <Link href={`/products/${product.id}`}>
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      {product.stockStatus === 'out_of_stock' && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-2 py-1 text-xs rounded-md font-medium">Out of Stock</span>
                        </div>
                      )}
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                  
                  <div className="mt-4">
                    <Link href={`/products/${product.id}`} className="block">
                      <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
                      <p className="mt-1 text-sm text-gray-500 capitalize">{product.category}</p>
                    </Link>
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">${product.price}</p>
                        {product.originalPrice && (
                          <p className="text-xs text-gray-500 line-through">${product.originalPrice}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stockStatus === 'out_of_stock'}
                        className={`inline-flex items-center p-2 rounded-full ${
                          product.stockStatus === 'in_stock'
                            ? 'text-blue-600 hover:text-blue-700 focus:outline-none'
                            : 'text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
} 