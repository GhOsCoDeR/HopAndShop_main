'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImagePlaceholder from './ImagePlaceholder'
import Image from 'next/image'

interface Banner {
  url: string
  alt: string
  link: string
}

interface CategoryCarouselProps {
  banners: Banner[]
  title?: string
  autoplaySpeed?: number
}

export default function CategoryCarousel({ 
  banners, 
  title, 
  autoplaySpeed = 5000 
}: CategoryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Handle autoplay
  const startAutoplay = () => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    
    if (!isHovered) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex(prevIndex => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        )
      }, autoplaySpeed)
    }
  }
  
  // Handle manual navigation
  const goToNextBanner = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === banners.length - 1 ? 0 : prevIndex + 1
    )
    startAutoplay()
  }
  
  const goToPrevBanner = () => {
    setCurrentIndex(prevIndex => 
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    )
    startAutoplay()
  }
  
  useEffect(() => {
    startAutoplay()
    
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current)
    }
  }, [isHovered])

  return (
    <div className="my-8">
      {title && (
        <h2 className="text-xl font-bold mb-4">{title}</h2>
      )}
      <div 
        className="relative rounded-md overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          startAutoplay()
        }}
      >
        <div className="relative w-full aspect-[21/9]">
          <Link href={banners[currentIndex].link}>
            <div className="w-full h-full relative">
              <Image
                src={banners[currentIndex].url}
                alt={banners[currentIndex].alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                className="object-cover object-center"
                priority={currentIndex === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{banners[currentIndex].alt}</h3>
                </div>
              </div>
            </div>
          </Link>
          
          {/* Carousel Controls */}
          <button 
            onClick={goToPrevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 shadow-md"
            aria-label="Previous banner"
          >
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          
          <button 
            onClick={goToNextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 shadow-md"
            aria-label="Next banner"
          >
            <ChevronRight className="h-6 w-6 text-gray-800" />
          </button>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index)
                  startAutoplay()
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-orange-500 scale-125' : 'bg-white'
                }`}
                aria-label={`Go to banner ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 