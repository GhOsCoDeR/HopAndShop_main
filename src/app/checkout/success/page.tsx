'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'

export default function SuccessPage() {
  const router = useRouter()
  const { clearCart } = useCartStore()

  useEffect(() => {
    // Clear the cart when the success page loads
    clearCart()

    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [clearCart, router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
          >
            <CheckCircleIcon className="w-12 h-12 text-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold mb-4"
          >
            Thank You for Your Order!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Your order has been successfully placed. We'll send you an email with your order details shortly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-500">
              You will be redirected to the home page in a few seconds...
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn-primary"
            >
              Return to Home
            </button>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
} 