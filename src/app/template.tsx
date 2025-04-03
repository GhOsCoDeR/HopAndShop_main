'use client'

import { usePathname } from 'next/navigation'
import { Toaster } from 'react-hot-toast'

export default function Template({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  return (
    <>
      {children}
      <Toaster />
    </>
  )
} 