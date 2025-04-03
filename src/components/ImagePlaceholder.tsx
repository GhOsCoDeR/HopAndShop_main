'use client'

import { useState, useEffect } from 'react'
import Image, { ImageProps } from 'next/image'

interface ImagePlaceholderProps extends Omit<ImageProps, 'src'> {
  src?: string
  type?: 'product' | 'banner' | 'icon' | 'logo' | 'category'
  categoryName?: string
}

export default function ImagePlaceholder({ 
  src, 
  alt = 'Image', 
  type = 'product', 
  categoryName,
  fill,
  width,
  height,
  className,
  priority,
  sizes,
  ...props 
}: ImagePlaceholderProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(src || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setImgSrc(src || null)
    setError(false)
    setIsLoading(true)
  }, [src])

  const handleError = () => {
    setError(true)
    let fallbackSrc = '/images/placeholder.jpg'
    
    if (type === 'product') {
      fallbackSrc = '/images/products/placeholder.jpg'
    } else if (type === 'category') {
      fallbackSrc = '/images/categories/placeholder.jpg'
    } else if (type === 'banner') {
      fallbackSrc = '/images/banners/placeholder.jpg'
    }
    
    setImgSrc(fallbackSrc)
  }

  const containerStyle = {
    position: 'relative' as const,
    width: fill ? '100%' : width,
    height: fill ? '100%' : height,
    minHeight: fill ? (type === 'banner' ? '200px' : '300px') : undefined,
  }

  const defaultSizes = fill 
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    : undefined

  if (!imgSrc) {
    return (
      <div 
        className={`
          ${fill ? 'w-full aspect-square' : ''}
          ${className || ''}
          bg-gray-100 animate-pulse
        `}
        style={containerStyle}
      />
    )
  }

  return (
    <div 
      className={`
        ${fill ? 'w-full aspect-square' : ''}
        ${className || ''}
      `}
      style={containerStyle}
    >
      <Image
        src={imgSrc}
        alt={alt}
        onError={handleError}
        fill={fill}
        width={!fill ? width || 300 : undefined}
        height={!fill ? height || 300 : undefined}
        sizes={sizes || defaultSizes}
        priority={priority || type === 'banner'}
        className={`
          ${fill ? 'object-cover object-center' : ''}
          ${isLoading ? 'blur-sm' : 'blur-0'}
          transition-all duration-300
        `}
        quality={85}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  )
} 