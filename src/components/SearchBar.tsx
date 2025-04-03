'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: {
    category: string
    sort: string
    priceRange: { min: number; max: number }
    brand: string
  }) => void
  categories: string[]
  brands?: string[]
}

export default function SearchBar({
  onSearch,
  onFilterChange,
  categories,
  brands = [],
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [selectedBrand, setSelectedBrand] = useState('all')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleFilterChange = (
    type: 'category' | 'sort' | 'priceRange' | 'brand',
    value: any
  ) => {
    switch (type) {
      case 'category':
        setSelectedCategory(value)
        onFilterChange({
          category: value,
          sort: sortBy,
          priceRange,
          brand: selectedBrand,
        })
        break
      case 'sort':
        setSortBy(value)
        onFilterChange({
          category: selectedCategory,
          sort: value,
          priceRange,
          brand: selectedBrand,
        })
        break
      case 'priceRange':
        setPriceRange(value)
        onFilterChange({
          category: selectedCategory,
          sort: sortBy,
          priceRange: value,
          brand: selectedBrand,
        })
        break
      case 'brand':
        setSelectedBrand(value)
        onFilterChange({
          category: selectedCategory,
          sort: sortBy,
          priceRange,
          brand: value,
        })
        break
    }
  }

  return (
    <form onSubmit={handleSearch} className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex flex-wrap gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={selectedBrand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Brands</option>
            {brands.map((brand) => (
              <option key={brand} value={brand.toLowerCase()}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="min-price" className="text-sm text-gray-600">
            Min Price:
          </label>
          <input
            type="number"
            id="min-price"
            value={priceRange.min}
            onChange={(e) =>
              handleFilterChange('priceRange', {
                ...priceRange,
                min: Number(e.target.value),
              })
            }
            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="max-price" className="text-sm text-gray-600">
            Max Price:
          </label>
          <input
            type="number"
            id="max-price"
            value={priceRange.max}
            onChange={(e) =>
              handleFilterChange('priceRange', {
                ...priceRange,
                max: Number(e.target.value),
              })
            }
            className="w-24 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>
    </form>
  )
} 