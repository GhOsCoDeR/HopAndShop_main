'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const categories = [
  {
    name: 'Phones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80',
    description: 'Latest smartphones and mobile devices',
    link: '/category/phones'
  },
  {
    name: 'Laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80',
    description: 'Powerful laptops for work and play',
    link: '/category/laptops'
  },
  {
    name: 'Speakers',
    image: 'https://images.unsplash.com/photo-1545454675-3531b5430135?auto=format&fit=crop&q=80',
    description: 'Premium audio experience',
    link: '/category/speakers'
  },
  {
    name: 'Phone Cases',
    image: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?auto=format&fit=crop&q=80',
    description: 'Protect your device in style',
    link: '/category/phone-cases'
  },
  {
    name: 'Contraceptives',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80',
    description: 'Health and wellness products',
    link: '/category/contraceptives'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80',
    description: 'Essential gadget accessories',
    link: '/category/accessories'
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
}

export default function FeaturedCategories() {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.link}
              className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-64 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-sm text-gray-200">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
} 