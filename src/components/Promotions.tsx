'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Percent, Gift, Truck, Shield } from 'lucide-react'

const promotions = [
  {
    id: 1,
    title: 'Free Shipping',
    description: 'On orders over $50',
    icon: Truck,
    color: 'bg-blue-500',
    link: '/shipping'
  },
  {
    id: 2,
    title: 'Secure Payment',
    description: '100% secure checkout',
    icon: Shield,
    color: 'bg-green-500',
    link: '/payment'
  },
  {
    id: 3,
    title: 'Special Offers',
    description: 'Up to 70% off',
    icon: Percent,
    color: 'bg-red-500',
    link: '/deals'
  },
  {
    id: 4,
    title: 'Gift Cards',
    description: 'Perfect for any occasion',
    icon: Gift,
    color: 'bg-purple-500',
    link: '/gift-cards'
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

export default function Promotions() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
          <p className="text-gray-600">Discover the benefits of shopping with MaxBuy</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {promotions.map((promo) => (
            <motion.div
              key={promo.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <Link href={promo.link} className="flex flex-col items-center text-center">
                <div className={`${promo.color} p-3 rounded-full mb-4`}>
                  <promo.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{promo.title}</h3>
                <p className="text-gray-600 mb-4">{promo.description}</p>
                <div className="flex items-center text-red-600 hover:text-red-700">
                  <span className="mr-2">Learn more</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 