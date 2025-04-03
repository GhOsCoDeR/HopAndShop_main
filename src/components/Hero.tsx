'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Button } from '@/components/ui/button'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// Carousel data
const carouselBanners = [
  {
    id: 1,
    image: '/images/banners/electronics-sale.jpg',
    title: 'Electronics Sale',
    description: 'Up to 50% off on electronics',
    link: '/category/electronics',
    content: {
      title: 'Electronics Festival',
      subtitle: 'Save up to 50%',
      description: 'Huge discounts on top electronics brands',
      buttonText: 'Shop Now',
      buttonLink: '/category/electronics'
    }
  },
  {
    id: 2,
    image: '/images/banners/smartphones.jpg',
    title: 'Latest Smartphones',
    description: 'Discover amazing deals on the newest phones',
    link: '/category/phones',
    content: {
      title: 'Smartphone Sale',
      subtitle: 'Up to 40% Off',
      description: 'Get the latest smartphones at unbeatable prices',
      buttonText: 'View Deals',
      buttonLink: '/category/phones'
    }
  },
  {
    id: 3,
    image: '/images/banners/laptops.jpg',
    title: 'Computing Deals',
    description: 'Best deals on laptops and accessories',
    link: '/category/computing',
    content: {
      title: 'Computing Sale',
      subtitle: 'From $299',
      description: 'Amazing deals on laptops and accessories',
      buttonText: 'Shop Now',
      buttonLink: '/category/computing'
    }
  }
]

const promoBanners = [
  {
    id: 1,
    image: '/images/banners/fashion-sale.jpg',
    title: 'Fashion Sale',
    description: 'Up to 60% off on fashion',
    link: '/category/fashion',
    content: {
      title: 'Fashion Week',
      subtitle: '60% Off',
      description: 'Trendy fashion at amazing prices',
      buttonText: 'Shop Collection',
      buttonLink: '/category/fashion'
    }
  },
  {
    id: 2,
    image: '/images/banners/electronics-sale.jpg',
    title: 'Electronics Deals',
    description: 'Special offers on electronics',
    link: '/category/electronics',
    content: {
      title: 'Tech Deals',
      subtitle: 'Save Big',
      description: 'Latest gadgets at great prices',
      buttonText: 'View Deals',
      buttonLink: '/category/electronics'
    }
  },
  {
    id: 3,
    image: '/images/banners/laptops.jpg',
    title: 'Computing Sale',
    description: 'Best deals on laptops',
    link: '/category/computing',
    content: {
      title: 'Laptop Sale',
      subtitle: 'From $299',
      description: 'Amazing deals on laptops',
      buttonText: 'Shop Now',
      buttonLink: '/category/computing'
    }
  }
]

// Quick access category icons
const categoryIcons = [
  { name: "Supermarket", icon: "/images/icons/supermarket.svg", link: "/category/supermarket" },
  { name: "Health & Beauty", icon: "/images/icons/health.svg", link: "/category/health" },
  { name: "Home & Office", icon: "/images/icons/home.svg", link: "/category/home" },
  { name: "Phones & Tablets", icon: "/images/icons/phone.svg", link: "/category/phones" },
  { name: "Computing", icon: "/images/icons/computing.svg", link: "/category/computing" },
  { name: "Electronics", icon: "/images/icons/electronics.svg", link: "/category/electronics" },
  { name: "Fashion", icon: "/images/icons/fashion.svg", link: "/category/fashion" },
  { name: "Gaming", icon: "/images/icons/gaming.svg", link: "/category/gaming" },
  { name: "Appliances", icon: "/images/icons/appliances.svg", link: "/category/appliances" },
  { name: "Sporting Goods", icon: "/images/icons/sport.svg", link: "/category/sporting" },
]

// Organize banners by category
const electronicsBanners = [
  {
    id: 1,
    image: '/images/banners/electronics-banner1.jpg',
    title: 'Electronics Specials',
    description: 'Best electronics deals',
    link: '/category/electronics',
    content: {
      title: 'Electronics Sale',
      subtitle: 'Save Big',
      description: 'Amazing deals on electronics',
      buttonText: 'View Deals',
      buttonLink: '/category/electronics'
    }
  },
  {
    id: 2,
    image: '/images/banners/electronics-sale.jpg',
    title: 'Electronics Festival',
    description: 'Special offers on electronics',
    link: '/category/electronics',
    content: {
      title: 'Tech Deals',
      subtitle: 'Save up to 50%',
      description: 'Latest gadgets at great prices',
      buttonText: 'Shop Now',
      buttonLink: '/category/electronics'
    }
  }
]

