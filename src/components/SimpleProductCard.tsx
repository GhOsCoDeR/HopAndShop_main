'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'

interface SimpleProductCardProps {
  product: Product
}

export default function SimpleProductCard({ product }: SimpleProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="relative aspect-square">
        {/* Discount Badge */}
        {product.discountPercentage && product.discountPercentage > 0 && (
          <div className="absolute top-0 left-0 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-br">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
        
        {/* Product Image */}
        <div className="relative w-full h-full">
          <Image
            src={product.image || '/images/products/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
            className="object-contain"
          />
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-3">
        <h3 className="text-sm font-medium text-gray-800 truncate">
          {product.name}
        </h3>
        <p className="text-sm font-bold mt-1">GHS {product.price?.toFixed(2)}</p>
      </div>
    </div>
  );
} 