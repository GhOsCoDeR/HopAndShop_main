'use client'

import { useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { cleanupSessions, updateSessionActivity } from '@/lib/auth'

// This is a hidden component that manages sessions
export default function SessionManager() {
  const { user, restoreSession } = useAuth()
  
  // Try to restore session if needed
  const attemptSessionRestore = useCallback(async () => {
    if (!user) {
      console.log('Attempting to restore session...')
      const success = await restoreSession()
      if (success) {
        console.log('Session restored successfully')
      }
    }
  }, [user, restoreSession])
  
  useEffect(() => {
    // Clean up expired sessions on mount
    cleanupSessions()
    
    // Attempt to restore session
    attemptSessionRestore()
    
    // Set up activity tracking
    const handleUserActivity = () => {
      updateSessionActivity()
    }
    
    // Track user activity
    window.addEventListener('click', handleUserActivity)
    window.addEventListener('keydown', handleUserActivity)
    window.addEventListener('mousemove', handleUserActivity)
    window.addEventListener('scroll', handleUserActivity)
    
    // Set up periodic cleanup
    const cleanupInterval = setInterval(() => {
      cleanupSessions()
    }, 60 * 60 * 1000) // Every hour
    
    // Try to restore session on visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        attemptSessionRestore()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('click', handleUserActivity)
      window.removeEventListener('keydown', handleUserActivity)
      window.removeEventListener('mousemove', handleUserActivity)
      window.removeEventListener('scroll', handleUserActivity)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearInterval(cleanupInterval)
    }
  }, [attemptSessionRestore])
  
  // The component doesn't render anything visible
  return null
} 