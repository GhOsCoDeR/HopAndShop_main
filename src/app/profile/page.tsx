'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Phone, Mail, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect to login if not logged in
    if (mounted && !user) {
      router.push('/login')
    }
  }, [mounted, user, router])

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  if (!mounted || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account details and preferences</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-orange-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-white text-orange-500 flex items-center justify-center">
              <User size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="opacity-75">{user.email}</p>
              {user.isAdmin && (
                <span className="inline-block mt-2 px-3 py-1 bg-white text-orange-600 rounded-full text-xs font-medium">
                  Administrator
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 divide-y divide-gray-200">
          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium w-32">Full Name:</span>
                <span>{user.firstName} {user.lastName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium w-32">Email:</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-gray-400" />
                <span className="font-medium w-32">Phone:</span>
                <span>{user.phone || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <div className="py-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Link 
                href="/orders"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
              >
                View Orders
              </Link>
              <Link 
                href="/saved-items"
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded flex items-center justify-center"
              >
                Saved Items
              </Link>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium py-2 px-4 rounded flex items-center justify-center"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="py-4">
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full sm:w-auto bg-red-100 hover:bg-red-200 text-red-700 font-medium py-2 px-4 rounded"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 