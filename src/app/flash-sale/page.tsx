'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, ShoppingCart } from 'lucide-react'
import { loadProducts } from '@/utils/productStorage'
import { Button } from '@/components/ui/button'
import ImagePlaceholder from '@/components/ImagePlaceholder'

// Simple skeleton component
const Skeleton = ({ className }: { className: string }) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`}></div>
)

// Simple cart functionality
const addToCart = (product: Product) => {
  // Get existing cart
  const existingCart = localStorage.getItem('cart')
  const cart = existingCart ? JSON.parse(existingCart) : []
  
  // Check if product already in cart
  const existingItemIndex = cart.findIndex((item: any) => item.id === product.id)
  
  if (existingItemIndex > -1) {
    // Update quantity if product exists
    cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1
  } else {
    // Add new product with quantity 1
    cart.push({
      ...product,
      quantity: 1
    })
  }
  
  // Save back to localStorage
  localStorage.setItem('cart', JSON.stringify(cart))
  
  // Dispatch event for cart update
  window.dispatchEvent(new Event('cartUpdated'))
}

export default function FlashSalePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  })
  
  // Toast function
  const showToast = (title: string, description: string) => {
    // Simple alert for now
    alert(`${title}: ${description}`)
  }

  // Load products and initialize countdown
  useEffect(() => {
    let isMounted = true
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        // Try to get products from server first
        const response = await fetch('/api/products/load')
        if (response.ok) {
          const data = await response.json()
          if (data.products && Array.isArray(data.products) && isMounted) {
            // Get products with highest discounts
            const flashSaleProducts = data.products
              .filter((p: Product) => p.discountPercentage && p.discountPercentage > 15)
              .sort((a: Product, b: Product) => 
                (b.discountPercentage || 0) - (a.discountPercentage || 0)
              )
              .slice(0, 12)
            
            setProducts(flashSaleProducts)
          }
        } else {
          // Fallback to localStorage
          const allProducts = await loadProducts()
          const flashSaleProducts = allProducts
            .filter(p => p.discountPercentage && p.discountPercentage > 15)
            .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
            .slice(0, 12)
          
          if (isMounted) {
            setProducts(flashSaleProducts)
          }
        }
      } catch (error) {
        console.error('Error loading flash sale products:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setMounted(true)
        }
      }
    }

    fetchProducts()

    // Set up countdown timer
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        // Reset when it reaches 0
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)

    return () => {
      isMounted = false
      clearInterval(timerId)
    }
  }, [])

  const handleAddToCart = (product: Product) => {
    showToast("Added to cart!", `${product.name} has been added to your cart.`)
    addToCart(product)
  }

  if (!mounted || isLoading) {
    return (
      <>
        <Header />
        <main className="bg-gray-100 min-h-screen pb-10 pt-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <Skeleton className="h-8 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[300px] mb-8" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <Skeleton className="h-[200px] w-full mb-4" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-2" />
                    <Skeleton className="h-6 w-1/3 mb-4" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen pb-10 pt-6">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Banner */}
          <div className="relative h-[200px] rounded-lg overflow-hidden mb-8">
            <Image
              src="/images/banners/flash-sale-banner.jpg"
              alt="Flash Sale"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Flash Sale</h1>
                <p className="text-xl mb-4">Incredible deals up to 70% off!</p>
                <div className="flex items-center space-x-4">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span className="text-lg">
                    Ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Flash Sale Products</h2>
            {products.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No flash sale products available at the moment.</p>
                <Link href="/" className="text-orange-500 hover:text-orange-600 mt-4 inline-block">
                  Browse other products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow">
                    {/* Product Image */}
                    <Link href={`/products/${product.id}`} className="block relative pt-[100%] overflow-hidden">
                      <ImagePlaceholder
                        src={product.image || '/images/products/placeholder.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 transition-transform hover:scale-105"
                        type="product"
                      />
                      {product.discountPercentage && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round(product.discountPercentage)}%
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500">
                        <div 
                          className="h-1 bg-red-600" 
                          style={{ width: `${Math.max(10, Math.min(90, Math.floor(Math.random() * 80) + 10))}%` }}
                        ></div>
                      </div>
                    </Link>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-orange-500">
                          {product.name}
                        </h3>
                      </Link>
                      
                      {/* Price */}
                      <div className="mt-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">
                          GHS {(product.price || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            GHS {(product.originalPrice || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      {product.rating && (
                        <div className="flex items-center mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300 fill-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">({product.reviews || 0})</span>
                        </div>
                      )}
                      
                      {/* Add to Cart Button */}
                      <Button 
                        className="w-full mt-2 bg-orange-500 hover:bg-orange-600 text-white" 
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 