'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { Mail } from 'lucide-react'
import { verifyCode } from '@/lib/verification'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

const verificationSchema = z.object({
  code: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
})

type EmailFormData = z.infer<typeof emailSchema>
type VerificationFormData = z.infer<typeof verificationSchema>

export default function VerifyEmailPage() {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(false)
  const [showVerificationInput, setShowVerificationInput] = useState(false)
  const [email, setEmail] = useState('')

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isValid: isEmailValid },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  })

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    mode: 'onChange',
  })

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsVerifying(true)
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setEmail(data.email)
      setShowVerificationInput(true)
      toast.success('Verification code sent to your email! (Demo code: 123456)')
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const onSubmitCode = (data: VerificationFormData) => {
    // Use demo code 123456
    if (data.code === '123456') {
      // Store email in session storage for the checkout process
      sessionStorage.setItem('verifiedEmail', email)
      router.push('/checkout')
    } else {
      toast.error('Invalid verification code. Please use: 123456')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center mb-8">
            <Mail className="mx-auto h-12 w-12 text-indigo-600" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your email address to receive a verification code
            </p>
          </div>

          {!showVerificationInput ? (
            <form onSubmit={handleEmailSubmit(onSubmitEmail)} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...registerEmail('email')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
                {emailErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{emailErrors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isVerifying || !isEmailValid}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isVerifying ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit(onSubmitCode)} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="code"
                  {...registerCode('code')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter 6-digit code"
                />
                {codeErrors.code && (
                  <p className="mt-1 text-sm text-red-600">{codeErrors.code.message}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Please check your email for the verification code. The code will expire in 5 minutes.
                </p>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Verify Code
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
} 