// 'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { CartItem } from '@/store/cartStore'

interface OrderSummaryProps {
  items: CartItem[]
  total: number
}

export default function OrderSummary({ items, total }: OrderSummaryProps) {
  const shipping = 5.99
  const tax = total * 0.1 // 10% tax
  const finalTotal = total + shipping + tax

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4"
          >
            <div className="relative w-20 h-20">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              <p className="text-gray-900 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax (10%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t pt-2">
          <span>Total</span>
          <span>${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>
          By placing your order, you agree to our Terms of Service and Privacy
          Policy.
        </p>
      </div>
    </motion.div>
  )
} 