'use client'

import { useState, useEffect } from 'react'
import { WishlistProvider } from '@/context/WishlistContext'
import Header from '@/components/Header'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <WishlistProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 mt-2">
          {children}
        </main>
      </div>
    </WishlistProvider>
  )
} 