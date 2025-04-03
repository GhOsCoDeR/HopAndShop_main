'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Only run on the client side
  useEffect(() => {
    setMounted(true)
    // Check if running in browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme')
      
      if (savedTheme === 'dark') {
        setTheme('dark')
        document.documentElement.classList.add('dark-theme')
      } else {
        setTheme('light')
        document.documentElement.classList.remove('dark-theme')
      }
    }
  }, [])

  const toggleTheme = () => {
    // Check if running in browser environment
    if (typeof window === 'undefined') return;

    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme)
    
    // Apply class to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }

  // Avoid SSR issues
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 