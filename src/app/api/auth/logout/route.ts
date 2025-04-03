import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { removeSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (token) {
      // Properly remove the session server-side
      removeSession(token)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 