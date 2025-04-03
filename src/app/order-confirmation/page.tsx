'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { CheckCircle2, Package, Truck, CreditCard, Home } from 'lucide-react'

interface OrderDetails {
  items: any[]
  orderNumber: string
  estimatedDelivery: string
}

export default function OrderConfirmationPage() {
  const router = useRouter()
  const cartStore = useCartStore()
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null)

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem('lastOrder')
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder))
    } else {
      router.push('/')
    }
  }, [router])

  if (!orderDetails) {
    return null
  }

  const subtotal = orderDetails.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0
  const total = subtotal + shipping

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase. We'll send you a confirmation email shortly.</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number</span>
                <span className="font-medium">{orderDetails.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Delivery</span>
                <span className="font-medium">{orderDetails.estimatedDelivery}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between text-lg pt-2 border-t">
                <span className="font-medium">Total</span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Package className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Track Your Order</p>
                  <p className="text-xs text-gray-500">Check your order status</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Shipping Updates</p>
                  <p className="text-xs text-gray-500">Get delivery notifications</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment Details</p>
                  <p className="text-xs text-gray-500">View payment information</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <Home className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Return Home</p>
                  <p className="text-xs text-gray-500">Continue shopping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={() => router.push('/')}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Return Home
            </button>
            <button
              onClick={() => router.push('/products')}
              className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 