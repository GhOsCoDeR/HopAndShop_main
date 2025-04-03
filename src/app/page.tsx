'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { categories } from '@/data/products'
import ImagePlaceholder from '@/components/ImagePlaceholder'
import CategoryCarousel from '@/components/CategoryCarousel'
import Image from 'next/image'
import { loadProducts, subscribeToProductUpdates } from '@/utils/productStorage'
import ProductCard from '@/components/ProductCard'

// Banner data for category carousels
const categoryBanners = {
  phones: [
    {
      url: "/images/banners/phones-banner1.jpg",
      alt: "Latest Phones",
      link: "/category/phones",
    },
    {
      url: "/images/banners/phones-banner2.jpg",
      alt: "iPhone Deals",
      link: "/promotions/iphone",
    },
    {
      url: "/images/banners/phones-banner3.jpg",
      alt: "Android Specials",
      link: "/promotions/android",
    },
  ],
  electronics: [
    {
      url: "/images/banners/electronics-banner1.jpg",
      alt: "Electronics Sale",
      link: "/category/electronics",
    },
    {
      url: "/images/banners/electronics-banner2.jpg",
      alt: "Smart Home",
      link: "/category/smart-home",
    },
  ],
  computing: [
    {
      url: "/images/banners/computing-banner1.jpg",
      alt: "Laptop Deals",
      link: "/category/laptops",
    },
    {
      url: "/images/banners/computing-banner2.jpg",
      alt: "Accessories",
      link: "/category/accessories",
    },
  ],
  fashion: [
    {
      url: "/images/banners/fashion-banner1.jpg",
      alt: "Fashion Sale",
      link: "/category/fashion",
    },
    {
      url: "/images/banners/fashion-banner2.jpg",
      alt: "New Arrivals",
      link: "/new-arrivals/fashion",
    },
  ],
  supermarket: [
    {
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Fresh Groceries",
      link: "/category/supermarket",
    },
    {
      url: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Organic Food",
      link: "/category/supermarket?filter=organic",
    },
  ],
}

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Fix hydration issues and load products
  useEffect(() => {
    let isMounted = true;

    async function initializeProducts() {
      setIsLoading(true)
      
      try {
        // Try to load from server first
        const response = await fetch('/api/products/load')
        if (response.ok) {
          const data = await response.json()
          if (data.products && Array.isArray(data.products) && isMounted) {
            setProducts(data.products)
            localStorage.setItem('products', JSON.stringify(data.products))
            console.log('Home: Loaded products from server:', data.products.length)
          }
        } else {
          // If server fails, load from localStorage or fallback
          const storedProducts = await loadProducts()
          if (isMounted) {
            setProducts(storedProducts)
            console.log('Home: Loaded products from localStorage:', storedProducts.length)
          }
        }
      } catch (error) {
        console.error('Error initializing products:', error)
        // Use fallback if everything fails
        try {
          const storedProducts = await loadProducts()
          if (isMounted) {
            setProducts(storedProducts)
            console.log('Home: Loaded fallback products')
          }
        } catch (fallbackError) {
          console.error('Even fallback loading failed:', fallbackError)
          // Set empty products array as last resort
          if (isMounted) {
            setProducts([])
            console.error('Unable to load any products, using empty array')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
          setMounted(true)
        }
      }
    }
    
    // Set a timeout to prevent infinite loading state
    const loadingTimeout = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log('Loading timeout reached, forcing mounted state')
        setIsLoading(false)
        setMounted(true)
      }
    }, 5000) // 5 second timeout
    
    initializeProducts()
    
    // Subscribe to product updates
    const unsubscribe = subscribeToProductUpdates(async () => {
      if (isMounted) {
        try {
          const updatedProducts = await loadProducts()
          setProducts(updatedProducts)
          console.log('Home: Updated products from event')
        } catch (error) {
          console.error('Error updating products from event:', error)
          // Do not change the products state if update fails
        }
      }
    })
    
    // Clean up subscription and mounted state
    return () => {
      isMounted = false
      unsubscribe()
      clearTimeout(loadingTimeout)
    }
  }, [])
  
  // Process products data in a stable, deterministic way
  const getProducts = () => {
    // Use the products state which contains the loaded product data
    const allProducts = products || [];
    
    // Skip processing if no products are available
    if (allProducts.length === 0) {
      return {
        phones: [], 
        electronics: [], 
        computing: [], 
        appliances: [], 
        fashion: [], 
        homeOffice: [], 
        supermarket: [],
        topDeals: [], 
        flashSale: [],
        newArrivals: [], 
        topRated: []
      };
    }

    // Helper function to check if a product belongs to a main category
    const belongsToCategory = (product: Product, mainCategory: string): boolean => {
      // Check if the product's category directly matches the main category
      if (product.category === mainCategory || product.category.toLowerCase() === mainCategory.toLowerCase()) {
        return true;
      }
      
      // If there's a subcategory, we'll use that to refine the categorization
      if (product.subcategory) {
        return product.category === mainCategory;
      }
      
      return false;
    };

    // Filter products by category
    const phones = allProducts.filter(p => belongsToCategory(p, 'phones')).slice(0, 8);
    
    const electronics = allProducts.filter(p => 
      belongsToCategory(p, 'electronics')
    ).slice(0, 8);
    
    const computing = allProducts.filter(p => 
      belongsToCategory(p, 'computing')
    ).slice(0, 8);
    
    const appliances = allProducts.filter(p => 
      belongsToCategory(p, 'appliances')
    ).slice(0, 8);
    
    const fashion = allProducts.filter(p => 
      belongsToCategory(p, 'fashion')
    ).slice(0, 8);
    
    const homeOffice = allProducts.filter(p => 
      belongsToCategory(p, 'home')
    ).slice(0, 8);
    
    const supermarket = allProducts.filter(p => 
      belongsToCategory(p, 'supermarket')
    ).slice(0, 8);

    // Filter products for special sections
    // Only include products explicitly marked as Top Deals
    const topDeals = [...allProducts]
      .filter(product => product.isTopDeal === true)
      .sort((a, b) => ((b.discountPercentage || 0) - (a.discountPercentage || 0)))
      .slice(0, 8)
    
    // Flash sale products - only include products marked as Flash Sale items
    const flashSale = [...allProducts]
      .filter(product => product.isFlashSale === true)
      .sort((a, b) => ((b.discountPercentage || 0) - (a.discountPercentage || 0)))
      .slice(0, 8)
    
    // Use a stable sort for new arrivals
    const newArrivals = [...allProducts]
      .sort((a, b) => Number(a.id) - Number(b.id)) // Sort by ID instead of random
      .slice(0, 8)
    
    const topRated = [...allProducts]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 8)

    return { 
      phones, 
      electronics, 
      computing, 
      appliances, 
      fashion, 
      homeOffice, 
      supermarket,
      topDeals, 
      flashSale,
      newArrivals, 
      topRated 
    }
  }

  // Show loading state until the client-side code has mounted
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Get products data after client-side mounting
  const { 
    phones, 
    electronics, 
    computing, 
    appliances, 
    fashion, 
    homeOffice, 
    supermarket,
    topDeals, 
    flashSale,
    newArrivals, 
    topRated 
  } = getProducts()

  return (
    <>
      <Header />
      <main className="bg-gray-100 min-h-screen pb-10">
        <Hero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          
          {/* Browse Categories Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
                <p className="text-sm text-gray-500 mt-1">Find products by category</p>
              </div>
              <Link href="/products" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <div className="flex space-x-4 pb-2 min-w-max">
                {categories.map((category) => (
                  <Link key={category.id} href={category.href} className="group">
                    <div className="bg-white hover:shadow-md transition-shadow duration-200 rounded-lg overflow-hidden min-w-[180px]">
                      <div className="relative h-[180px] bg-gray-50">
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                          <div className="p-4 w-full">
                            <h3 className="text-white font-medium">{category.name}</h3>
                            <p className="text-white/80 text-xs mt-1 truncate">{category.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500 text-center">
              <p>Scroll horizontally to see more categories ➡️</p>
            </div>
          </div>
          
          {/* Top Deals Section - Only show if there are products marked as Top Deals */}
          {topDeals.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Top Deals</h2>
                  <p className="text-sm text-gray-500 mt-1">Exclusive offers just for you</p>
                </div>
                <Link href="/top-deals" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                  See All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {topDeals.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flash Sale Section - Only show if there are products marked as Flash Sale */}
          {flashSale.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    <span className="mr-2">⚡</span>Flash Sale
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Limited-time offers - Hurry!</p>
                </div>
                <Link href="/flash-sale" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                  See All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {flashSale.map((product) => (
                  <div key={product.id}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Flash Sale Banner */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Link href="/flash-sale" className="relative block h-[200px] rounded-lg overflow-hidden">
              <Image
                src="/images/banners/flash-sale-banner.jpg"
                alt="Flash Sale"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center rounded-lg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">Flash Sale</h3>
                  <p className="text-white/90 mb-2">Up to 70% Off</p>
                  <span className="inline-flex items-center text-sm bg-orange-500 text-white px-3 py-1 rounded-full">
                    Shop Now
                  </span>
                </div>
              </div>
            </Link>
            <Link href="/brand-festival" className="relative block h-[200px] rounded-lg overflow-hidden">
              <Image
                src="/images/banners/brand-festival-banner.jpg"
                alt="Brand Festival"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center rounded-lg"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-2xl font-bold mb-1">Brand Festival</h3>
                  <p className="text-white/90 mb-2">Top Brands, Best Deals</p>
                  <span className="inline-flex items-center text-sm bg-orange-500 text-white px-3 py-1 rounded-full">
                    Explore Now
                  </span>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Phones Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Phones</h2>
                <p className="text-sm text-gray-500 mt-1">Latest smartphones and accessories</p>
              </div>
              <Link href="/category/phones" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {phones.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Phones Category Carousel */}
          <CategoryCarousel 
            banners={categoryBanners.phones} 
            autoplaySpeed={6000}
          />
          
          {/* Electronics Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Electronics</h2>
                <p className="text-sm text-gray-500 mt-1">Top gadgets and devices</p>
              </div>
              <Link href="/category/electronics" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {electronics.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Electronics Category Carousel */}
          <CategoryCarousel 
            banners={categoryBanners.electronics} 
            autoplaySpeed={7000}
          />
          
          {/* Featured Brand Banners */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/official-stores" className="relative block h-[150px] rounded-lg overflow-hidden">
              <Image
                src="/images/banners/electronics-banner1.jpg"
                alt="LG Official Store"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover object-center rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="text-lg font-bold">LG Official Store</h3>
                </div>
              </div>
            </Link>
            <Link href="/official-stores" className="relative block h-[150px] rounded-lg overflow-hidden">
              <Image
                src="/images/banners/phones-banner2.jpg"
                alt="Tecno Official Store"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover object-center rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="text-lg font-bold">Tecno Official Store</h3>
                </div>
              </div>
            </Link>
            <Link href="/official-stores" className="relative block h-[150px] rounded-lg overflow-hidden">
              <Image
                src="/images/banners/phones-banner3.jpg"
                alt="Xiaomi Official Store"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                className="object-cover object-center rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent rounded-lg">
                <div className="absolute bottom-2 left-3 text-white">
                  <h3 className="text-lg font-bold">Xiaomi Official Store</h3>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Computing Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Computing</h2>
                <p className="text-sm text-gray-500 mt-1">Laptops, desktops & accessories</p>
              </div>
              <Link href="/category/computing" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {computing.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Computing Category Carousel */}
          <CategoryCarousel 
            banners={categoryBanners.computing} 
            autoplaySpeed={6000}
          />
          
          {/* Supermarket Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Supermarket</h2>
                <p className="text-sm text-gray-500 mt-1">Fresh groceries and everyday essentials</p>
              </div>
              <Link href="/category/supermarket" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {supermarket.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Supermarket Category Carousel */}
          <CategoryCarousel 
            banners={categoryBanners.supermarket} 
            autoplaySpeed={6000}
          />
          
          {/* Appliances Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Appliances</h2>
                <p className="text-sm text-gray-500 mt-1">Home and kitchen essentials</p>
              </div>
              <Link href="/category/appliances" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {appliances.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
          
          {/* Fashion Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Fashion</h2>
                <p className="text-sm text-gray-500 mt-1">Trending styles and outfits</p>
              </div>
              <Link href="/category/fashion" className="text-orange-500 hover:text-orange-600 transition-colors flex items-center text-sm font-medium">
                See All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {fashion.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
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