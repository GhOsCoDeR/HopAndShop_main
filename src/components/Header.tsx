'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Search, User, Heart, HelpCircle, Store, Gift, CreditCard, ShoppingBag, ChevronDown, Phone, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useFavoritesStore } from '@/store/favoritesStore'
import { motion, AnimatePresence } from 'framer-motion'
import CartAnimation from './CartAnimation'
import { useRouter, usePathname } from 'next/navigation'
import { useClickAway } from '@/hooks/useClickAway'
import { toast } from 'react-hot-toast'
import { useWishlistStore } from '@/store/wishlistStore'
import { Product } from '@/types/product'
import { loadProducts, subscribeToProductUpdates } from '@/utils/productStorage'
import { useAuth } from '@/contexts/AuthContext'

interface SearchResult {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

interface CartAnimationProps {
  show: boolean
  productImage: string
}

export default function Header() {
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const { items: cartItems = [], addItem } = useCartStore()
  const { favorites = [] } = useFavoritesStore()
  const totalItems = cartItems?.length || 0
  const totalFavorites = favorites?.length || 0
  const [showCartAnimation, setShowCartAnimation] = useState(false)
  const [cartPosition, setCartPosition] = useState({ x: 0, y: 0 })
  const cartIconRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const menuRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const [lastAddedItem, setLastAddedItem] = useState<SearchResult | null>(null)
  const [cartAnimation, setCartAnimation] = useState<CartAnimationProps>({
    show: false,
    productImage: ''
  })
  const { items: wishlistItems } = useWishlistStore()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Load products for search
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load products from storage utility
      loadProducts().then(storedProducts => {
        if (Array.isArray(storedProducts)) {
          setAllProducts(storedProducts.map(product => ({
            ...product,
            id: String(product.id)
          })))
        }
      })
      
      // Subscribe to product updates
      const unsubscribe = subscribeToProductUpdates(async () => {
        const updatedProducts = await loadProducts()
        if (Array.isArray(updatedProducts)) {
          setAllProducts(updatedProducts.map(product => ({
            ...product,
            id: String(product.id)
          })))
          console.log('Header: Updated products from storage event')
        }
      })
      
      setIsMounted(true)
      if (cartIconRef.current) {
        const rect = cartIconRef.current.getBoundingClientRect()
        setCartPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
      
      // Clean up subscription
      return () => {
        unsubscribe()
      }
    }
  }, [])

  useClickAway(searchRef, () => {
    setIsSearchOpen(false)
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    
    const results = allProducts.filter(product =>
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(results)
    setIsSearchOpen(true)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim()) {
      const results = allProducts.filter(product =>
        (product.name || '').toLowerCase().includes(query.toLowerCase()) ||
        (product.description || '').toLowerCase().includes(query.toLowerCase())
      )
      setSearchResults(results)
      setIsSearchOpen(true)
    } else {
      setSearchResults([])
      setIsSearchOpen(false)
    }
  }

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
    }
  }

  const handleResultClick = (product: SearchResult) => {
    router.push(`/products/${product.id}`)
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
  }

  const handleAddToCart = (product: SearchResult) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    setCartAnimation({ show: true, productImage: product.image })
    setLastAddedItem(product)
    toast.success('Added to cart!')
  }

  useEffect(() => {
    if (cartAnimation.show) {
      const timer = setTimeout(() => {
        setCartAnimation({ show: false, productImage: '' })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [cartAnimation.show])

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchOpen(false)
  }

  const cartItemsCount = isMounted ? cartItems.reduce((total, item) => total + item.quantity, 0) : 0
  const wishlistItemsCount = isMounted ? wishlistItems.length : 0

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    closeMenu()
  }

  return (
    <header className="z-50 w-full">
      {/* Top Bar */}
      <div className="bg-orange-100 text-gray-600 py-1 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-xs">
            <Link href="/sell-on-hopandshop" className="hover:underline">Sell on Hop and Shop</Link>
          </div>
          <div className="flex space-x-4 text-xs">
            <Link href="/help" className="hover:underline flex items-center gap-1">
              <HelpCircle size={14} /> Help
            </Link>
            <Link href="#" className="hover:underline">
              Mobile App
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-orange-500 py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-12 gap-4 items-center">
          {/* Mobile Menu Toggle */}
          <div className="col-span-1 lg:hidden">
            <button 
              onClick={toggleMenu}
              className="p-2 text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center">
              <div className="text-white font-bold text-2xl tracking-tight">
                HOP & SHOP
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="col-span-8 lg:col-span-6">
            <div ref={searchRef} className="relative w-full">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search products, brands and categories"
                  className="w-full py-2 px-4 text-sm border-none rounded-l-md focus:outline-none"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={() => setIsSearchOpen(true)}
                />
                <button
                  type="submit"
                  className="bg-gray-800 text-white px-4 py-2 rounded-r-md hover:bg-gray-700 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {isSearchOpen && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-lg max-h-96 overflow-y-auto z-50"
                  >
                    <div className="p-4">
                      <div className="text-sm text-gray-500 mb-2">
                        Found {searchResults.length} results
                      </div>
                      <div className="space-y-2">
                        {searchResults.map((product) => (
                          <div
                            key={product.id}
                            onClick={() => handleResultClick(product)}
                            className="flex items-center gap-4 p-2 hover:bg-gray-50 cursor-pointer rounded-lg"
                          >
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-500">{product.description}</p>
                              <p className="text-orange-500 font-medium">${(product.price || 0).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Account & Cart */}
          <div className="hidden lg:flex col-span-4 items-center justify-end space-x-6 text-white">
            <div className="relative group">
              <button className="flex items-center space-x-1">
                <User className="h-5 w-5" />
                <span className="text-sm">{user ? `${user.firstName}` : 'Account'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                <div className="py-2">
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b">
                        {user.firstName} {user.lastName}
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        My Orders
                      </Link>
                      <Link href="/saved-items" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Saved Items
                      </Link>
                      {user.isAdmin && (
                        <Link href="/admin" className="block px-4 py-2 text-sm text-orange-600 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign In
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Create Account
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Orders
                      </Link>
                      <Link href="/saved-items" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Saved Items
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Link href="/help" className="flex items-center space-x-1">
              <HelpCircle className="h-5 w-5" />
              <span className="text-sm">Help</span>
            </Link>
            <Link href="/cart" className="flex items-center space-x-1">
              <div ref={cartIconRef} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="text-sm">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center overflow-x-auto py-3 space-x-8 text-sm font-medium text-gray-700 no-scrollbar">
            <Link href="/category/supermarket" className="whitespace-nowrap hover:text-orange-500">
              Supermarket
            </Link>
            <Link href="/category/phones" className="whitespace-nowrap hover:text-orange-500">
              Phones & Tablets
            </Link>
            <Link href="/category/electronics" className="whitespace-nowrap hover:text-orange-500">
              Electronics
            </Link>
            <Link href="/category/home" className="whitespace-nowrap hover:text-orange-500">
              Home & Office
            </Link>
            <Link href="/category/appliances" className="whitespace-nowrap hover:text-orange-500">
              Appliances
            </Link>
            <Link href="/category/fashion" className="whitespace-nowrap hover:text-orange-500">
              Fashion
            </Link>
            <Link href="/category/computing" className="whitespace-nowrap hover:text-orange-500">
              Computing
            </Link>
            <Link href="/category/health" className="whitespace-nowrap hover:text-orange-500">
              Health & Beauty
            </Link>
            <Link href="/category/gaming" className="whitespace-nowrap hover:text-orange-500">
              Gaming
            </Link>
            <Link href="/category/sporting" className="whitespace-nowrap hover:text-orange-500">
              Sporting Goods
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeMenu} />
            <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="font-bold text-xl text-orange-500">HOP & SHOP</div>
                <button onClick={closeMenu} className="p-2">
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <div className="py-2 px-4 border-b">
                  {user ? (
                    <div>
                      <div className="py-2 font-medium text-gray-900">
                        Hello, {user.firstName}
                      </div>
                      <Link href="/profile" className="flex items-center space-x-2 py-2" onClick={closeMenu}>
                        <User className="h-5 w-5 text-gray-600" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 py-2 text-red-600"
                      >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : (
                    <Link href="/login" className="flex items-center space-x-2 py-2" onClick={closeMenu}>
                      <User className="h-5 w-5 text-gray-600" />
                      <span>Sign In / Register</span>
                    </Link>
                  )}
                </div>
                <div className="py-4">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Categories</div>
                  <Link href="/category/supermarket" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Supermarket
                  </Link>
                  <Link href="/category/phones" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Phones & Tablets
                  </Link>
                  <Link href="/category/electronics" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Electronics
                  </Link>
                  <Link href="/category/home" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Home & Office
                  </Link>
                  <Link href="/category/appliances" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Appliances
                  </Link>
                  <Link href="/category/fashion" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Fashion
                  </Link>
                  <Link href="/category/computing" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Computing
                  </Link>
                  <Link href="/category/health" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Health & Beauty
                  </Link>
                </div>
                <div className="border-t py-4">
                  <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    My Orders
                  </Link>
                  <Link href="/saved-items" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Saved Items
                  </Link>
                  <Link href="/help" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Help Center
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 hover:bg-gray-100" onClick={closeMenu}>
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Animation */}
      {cartAnimation.show && (
      <CartAnimation
          isVisible={cartAnimation.show}
          productImage={cartAnimation.productImage}
        cartPosition={cartPosition}
      />
      )}
    </header>
  )
}