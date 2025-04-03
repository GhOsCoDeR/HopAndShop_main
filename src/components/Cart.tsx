'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'

export default function Cart() {
  const cartStore = useCartStore()

  return (
    <AnimatePresence>
      {cartStore.isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={cartStore.toggleCart}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shopping Cart</h2>
              <button
                onClick={cartStore.toggleCart}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {cartStore.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cartStore.toggleCart}
                  className="mt-4 btn-primary"
                >
                  Continue Shopping
                </motion.button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {cartStore.items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
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
                        <p className="text-gray-600">${item.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() =>
                              cartStore.updateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              cartStore.updateQuantity(item.id, item.quantity + 1)
                            }
                            className="text-gray-500 hover:text-gray-700"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => cartStore.removeItem(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 border-t pt-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${cartStore.getTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between mb-6">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${cartStore.getTotal().toFixed(2)}</span>
                  </div>
                  <Link
                    href="/checkout"
                    className="block w-full bg-red-500 text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
} 