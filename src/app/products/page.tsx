'use client'

import { useState, useEffect, useMemo } from 'react'
import { Product } from '@/types/product'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import ProductCard from '@/components/ProductCard'

// Define the available categories to match those in ProductModal
const AVAILABLE_CATEGORIES = [
  'supermarket', 'Supermarket',
  'health', 'Health',
  'home', 'Home',
  'phones', 'Phones', 
  'computing', 'Computing',
  'electronics', 'Electronics',
  'fashion', 'Fashion',
  'gaming', 'Gaming',
  'appliances', 'Appliances',
  'sporting', 'Sporting'
]

// Get unique categories for filters
const getUniqueCategories = () => {
  // Use main categories from hierarchy instead of dynamically extracting
  const categoryHierarchy = [
    { main: 'phones', display: 'Phones & Tablets' },
    { main: 'computing', display: 'Computing' },
    { main: 'electronics', display: 'Electronics' },
    { main: 'appliances', display: 'Appliances' },
    { main: 'fashion', display: 'Fashion' },
    { main: 'home', display: 'Home & Office' },
    { main: 'supermarket', display: 'Supermarket' },
    { main: 'health', display: 'Health & Beauty' },
    { main: 'gaming', display: 'Gaming' },
    { main: 'sporting', display: 'Sports & Fitness' }
  ];
  
  // Map to the display names for the UI
  return categoryHierarchy.map(c => c.display);
};

// Get unique subcategories for a specific main category
const getSubcategories = (mainCategory: string): string[] => {
  // Define the subcategory hierarchy
  const categoryHierarchy = [
    {
      main: 'phones',
      display: 'Phones & Tablets',
      subcategories: [
        'Smartphones',
        'Feature Phones',
        'Tablets',
        'Smartwatches',
        'Phone Accessories',
        'Tablet Accessories',
        'Screen Protectors',
        'Phone Cases'
      ]
    },
    {
      main: 'computing',
      display: 'Computing',
      subcategories: [
        'Laptops',
        'Desktops',
        'Monitors',
        'Printers',
        'Computer Accessories',
        'Keyboards',
        'Mice',
        'Storage Devices',
        'Software'
      ]
    },
    {
      main: 'electronics',
      display: 'Electronics',
      subcategories: [
        'TVs',
        'Audio Equipment',
        'Speakers',
        'Headphones',
        'Cameras',
        'Video Games',
        'Gaming Consoles',
        'Smart Home Devices',
        'Projectors',
        'Streaming Devices'
      ]
    },
    {
      main: 'appliances',
      display: 'Appliances',
      subcategories: [
        'Refrigerators',
        'Washing Machines',
        'Microwaves',
        'Air Conditioners',
        'Fans',
        'Kitchen Appliances',
        'Blenders',
        'Coffee Makers',
        'Vacuum Cleaners',
        'Irons'
      ]
    },
    {
      main: 'fashion',
      display: 'Fashion',
      subcategories: [
        'Men\'s Clothing',
        'Women\'s Clothing',
        'Children\'s Clothing',
        'Shoes',
        'Bags',
        'Watches',
        'Jewelry',
        'Accessories',
        'Sportswear',
        'Traditional Wear'
      ]
    },
    {
      main: 'home',
      display: 'Home & Office',
      subcategories: [
        'Furniture',
        'Kitchen & Dining',
        'Bedding',
        'Bathroom',
        'Home Decor',
        'Office Furniture',
        'Office Supplies',
        'Stationery',
        'Lighting',
        'Rugs & Carpets'
      ]
    },
    {
      main: 'supermarket',
      display: 'Supermarket',
      subcategories: [
        'Food',
        'Beverages',
        'Baking & Cooking',
        'Canned & Packaged Foods',
        'Snacks',
        'Health Foods',
        'Household Supplies',
        'Personal Care',
        'Baby Products',
        'Pet Supplies'
      ]
    },
    {
      main: 'health',
      display: 'Health & Beauty',
      subcategories: [
        'Skincare',
        'Hair Care',
        'Makeup',
        'Fragrances',
        'Personal Care',
        'Health Care',
        'Vitamins & Supplements',
        'First Aid',
        'Medical Supplies',
        'Sexual Wellness'
      ]
    },
    {
      main: 'gaming',
      display: 'Gaming',
      subcategories: [
        'Video Games',
        'Gaming Consoles',
        'Gaming Accessories',
        'PC Gaming',
        'Gaming Laptops',
        'Gaming Chairs',
        'Gaming Headsets',
        'Gaming Keyboards',
        'Gaming Mice',
        'Gaming Controllers'
      ]
    },
    {
      main: 'sporting',
      display: 'Sports & Fitness',
      subcategories: [
        'Exercise Equipment',
        'Sportswear',
        'Team Sports',
        'Water Sports',
        'Camping & Hiking',
        'Cycling',
        'Fitness Accessories',
        'Outdoor Recreation',
        'Sports Accessories',
        'Gym Equipment'
      ]
    }
  ];
  
  // Find the entry for the selected main category
  const categoryEntry = categoryHierarchy.find(c => 
    c.main === mainCategory.toLowerCase() || 
    c.display === mainCategory
  );
  
  return categoryEntry?.subcategories || [];
};

