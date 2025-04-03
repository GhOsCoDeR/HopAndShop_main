'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline'

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void
}

interface PaymentData {
  cardNumber: string
  cardName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export default function PaymentForm({ onSubmit }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentData>({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  })

  const [errors, setErrors] = useState<Partial<PaymentData>>({})

  const validateForm = () => {
    const newErrors: Partial<PaymentData> = {}

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required'
    } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required'
    }

    if (!formData.expiryMonth.trim()) {
      newErrors.expiryMonth = 'Expiry month is required'
    } else if (!/^(0[1-9]|1[0-2])$/.test(formData.expiryMonth)) {
      newErrors.expiryMonth = 'Invalid month'
    }

    if (!formData.expiryYear.trim()) {
      newErrors.expiryYear = 'Expiry year is required'
    } else if (!/^\d{2}$/.test(formData.expiryYear)) {
      newErrors.expiryYear = 'Invalid year'
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'CVV is required'
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = 'Invalid CVV'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format card number with spaces
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }))
    // Clear error when user starts typing
    if (errors[name as keyof PaymentData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Payment Information</h2>
        <div className="flex items-center text-gray-500">
          <LockClosedIcon className="h-5 w-5 mr-1" />
          <span className="text-sm">Secure Payment</span>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="relative">
            <CreditCardIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className={`w-full pl-10 pr-3 py-2 border rounded-md ${
                errors.cardNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
          </div>
          {errors.cardNumber && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.cardNumber}
            </motion.p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cardholder Name
          </label>
          <input
            type="text"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="John Doe"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.cardName ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.cardName && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.cardName}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Month
            </label>
            <input
              type="text"
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              placeholder="MM"
              maxLength={2}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expiryMonth && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.expiryMonth}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Year
            </label>
            <input
              type="text"
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              placeholder="YY"
              maxLength={2}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.expiryYear ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.expiryYear && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.expiryYear}
              </motion.p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CVV
            </label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.cvv ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.cvv && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-1"
              >
                {errors.cvv}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="btn-primary w-full mt-6"
      >
        Place Order
      </motion.button>
    </motion.form>
  )
} 