'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { toast } from 'react-hot-toast'
import { Loader2, Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'

interface ProductFormProps {
  initialProduct?: Product
  onSubmit: (product: Product) => void
  isEdit?: boolean
}

export default function ProductForm({ initialProduct, onSubmit, isEdit = false }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])

  // Initialize form with default values or provided product
  const [product, setProduct] = useState<Product>(
    initialProduct || {
      id: `prod_${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      image: '',
      additionalImages: [],
      category: '',
      brand: '',
      rating: 0,
      reviews: 0,
      stock: 0,
      stockStatus: 'in_stock',
      specifications: {},
      features: [],
      discountPercentage: 0,
      originalPrice: 0
    }
  )

  // Set image previews when initialProduct is provided (for edit mode)
  useEffect(() => {
    if (initialProduct) {
      if (initialProduct.image) {
        setMainImagePreview(initialProduct.image)
      }
      if (initialProduct.additionalImages && initialProduct.additionalImages.length > 0) {
        setAdditionalImagePreviews(initialProduct.additionalImages)
      }
    }
  }, [initialProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Handle numeric values
    if (name === 'price' || name === 'originalPrice' || name === 'stock' || name === 'rating' || name === 'reviews' || name === 'discountPercentage') {
      setProduct(prev => ({
        ...prev,
        [name]: value === '' ? 0 : Number(value)
      }))
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const featuresArray = e.target.value.split('\n').filter(feature => feature.trim() !== '')
    setProduct(prev => ({
      ...prev,
      features: featuresArray
    }))
  }

  const handleSpecificationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const specsText = e.target.value
      const specsLines = specsText.split('\n').filter(line => line.trim() !== '')
      
      const specs: Record<string, string> = {}
      specsLines.forEach(line => {
        const [key, value] = line.split(':').map(part => part.trim())
        if (key && value) {
          specs[key] = value
        }
      })
      
      setProduct(prev => ({
        ...prev,
        specifications: specs
      }))
    } catch (error) {
      console.error('Error parsing specifications:', error)
    }
  }

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setMainImagePreview(imageUrl)
        setProduct(prev => ({
          ...prev,
          image: imageUrl
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const newAdditionalImages = [...(product.additionalImages || []), imageUrl]
        setAdditionalImagePreviews(prev => [...prev, imageUrl])
        setProduct(prev => ({
          ...prev,
          additionalImages: newAdditionalImages
        }))
      }
      reader.readAsDataURL(file)
    }

    // Clear the input value to allow selecting the same file again
    e.target.value = ''
  }

  const removeAdditionalImage = (index: number) => {
    const newAdditionalImages = [...(product.additionalImages || [])]
    newAdditionalImages.splice(index, 1)
    
    setAdditionalImagePreviews(prev => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
    
    setProduct(prev => ({
      ...prev,
      additionalImages: newAdditionalImages
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!product.name || !product.description || !product.price || !product.category || !product.image) {
      toast.error('Please fill all required fields and upload a main product image')
      return
    }
    
    setIsLoading(true)
    
    try {
      // Submit the product
      await onSubmit(product)
      
      if (!isEdit) {
        // Reset form for new product
        setProduct({
          id: `prod_${Date.now()}`,
          name: '',
          description: '',
          price: 0,
          image: '',
          additionalImages: [],
          category: '',
          brand: '',
          rating: 0,
          reviews: 0,
          stock: 0,
          stockStatus: 'in_stock',
          specifications: {},
          features: [],
          discountPercentage: 0,
          originalPrice: 0
        })
        setMainImagePreview(null)
        setAdditionalImagePreviews([])
      }
      
      toast.success(isEdit ? 'Product updated successfully!' : 'Product added successfully!')
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (GHS) *
              </label>
              <input
                type="number"
                name="price"
                value={product.price || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Original Price (GHS)
              </label>
              <input
                type="number"
                name="originalPrice"
                value={product.originalPrice || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                required
              >
                <option value="">Select Category</option>
                <option value="phones">Phones & Tablets</option>
                <option value="computing">Computing</option>
                <option value="electronics">Electronics</option>
                <option value="fashion">Fashion</option>
                <option value="appliances">Appliances</option>
                <option value="supermarket">Supermarket</option>
                <option value="baby">Baby Products</option>
                <option value="sporting">Sporting Goods</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={product.brand || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status
              </label>
              <select
                name="stockStatus"
                value={product.stockStatus || 'in_stock'}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              >
                <option value="in_stock">In Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <input
                type="number"
                name="rating"
                value={product.rating || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reviews
              </label>
              <input
                type="number"
                name="reviews"
                value={product.reviews || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount %
              </label>
              <input
                type="number"
                name="discountPercentage"
                value={product.discountPercentage || ''}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Product Image *
            </label>
            <div className="flex items-center space-x-4">
              <div className="relative h-32 w-32 border-2 border-dashed border-gray-300 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center">
                {mainImagePreview ? (
                  <>
                    <Image
                      src={mainImagePreview}
                      alt="Product preview"
                      fill
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMainImagePreview(null)
                        setProduct(prev => ({ ...prev, image: '' }))
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer text-center p-2 text-sm text-gray-500">
                    <span>Upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {!mainImagePreview && (
                <div className="text-sm text-gray-500">
                  <p>Upload the main product image</p>
                  <p>Max size: 2MB</p>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Product Images
            </label>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {additionalImagePreviews.map((preview, index) => (
                <div key={index} className="relative h-24 w-full border border-gray-300 rounded-md overflow-hidden bg-gray-50">
                  <Image
                    src={preview}
                    alt={`Product view ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <div className="h-24 w-full border-2 border-dashed border-gray-300 rounded-md bg-gray-50 flex items-center justify-center">
                <label className="cursor-pointer text-center p-2">
                  <Plus size={24} className="mx-auto text-gray-400" />
                  <span className="text-xs text-gray-500">Add Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAdditionalImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500">Add up to 5 additional images showing different angles or details</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Features (One per line)
            </label>
            <textarea
              value={product.features.join('\n')}
              onChange={handleFeaturesChange}
              rows={4}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="4GB RAM&#10;128GB Storage&#10;48MP Camera"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specifications (Key: Value format, one per line)
            </label>
            <textarea
              value={
                Object.entries(product.specifications || {})
                  .map(([key, value]) => `${key}: ${value}`)
                  .join('\n')
              }
              onChange={handleSpecificationsChange}
              rows={5}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
              placeholder="Display: 6.7-inch OLED&#10;Battery: 5000mAh&#10;Processor: Snapdragon 8 Gen 1"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-orange-500 border border-transparent rounded-md text-sm font-medium text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:bg-orange-300 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center">
              <Loader2 size={16} className="animate-spin mr-2" />
              {isEdit ? 'Updating...' : 'Adding...'}
            </span>
          ) : (
            <span>{isEdit ? 'Update Product' : 'Add Product'}</span>
          )}
        </button>
      </div>
    </form>
  )
} 