const computingBanners = [
  {
    id: 1,
    image: '/images/banners/computing-banner1.jpg',
    title: 'Computing Week',
    description: 'Special computing deals',
    link: '/category/computing',
    content: {
      title: 'Computing Sale',
      subtitle: 'From $299',
      description: 'Premium laptops at great prices',
      buttonText: 'Shop Now',
      buttonLink: '/category/computing'
    }
  },
  {
    id: 2,
    image: '/images/banners/laptops.jpg',
    title: 'Laptop Deals',
    description: 'Amazing laptop offers',
    link: '/category/computing',
    content: {
      title: 'Laptop Sale',
      subtitle: 'Up to 40% Off',
      description: 'Best deals on top laptop brands',
      buttonText: 'View Deals',
      buttonLink: '/category/computing'
    }
  }
]

const fashionBanners = [
  {
    id: 1,
    image: '/images/banners/fashion-banner1.jpg',
    title: 'Fashion Deals',
    description: 'Trendy fashion at great prices',
    link: '/category/fashion',
    content: {
      title: 'Fashion Sale',
      subtitle: '60% Off',
      description: 'Latest fashion trends',
      buttonText: 'Shop Collection',
      buttonLink: '/category/fashion'
    }
  },
  {
    id: 2,
    image: '/images/banners/fashion-sale.jpg',
    title: 'Fashion Week',
    description: 'Up to 60% off on fashion',
    link: '/category/fashion',
    content: {
      title: 'Fashion Festival',
      subtitle: 'Save up to 60%',
      description: 'Trendy fashion at amazing prices',
      buttonText: 'Shop Now',
      buttonLink: '/category/fashion'
    }
  }
]

export default function Hero() {
  return (
    <section className="relative bg-gray-50 py-4">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-4">
          {/* Main Carousel */}
          <div className="lg:col-span-3">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              className="rounded-lg overflow-hidden"
            >
              {carouselBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative h-[400px]">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      priority={banner.id === 1}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 66vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                      <div className="absolute bottom-8 left-8 text-white">
                        <h2 className="text-3xl font-bold mb-2">{banner.content.title}</h2>
                        <p className="text-xl mb-4">{banner.content.subtitle}</p>
                        <p className="text-lg mb-6">{banner.content.description}</p>
                        <Link href={banner.content.buttonLink}>
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                            {banner.content.buttonText}
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Promo Banners */}
          <div className="lg:col-span-1 grid gap-4">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              className="w-full h-full"
            >
              {promoBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <Link href={banner.link} className="block relative h-[190px]">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                      className="object-cover"
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold mb-1">{banner.content.title}</h3>
                        <p className="text-white/90">{banner.content.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
        
        {/* Quick Category Access Icons */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Categories</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categoryIcons.map((category, index) => (
              <Link 
                key={index} 
                href={category.link}
                className="flex flex-col items-center p-3 hover:bg-orange-50 rounded-lg transition-colors group"
              >
                <div className="w-12 h-12 relative mb-2 group-hover:scale-110 transition-transform">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="text-xs text-center line-clamp-2 group-hover:text-orange-500 transition-colors">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Category Banners Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Electronics Banner */}
          <div className="relative">
            <h3 className="text-xl font-semibold mb-4">Electronics Deals</h3>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={false}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              className="w-full rounded-lg overflow-hidden"
            >
              {electronicsBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative h-[300px]">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{banner.content.title}</h3>
                        <p className="text-lg text-white/90 mb-2">{banner.content.subtitle}</p>
                        <p className="text-sm text-white/80 mb-4">{banner.content.description}</p>
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-orange-500 hover:text-white border-white transition-colors">
                          <Link href={banner.link}>
                            {banner.content.buttonText}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Computing Banner */}
          <div className="relative">
            <h3 className="text-xl font-semibold mb-4">Computing Deals</h3>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={false}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              className="w-full rounded-lg overflow-hidden"
            >
              {computingBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative h-[300px]">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{banner.content.title}</h3>
                        <p className="text-lg text-white/90 mb-2">{banner.content.subtitle}</p>
                        <p className="text-sm text-white/80 mb-4">{banner.content.description}</p>
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-orange-500 hover:text-white border-white transition-colors">
                          <Link href={banner.link}>
                            {banner.content.buttonText}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Fashion Banner */}
          <div className="relative">
            <h3 className="text-xl font-semibold mb-4">Fashion Deals</h3>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={0}
              slidesPerView={1}
              navigation={false}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              loop={true}
              className="w-full rounded-lg overflow-hidden"
            >
              {fashionBanners.map((banner) => (
                <SwiperSlide key={banner.id}>
                  <div className="relative h-[300px]">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-6 left-6 text-white">
                        <h3 className="text-xl font-bold mb-2">{banner.content.title}</h3>
                        <p className="text-lg text-white/90 mb-2">{banner.content.subtitle}</p>
                        <p className="text-sm text-white/80 mb-4">{banner.content.description}</p>
                        <Button asChild variant="outline" className="bg-white text-black hover:bg-orange-500 hover:text-white border-white transition-colors">
                          <Link href={banner.link}>
                            {banner.content.buttonText}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  )
} 