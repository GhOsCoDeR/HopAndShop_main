'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import DarkModeTest from './components/DarkModeTest'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  BarChart,
  Moon,
  Sun,
  Database
} from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Initialize dark mode from localStorage
  useEffect(() => {
    setMounted(true)
    // Check if localStorage is available (client-side)
    if (typeof window !== 'undefined') {
      const savedDarkMode = localStorage.getItem('theme') === 'dark'
      setDarkMode(savedDarkMode)
      
      // Apply dark mode class to document
      if (savedDarkMode) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    }
  }, [])

  // Toggle dark mode function
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    
    // Save to localStorage and update document class
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
      
      if (newDarkMode) {
        document.documentElement.classList.add('dark-theme')
      } else {
        document.documentElement.classList.remove('dark-theme')
      }
    }
  }

  // Navigation items
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: <Package className="w-5 h-5" />,
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart className="w-5 h-5" />,
    },
    {
      name: 'Database',
      href: '/admin/database',
      icon: <Database className="w-5 h-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ]

  // Check if the current route is an admin page
  const isAdminPage = (path: string) => {
    // Routes that should have the admin layout
    return path.startsWith('/admin');
  };

  // Active link style
  const isActive = (path: string, pathname: string) => {
    if (path === '/admin' && pathname === '/admin') {
      return 'bg-primary/10 text-primary font-medium';
    }
    
    // For other paths, check if the current path starts with the navigation item path
    // This helps with highlighting parent items when in sub-routes
    return (pathname === path || (pathname.startsWith(path) && path !== '/admin'))
      ? 'bg-primary/10 text-primary font-medium'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/60';
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-lg transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Portal</h2>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive(item.href, pathname)}`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="absolute bottom-0 w-full border-t border-gray-200 dark:border-gray-800 p-4">
          <Link 
            href="/logout" 
            className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/60 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-200 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-900 p-4 shadow-sm flex justify-between items-center sticky top-0 z-10">
          {/* Menu Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6 bg-gray-100 dark:bg-gray-950 min-h-screen">
          {children}
        </main>
      </div>

      {/* Debug Component */}
      <DarkModeTest />
    </div>
  )
} 