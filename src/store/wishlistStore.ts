import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/product'

interface WishlistStore {
  items: Product[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addToWishlist: (product) => {
        set((state) => ({
          items: [...state.items, product]
        }))
      },
      removeFromWishlist: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId)
        }))
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId)
      }
    }),
    {
      name: 'wishlist-storage'
    }
  )
) 