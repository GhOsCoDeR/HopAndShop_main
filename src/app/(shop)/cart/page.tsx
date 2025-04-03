'use client'

import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'

export default function CartPage() {
  const cartStore = useCartStore()

  const subtotal = cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  if (cartStore.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-500">Add some products to your cart to see them here.</p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {cartStore.items.map((item) => (
              <li key={item.id} className="p-6 flex items-center">
                <div className="relative w-24 h-24">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                    <button
                      onClick={() => cartStore.removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="mt-2 flex items-center">
                    <button
                      onClick={() => cartStore.updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => cartStore.updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-lg font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block w-full bg-red-500 text-white text-center py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 