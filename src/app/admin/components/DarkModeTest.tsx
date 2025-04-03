'use client'

import { useState, useEffect } from 'react'

export default function DarkModeTest() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Check initial dark mode state
    if (typeof window !== 'undefined') {
      const checkDarkMode = () => {
        const darkModeActive = 
          document.documentElement.classList.contains('dark-theme') || 
          localStorage.getItem('theme') === 'dark'
        setIsDarkMode(darkModeActive)
      }
      
      // Check initially
      checkDarkMode()
      
      // Set up an observer to watch for class changes
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
            checkDarkMode()
          }
        })
      })
      
      observer.observe(document.documentElement, { attributes: true })
      
      return () => {
        observer.disconnect()
      }
    }
  }, [])

  // Avoid hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div 
      className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 
                 shadow-lg rounded-lg p-3 z-50 border dark:border-gray-700"
    >
      <p className="text-sm font-medium">
        Dark Mode: {' '}
        <span className={isDarkMode ? 'text-green-500' : 'text-red-500'}>
          {isDarkMode ? 'ON' : 'OFF'}
        </span>
      </p>
    </div>
  )
} 