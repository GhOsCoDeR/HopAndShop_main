'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import { CreditCard, Wallet, Phone, Building2, PiggyBank, ShoppingCart, CheckCircle2, Package, Truck, Home } from 'lucide-react'

type PaymentMethod = 'credit-card' | 'mobile-money' | 'bank-transfer' | 'paypal'

export default function CheckoutPage() {
  const router = useRouter()
  const cartStore = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit-card')
  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping')
  const [orderNumber] = useState(() => `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`)

  const subtotal = cartStore.items.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = 0 // Free shipping
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Here you would typically send the order to your backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Generate estimated delivery date
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + 3) // 3 days from now
      const formattedDelivery = estimatedDelivery.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })

      // Store order details in localStorage
      const orderDetails = {
        items: [...cartStore.items],
        orderNumber,
        estimatedDelivery: formattedDelivery
      }
      localStorage.setItem('lastOrder', JSON.stringify(orderDetails))
      
      // Clear the cart
      cartStore.clearCart()
      
      toast.success('Order placed successfully!')
      router.push('/order-confirmation')
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (cartStore.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
            <p className="mt-2 text-gray-500">Add some products to your cart to proceed with checkout.</p>
            <button
              onClick={() => router.push('/products')}
              className="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'shipping' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Shipping Details</p>
                <p className="text-xs text-gray-500">Enter your shipping information</p>
              </div>
            </div>
            <div className="w-24 h-0.5 bg-gray-200 mx-4"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === 'payment' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Payment</p>
                <p className="text-xs text-gray-500">Choose payment method</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-4">
                {cartStore.items.map((item) => (
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
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between mt-2 text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-medium">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="lg:col-span-1">
            {step === 'shipping' ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
                <form onSubmit={(e) => {
                  e.preventDefault()
                  setStep('payment')
                }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State/Province
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                  </div>
                </div>

                  <div className="grid grid-cols-2 gap-4">
                <div>
                      <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        id="zip"
                        name="zip"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="IT">Italy</option>
                        <option value="ES">Spain</option>
                        <option value="JP">Japan</option>
                        <option value="CN">China</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue to Payment
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                <div className="space-y-4">
                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`p-4 border rounded-lg flex items-center space-x-3 ${
                        paymentMethod === 'credit-card'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      <CreditCard className="w-6 h-6 text-indigo-600" />
                      <span className="text-sm font-medium">Credit Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mobile-money')}
                      className={`p-4 border rounded-lg flex items-center space-x-3 ${
                        paymentMethod === 'mobile-money'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      <Phone className="w-6 h-6 text-indigo-600" />
                      <span className="text-sm font-medium">Mobile Money</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bank-transfer')}
                      className={`p-4 border rounded-lg flex items-center space-x-3 ${
                        paymentMethod === 'bank-transfer'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      <PiggyBank className="w-6 h-6 text-indigo-600" />
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-4 border rounded-lg flex items-center space-x-3 ${
                        paymentMethod === 'paypal'
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-500'
                      }`}
                    >
                      <ShoppingCart className="w-6 h-6 text-indigo-600" />
                      <span className="text-sm font-medium">PayPal</span>
                    </button>
                </div>

                  {/* Payment Details Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {paymentMethod === 'credit-card' && (
                      <>
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                            name="cardNumber"
                            required
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                    </div>
                        <div className="grid grid-cols-2 gap-4">
                      <div>
                            <label htmlFor="expiry" className="block text-sm font-medium text-gray-700">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                              id="expiry"
                              name="expiry"
                              required
                          placeholder="MM/YY"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                              name="cvv"
                              required
                              placeholder="123"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                      </div>
                    </div>
                      </>
                )}

                    {paymentMethod === 'mobile-money' && (
                      <>
                  <div>
                          <label htmlFor="mobileProvider" className="block text-sm font-medium text-gray-700">
                            Mobile Money Provider
                          </label>
                          <select
                            id="mobileProvider"
                            name="mobileProvider"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="">Select provider</option>
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="vodafone">Vodafone Cash</option>
                            <option value="airteltigo">AirtelTigo Money</option>
                          </select>
                        </div>
                    <div>
                      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                            Mobile Number
                      </label>
                      <input
                        type="tel"
                        id="mobileNumber"
                            name="mobileNumber"
                            required
                            placeholder="Enter your mobile money number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </>
                    )}

                    {paymentMethod === 'bank-transfer' && (
                      <>
                        <div>
                          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                            Bank Name
                          </label>
                          <input
                            type="text"
                            id="bankName"
                            name="bankName"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                            Account Number
                          </label>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                    </div>
                        <div>
                          <label htmlFor="accountName" className="block text-sm font-medium text-gray-700">
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            id="accountName"
                            name="accountName"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                  </div>
                      </>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back to Shipping
                      </button>
                <button
                  type="submit"
                        disabled={isSubmitting}
                        className="flex-1 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                </button>
              </div>
            </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}