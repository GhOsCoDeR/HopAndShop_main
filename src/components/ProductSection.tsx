'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

interface ProductSectionProps {
  title: string
  products: Product[]
  category: string
}

export default function ProductSection({ title, products, category }: ProductSectionProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    toast.success('Added to cart!')
  }

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
        <Link
          href={`/products?category=${category}`}
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          View All
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
} 