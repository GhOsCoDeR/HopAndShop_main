'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Heart, Star } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { Product } from '@/types/product'
import { toast } from 'react-hot-toast'
import ImagePlaceholder from '@/components/ImagePlaceholder'

interface ProductCardProps {
  product: Product
  showCategory?: boolean
}

export default function ProductCard({ product, showCategory = true }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [isHovered, setIsHovered] = useState(false)
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist!')
    } else {
      addToWishlist(product)
      toast.success('Added to wishlist!')
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      ...product,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  // Calculate discount percentage if not provided
  const discountPercentage = product.discountPercentage || 
    (product.originalPrice && product.price ? 
      Math.round(((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100) : 0);

  return (
    <div 
      className="bg-white rounded-lg shadow-sm overflow-hidden h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square">
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
              -{discountPercentage}%
            </div>
          )}
          
          {/* Product Image */}
          <div className="relative h-full w-full">
            <Image
              src={product.image || '/images/products/placeholder.png'}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
              className="object-contain p-2"
            />
          </div>
          
          {/* Hover Overlay with Actions */}
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-200">
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
                  aria-label="Add to cart"
                >
                  <ShoppingCart size={20} />
                </button>
                
                <button
                  onClick={handleWishlistToggle}
                  className={`${
                    isInWishlist(product.id) ? 'bg-red-50 text-red-500' : 'bg-white text-gray-600'
                  } p-2 rounded-full shadow-md transition-transform transform hover:scale-110`}
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                </button>
              </div>
            </div>
          )}
          
          {/* Express Badge */}
          {product.express && (
            <div className="absolute bottom-2 left-2 z-10">
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">EXPRESS</span>
            </div>
          )}
          
          {/* Limited Stock Badge */}
          {product.stock && product.stock < 10 && (
            <div className="absolute bottom-2 right-2 z-10">
              <span className="text-xs font-medium text-red-600 bg-red-50 px-1.5 py-0.5 rounded">LOW STOCK</span>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-3 border-t">
          {showCategory && product.category && (
            <p className="text-xs text-gray-500 mb-1 capitalize">
              {product.category}
            </p>
          )}
          
          <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-orange-500 transition-colors">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`h-3 w-3 ${
                      star <= Math.round(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">
                ({product.reviews || 0})
              </span>
            </div>
          )}
          
          <div className="mt-2 space-y-0.5">
            <span className="text-sm font-bold text-gray-900">
              GHS {product.price?.toFixed(2)}
            </span>
            {product.originalPrice && (
              <div>
                <span className="text-xs text-gray-400 line-through">
                  GHS {product.originalPrice?.toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
} 