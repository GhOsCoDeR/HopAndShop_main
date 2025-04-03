'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'

const categories = [
  {
    name: 'Computers & Tablets',
    subcategories: [
      { name: 'Laptops', href: '/products?category=laptops' },
      { name: 'Desktops', href: '/products?category=desktops' },
      { name: 'Tablets', href: '/products?category=tablets' },
      { name: 'Monitors', href: '/products?category=monitors' },
    ],
  },
  {
    name: 'Audio',
    subcategories: [
      { name: 'Headphones', href: '/products?category=headphones' },
      { name: 'Speakers', href: '/products?category=speakers' },
      { name: 'Microphones', href: '/products?category=microphones' },
    ],
  },
  {
    name: 'Smartphones',
    subcategories: [
      { name: 'Android', href: '/products?category=android' },
      { name: 'iPhone', href: '/products?category=iphone' },
      { name: 'Accessories', href: '/products?category=phone-accessories' },
    ],
  },
]

export default function Navigation() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const isOpen = useCartStore((state) => state.isOpen)
  const toggleCart = useCartStore((state) => state.toggleCart)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement search functionality
    console.log('Searching for:', searchQuery)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary">
            TechStore
          </Link>

          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <button className="text-gray-700 hover:text-primary font-medium">
                  {category.name}
                </button>
                <AnimatePresence>
                  {activeCategory === category.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-48 bg-white shadow-lg rounded-md py-2 z-50"
                    >
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Search and Cart */}
          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary"
                >
                  <svg
                    className="w-5 h-5"
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
                </button>
              </div>
            </form>

            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-700 hover:text-primary"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
} 