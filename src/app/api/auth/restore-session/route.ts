import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createSession } from '@/lib/auth'
import { findUserById, findUserByEmail } from '@/lib/db'
import { findServerUserById, findServerUserByEmail } from '@/lib/serverStorage'

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()
    
    if (!userId && !email) {
      return NextResponse.json(
        { error: 'User ID or email is required' },
        { status: 400 }
      )
    }
    
    // Try to find the user by ID first
    let user = null
    if (userId) {
      user = findServerUserById(userId) || findUserById(userId)
    }
    
    // If not found by ID, try by email
    if (!user && email) {
      user = findServerUserByEmail(email) || findUserByEmail(email)
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Create a new session
    const token = createSession(user.id)
    
    // Remove sensitive info before sending
    const { password, ...userWithoutPassword } = user
    
    // Special case for admin
    const isAdmin = user.email === 'admin@example.com'
    
    return NextResponse.json({
      ...userWithoutPassword,
      token,
      isAdmin
    })
    
  } catch (error) {
    console.error('Session restoration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 