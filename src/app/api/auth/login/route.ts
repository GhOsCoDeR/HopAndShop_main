import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { findUserByEmail } from '@/lib/db'
import { createSession, verifyPassword } from '@/lib/auth'
import { findServerUserByEmail } from '@/lib/serverStorage'

// Mock admin user - in a real app, this would be in a database
const ADMIN_USER = {
  id: '1',
  email: 'admin@example.com',
  password: 'admin123', // In a real app, this would be hashed
  firstName: 'Admin',
  lastName: 'User',
  phone: '1234567890'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('Login attempt for:', email)

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Special case for admin user
    if (email === ADMIN_USER.email && password === ADMIN_USER.password) {
      console.log('Admin login successful')
      return NextResponse.json({
        id: ADMIN_USER.id,
        email: ADMIN_USER.email,
        firstName: ADMIN_USER.firstName,
        lastName: ADMIN_USER.lastName,
        phone: ADMIN_USER.phone,
        token: createSession(ADMIN_USER.id),
        isAdmin: true
      })
    }

    // First try server storage
    const serverUser = findServerUserByEmail(email)
    if (serverUser) {
      console.log('User found in server storage:', email)
      
      // TEMPORARY: For development purposes, accept any password for simplicity
      // Comment next line and uncomment password verification in production
      const isPasswordValid = true; // FOR DEVELOPMENT ONLY
      
      // For production, uncomment these lines to verify the password
      // const isPasswordValid = await verifyPassword(password, serverUser.password)
      // if (!isPasswordValid) {
      //   console.log('Invalid password for user:', email)
      //   return NextResponse.json(
      //     { error: 'Invalid credentials' },
      //     { status: 401 }
      //   )
      // }
      
      console.log('Login successful for user (server):', email)
      
      // Create a session token
      const token = createSession(serverUser.id)

      // Return user without password
      return NextResponse.json({
        id: serverUser.id,
        email: serverUser.email,
        firstName: serverUser.firstName,
        lastName: serverUser.lastName,
        phone: serverUser.phone,
        token
      })
    }
    
    // If not in server storage, try client storage as fallback
    const clientUser = findUserByEmail(email)
    if (clientUser) {
      console.log('User found in client storage:', email)
      console.log('Login successful for user (client):', email)
      
      // Create a session token
      const token = createSession(clientUser.id)

      // Return user without password
      return NextResponse.json({
        id: clientUser.id,
        email: clientUser.email,
        firstName: clientUser.firstName,
        lastName: clientUser.lastName,
        phone: clientUser.phone,
        token
      })
    }

    // User not found in either storage
    console.log('User not found in any storage:', email)
    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 