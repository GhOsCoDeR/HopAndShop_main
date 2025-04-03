export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  additionalImages?: string[]
  category: string
  subcategory?: string
  brand?: string
  rating: number
  numReviews: number
  inStock: boolean
  featured?: boolean
  specifications?: Record<string, string>
  features?: string[]
  createdAt?: string
  updatedAt?: string
  originalPrice?: number
  badge?: string
  discountPercentage?: number
  express?: boolean
  isTopDeal?: boolean
  isFlashSale?: boolean
} 