'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { Product } from '@prisma/client'

interface WishlistContextType {
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  totalFavorites: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>([])

  useEffect(() => {
    // Load favorites from localStorage on mount
    const savedFavorites = localStorage.getItem('favorites')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  useEffect(() => {
    // Save favorites to localStorage whenever they change
    localStorage.setItem('favorites', JSON.stringify(favorites))
  }, [favorites])

  const addToFavorites = (product: Product) => {
    setFavorites(prev => [...prev, product])
  }

  const removeFromFavorites = (productId: string) => {
    setFavorites(prev => prev.filter(p => p.id !== productId))
  }

  const isFavorite = (productId: string) => {
    return favorites.some(p => p.id === productId)
  }

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        totalFavorites: favorites.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
} 