import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/product'

interface FavoritesStore {
  favorites: Product[]
  addToFavorites: (product: Product) => void
  removeFromFavorites: (productId: string) => void
  isFavorite: (productId: string) => boolean
  totalFavorites: number
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addToFavorites: (product) => {
        set((state) => ({
          favorites: [...state.favorites, product],
        }))
      },
      removeFromFavorites: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((p) => p.id !== productId),
        }))
      },
      isFavorite: (productId) => {
        return get().favorites.some((p) => p.id === productId)
      },
      get totalFavorites() {
        return get().favorites.length
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
) 