// Helper function to map display category to main category key
const getMainCategoryKey = (displayCategory: string): string => {
  const categoryMap: Record<string, string> = {
    'Phones & Tablets': 'phones',
    'Computing': 'computing',
    'Electronics': 'electronics',
    'Appliances': 'appliances',
    'Fashion': 'fashion',
    'Home & Office': 'home',
    'Supermarket': 'supermarket',
    'Health & Beauty': 'health',
    'Gaming': 'gaming',
    'Sports & Fitness': 'sporting'
  };
  
  return categoryMap[displayCategory] || displayCategory.toLowerCase();
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
  const [sortOption, setSortOption] = useState('featured')
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Get available subcategories for selected category
  const availableSubcategories = selectedCategory ? 
    getSubcategories(getMainCategoryKey(selectedCategory)) : [];
  
  // Clear subcategory when main category changes
  useEffect(() => {
    setSelectedSubcategory('');
  }, [selectedCategory]);

  // Get all unique categories from products and ensure we include predefined categories
  const getUniqueCategoriesFromProducts = () => {
    const productCategories = [...new Set(products.map(p => p.category))]
    const allCategories = ['all', ...new Set([...productCategories, ...AVAILABLE_CATEGORIES])]
    return allCategories.filter(c => c !== '').sort()
  }

  // Compute categories whenever products change
  const categories = getUniqueCategoriesFromProducts()

  // Get products from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMounted(true)
      
      // Get products from localStorage
      const savedProducts = localStorage.getItem('products')
      
      if (savedProducts) {
        const allProducts = JSON.parse(savedProducts)
        setProducts(allProducts)
      }
      setIsLoading(false)
    }
  }, [])

  // Apply filters
  const filteredProducts = useMemo(() => {
    if (!products) return []
    
    return products.filter(product => {
      // Search query filter
      const matchesSearch = searchQuery === '' || 
        (product.name && product.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()))
      
      // Category filter
      let matchesCategory = true
      if (selectedCategory) {
        const mainCategoryKey = getMainCategoryKey(selectedCategory);
        matchesCategory = product.category === mainCategoryKey ||
                          product.category === selectedCategory;
      }
      
      // Subcategory filter
      let matchesSubcategory = true
      if (selectedSubcategory) {
        matchesSubcategory = product.subcategory === selectedSubcategory;
      }
      
      // Price range filter
      const matchesPrice = 
        (!product.price || product.price >= priceRange.min) && 
        (!product.price || product.price <= priceRange.max)
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice
    })
  }, [products, searchQuery, selectedCategory, selectedSubcategory, priceRange])

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">All Products</h1>
            
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <svg
                    className="h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filters
                </button>
                <div className="relative flex items-center">
                  <svg
                    className="absolute left-3 h-5 w-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4h13M3 8h9M3 12h5M3 16h7M3 20h11"
                    />
                  </svg>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 appearance-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-lg shadow-md mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Category Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap ${
                          selectedCategory === category
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subcategory Filter - Only show when a category is selected */}
                {selectedCategory && availableSubcategories.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Subcategories</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableSubcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          onClick={() => setSelectedSubcategory(subcategory)}
                          className={`px-4 py-2 rounded-full whitespace-nowrap ${
                            selectedSubcategory === subcategory
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Price Range</h3>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Min"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-500">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
} 