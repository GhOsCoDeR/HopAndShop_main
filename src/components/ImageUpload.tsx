'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'

interface ImageUploadProps {
  currentImage?: string
  onImageChange: (file: File) => void
  onImageRemove?: () => void
}

export default function ImageUpload({ currentImage, onImageChange, onImageRemove }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onImageChange(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onImageRemove?.()
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
        {preview ? (
          <>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Upload className="w-8 h-8 mb-2" />
            <span className="text-sm">Upload Image</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
      <p className="text-sm text-gray-500">
        Click to upload or drag and drop
      </p>
    </div>
  )
} 