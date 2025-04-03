'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Plus, Trash2, X } from 'lucide-react'
import Image from 'next/image'

interface ProductFormData {
  name: string
  description: string
  price: number
  category: string
  stock: number
  image: File | null
  imagePreview: string
  additionalImages: string[]
}

export default function AddProductForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: null,
    imagePreview: '',
    additionalImages: []
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      })
    }
  }

  const removeImage = () => {
    setFormData({
      ...formData,
      image: null,
      imagePreview: '',
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setMainImagePreview(imageUrl)
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: imageUrl
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        const newAdditionalImages = [...formData.additionalImages, imageUrl]
        setAdditionalImagePreviews(prev => [...prev, imageUrl])
        setFormData(prev => ({
          ...prev,
          additionalImages: newAdditionalImages
        }))
      }
      reader.readAsDataURL(file)
    }
    e.target.value = ''
  }

  const removeAdditionalImage = (index: number) => {
    const newAdditionalImages = [...formData.additionalImages]
    newAdditionalImages.splice(index, 1)
    
    setAdditionalImagePreviews(prev => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
    
    setFormData(prev => ({
      ...prev,
      additionalImages: newAdditionalImages
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('stock', formData.stock.toString())
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }
      
      // Add additional images to form data
      if (formData.additionalImages.length > 0) {
        formDataToSend.append('additionalImages', JSON.stringify(formData.additionalImages))
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error('Failed to create product')
      }

      router.push('/admin/products')
      router.refresh()
    } catch (error) {
      console.error('Error creating product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Add New Product</h3>
        <form onSubmit={handleSubmit} className="mt-5 space-y-6">
          {/* Image Upload */}
          <div className="mb-4">
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
                        setFormData(prev => ({ 
                          ...prev, 
                          image: null,
                          imagePreview: ''
                        }))
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
                      onChange={handleImageUpload}
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

          {/* Additional Product Images */}
          <div className="mb-4">
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
                    onChange={handleAdditionalImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <p className="text-xs text-gray-500">Add up to 5 additional images showing different angles or product details</p>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                required
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="mt-1 block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a category</option>
              <option value="electronics">Electronics</option>
              <option value="computers">Computers</option>
              <option value="smartphones">Smartphones</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              id="stock"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                'Adding...'
              ) : (
                <>
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 