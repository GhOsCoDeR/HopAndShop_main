'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { loadProducts } from '@/utils/productStorage'
import ImagePlaceholder from '@/components/ImagePlaceholder'

// Define featured brands with their logos
const featuredBrands = [
  { name: 'Apple', logo: '/images/brands/apple.svg', description: 'Innovative technology products' },
  { name: 'Samsung', logo: '/images/brands/samsung.svg', description: 'Leading electronics manufacturer' },
  { name: 'Sony', logo: '/images/brands/placeholder.svg', description: 'High-quality entertainment products' },
  { name: 'LG', logo: '/images/brands/placeholder.svg', description: 'Premium appliances and electronics' },
  { name: 'Dell', logo: '/images/brands/placeholder.svg', description: 'Reliable computing solutions' },
  { name: 'Nike', logo: '/images/brands/placeholder.svg', description: 'Performance sportswear' },
  { name: 'Adidas', logo: '/images/brands/placeholder.svg', description: 'Sport-inspired lifestyle products' },
  { name: 'Gucci', logo: '/images/brands/placeholder.svg', description: 'Luxury fashion and accessories' }
]

export default function BrandFestivalPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [productsByBrand, setProductsByBrand] = useState<Record<string, Product[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState('All Brands')

  // Load products
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
            const allProducts = data.products
            setProducts(allProducts)
            
            // Group products by brand
            const grouped = allProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
              const brand = product.brand || 'Other'
              if (!acc[brand]) {
                acc[brand] = []
              }
              acc[brand].push(product)
              return acc
            }, {})
            
            setProductsByBrand(grouped)
          }
        } else {
          // Fallback to localStorage
          const allProducts = await loadProducts()
          if (isMounted) {
            setProducts(allProducts)
            
            // Group products by brand
            const grouped = allProducts.reduce((acc: Record<string, Product[]>, product: Product) => {
              const brand = product.brand || 'Other'
              if (!acc[brand]) {
                acc[brand] = []
              }
              acc[brand].push(product)
              return acc
            }, {})
            
            setProductsByBrand(grouped)
          }
        }
      } catch (error) {
        console.error('Error loading brand festival products:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setMounted(true)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  // Get top brands based on product count
  const topBrands = Object.entries(productsByBrand)
    .map(([brand, products]) => ({
      name: brand,
      count: products.length,
      // Use the predefined logo if available, otherwise use a placeholder
      logo: featuredBrands.find(b => b.name === brand)?.logo || '/images/brands/placeholder.svg'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Handle displaying appropriate products based on selected brand
  const displayProducts = selectedBrand === 'All Brands' 
    ? products.slice(0, 12)
    : productsByBrand[selectedBrand]?.slice(0, 12) || []

  if (!mounted || isLoading) {
    return (
      <>
        <Header />
        <main className="bg-gray-100 min-h-screen pb-10 pt-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-[200px] bg-gray-300 rounded-lg animate-pulse mb-8"></div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <div className="h-8 w-[200px] bg-gray-300 rounded animate-pulse mb-4"></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-8">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-gray-200 p-4 rounded-lg flex flex-col items-center animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-2"></div>
                    <div className="h-4 w-20 bg-gray-300 rounded mt-2"></div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => (
                  <div key={i} className="border rounded-lg bg-white p-4 animate-pulse">
                    <div className="h-[200px] bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
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
              src="/images/banners/brand-festival-banner.jpg"
              alt="Brand Festival"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Brand Festival</h1>
                <p className="text-xl mb-1">Exclusive deals from top brands</p>
                <p className="text-sm text-white/80">Find premium products at incredible prices</p>
              </div>
            </div>
          </div>

          {/* Top Brands Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Brands</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
              {featuredBrands.map((brand) => (
                <button
                  key={brand.name}
                  className={`p-4 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors ${
                    selectedBrand === brand.name ? 'bg-orange-50 border border-orange-200' : ''
                  }`}
                  onClick={() => setSelectedBrand(brand.name)}
                >
                  <div className="w-16 h-16 relative mb-2">
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </div>
                  <span className="text-sm text-center">{brand.name}</span>
                </button>
              ))}
              <button
                className={`p-4 rounded-lg flex flex-col items-center hover:bg-gray-50 transition-colors ${
                  selectedBrand === 'All Brands' ? 'bg-orange-50 border border-orange-200' : ''
                }`}
                onClick={() => setSelectedBrand('All Brands')}
              >
                <div className="w-16 h-16 flex items-center justify-center mb-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">All</span>
                  </div>
                </div>
                <span className="text-sm text-center">All Brands</span>
              </button>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedBrand === 'All Brands' ? 'Featured Products' : `${selectedBrand} Products`}
              </h2>
            </div>

            {displayProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">No products available for this brand at the moment.</p>
                <button 
                  onClick={() => setSelectedBrand('All Brands')} 
                  className="text-orange-500 hover:text-orange-600 mt-4"
                >
                  Browse all brands
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayProducts.map((product) => (
                  <Link 
                    href={`/products/${product.id}`} 
                    key={product.id} 
                    className="border rounded-lg bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="relative pt-[100%] overflow-hidden">
                      <ImagePlaceholder
                        src={product.image || '/images/products/placeholder.png'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-contain p-2 transition-transform hover:scale-105"
                        type="product"
                      />
                      {product.discountPercentage && (
                        <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{Math.round(product.discountPercentage)}%
                        </div>
                      )}
                      {product.brand && (
                        <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                          {product.brand}
                        </div>
                      )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2 hover:text-orange-500">
                        {product.name}
                      </h3>
                      
                      {/* Price */}
                      <div className="mt-2">
                        <span className="text-lg font-bold text-gray-900">
                          GHS {(product.price || 0).toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            GHS {(product.originalPrice || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
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