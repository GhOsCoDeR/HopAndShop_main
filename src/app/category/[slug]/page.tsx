'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/types/product'
import ProductSection from '@/components/ProductSection'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { use } from 'react'
import { loadProducts, subscribeToProductUpdates } from '@/utils/productStorage'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import ProductCard from '@/components/ProductCard'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const category = resolvedParams.slug.replace(/-/g, ' ')
  const { addItem } = useCartStore()

  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true)
      try {
        // Load products from the storage utility
        const allProducts = await loadProducts()
        
        if (Array.isArray(allProducts)) {
          // Filter products by category
          const categoryProducts = allProducts.filter(
            (product: Product) => product.category?.toLowerCase() === category.toLowerCase()
          )
          setProducts(categoryProducts)
        } else {
          console.error('Products data is not an array:', allProducts)
          setProducts([])
        }
      } catch (error) {
        console.error('Error loading products:', error)
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProducts()
    
    // Subscribe to product updates
    const unsubscribe = subscribeToProductUpdates(async () => {
      try {
        const updatedProducts = await loadProducts()
        if (Array.isArray(updatedProducts)) {
          const updatedCategoryProducts = updatedProducts.filter(
            (product: Product) => product.category?.toLowerCase() === category.toLowerCase()
          )
          setProducts(updatedCategoryProducts)
        }
      } catch (error) {
        console.error('Error updating products:', error)
      }
    })
    
    // Clean up subscription
    return () => {
      unsubscribe()
    }
  }, [category])

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 capitalize">
            {category}
          </h1>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No products found in this category.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 