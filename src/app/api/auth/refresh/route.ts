import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifySession, createSession, removeSession } from '@/lib/auth'
import { findUserById } from '@/lib/db'
import { findServerUserById } from '@/lib/serverStorage'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      )
    }
    
    // Verify the existing session token
    const userId = verifySession(token)
    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Remove the old session
    removeSession(token)
    
    // Create a new session with a fresh expiration
    const newToken = createSession(userId)
    
    return NextResponse.json({
      success: true,
      token: newToken
    })
    
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 