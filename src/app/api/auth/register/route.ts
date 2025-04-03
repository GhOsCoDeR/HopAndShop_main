import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createUser, findUserByEmail } from '@/lib/db'
import { hashPassword } from '@/lib/auth'
import { createSession } from '@/lib/auth'
import { createServerUser, findServerUserByEmail } from '@/lib/serverStorage'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, phone } = body
    
    console.log('Registration attempt for:', email)
    
    // Basic validation
    if (!email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }
    
    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }
    
    // Phone validation - relaxed for development
    const phoneRegex = /^\+?[0-9]{6,15}$/
    const sanitizedPhone = phone.replace(/[\s-]/g, '')
    if (!phoneRegex.test(sanitizedPhone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    }
    
    // Pre-check if email exists in server storage
    const existingServerUser = findServerUserByEmail(email)
    if (existingServerUser) {
      console.log('Email already in use (server):', email)
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }
    
    try {
      // Hash the password
      const hashedPassword = await hashPassword(password)
      
      // Save user to server storage
      const serverUser = createServerUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: sanitizedPhone
      })
      
      console.log('User registration successful (server):', serverUser.email)
      
      // Also save to client-side storage for persistence
      try {
        await createUser({
          email,
          password,
          firstName,
          lastName,
          phone: sanitizedPhone
        })
      } catch (clientError) {
        console.log('Note: Client-side storage failed, but server-side succeeded')
      }
      
      // Create a session token
      const token = createSession(serverUser.id)
      
      // Return success with token
      return NextResponse.json({
        message: 'User registered successfully',
        user: {
          id: serverUser.id,
          email: serverUser.email,
          firstName: serverUser.firstName,
          lastName: serverUser.lastName,
          phone: serverUser.phone,
          token
        }
      })
    } catch (err: any) {
      // Check if it's a duplicate email error
      if (err.message === 'Email already in use') {
        return NextResponse.json(
          { error: 'Email already in use' },
          { status: 409 }
        )
      }
      
      throw err // Re-throw for the outer catch block
    }
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 