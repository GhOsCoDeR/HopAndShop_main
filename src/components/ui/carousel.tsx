'use client'

import * as React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  autoplay?: boolean
  delay?: number
  loop?: boolean
}

export function Carousel({
  children,
  className,
  autoplay = true,
  delay = 5000,
  loop = true,
  ...props
}: CarouselProps) {
  return (
    <div className={cn('relative w-full', className)} {...props}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
        }}
        autoplay={autoplay ? {
          delay: delay,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
        } : false}
        loop={loop}
        className="w-full h-full"
      >
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null
          return <SwiperSlide>{child}</SwiperSlide>
        })}
        <div className="swiper-pagination absolute bottom-4 left-1/2 z-10 -translate-x-1/2" />
        <button className="swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white">
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button className="swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white">
          <ChevronRight className="h-6 w-6" />
        </button>
      </Swiper>
    </div>
  )
}

export function CarouselContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export function CarouselPrevious() {
  return (
    <button className="swiper-button-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white">
      <ChevronLeft className="h-6 w-6" />
    </button>
  )
}

export function CarouselNext() {
  return (
    <button className="swiper-button-next absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 text-gray-800 shadow-md hover:bg-white">
      <ChevronRight className="h-6 w-6" />
    </button>
  )
} 