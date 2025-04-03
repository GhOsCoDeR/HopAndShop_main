'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import FeaturedProducts from '@/components/FeaturedProducts'
import HotDeals from '@/components/HotDeals'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import ProductSection from '@/components/ProductSection'
import { dummyProducts } from '@/data/products'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <div className="container mx-auto px-4 py-8">
        <FeaturedProducts />
        <HotDeals />
        <ProductSection title="Latest Smartphones" products={dummyProducts.phones} category="phones" />
        <ProductSection title="Premium Laptops" products={dummyProducts.laptops} category="laptops" />
        <ProductSection title="Home Appliances" products={dummyProducts.appliances} category="appliances" />
        <ProductSection title="Smart TVs" products={dummyProducts.tvs} category="tvs" />
        <ProductSection title="Fashion & Accessories" products={dummyProducts.fashion} category="fashion" />
        <ProductSection title="Modern Furniture" products={dummyProducts.furniture} category="furniture" />
        <ProductSection title="Beauty & Personal Care" products={dummyProducts.beauty} category="beauty" />
        <ProductSection title="Sports & Fitness" products={dummyProducts.sports} category="sports" />
        <ProductSection title="Toys & Games" products={dummyProducts.toys} category="toys" />
        <ProductSection title="Books & Literature" products={dummyProducts.books} category="books" />
      </div>
      <Footer />
    </main>
  )
} 