import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This is a mock settings storage
// In a real application, you would use a database
let settings = {
  notifications: {
    email: true,
    push: true,
    orderUpdates: true,
    promotions: false
  },
  payment: {
    stripeEnabled: true,
    paypalEnabled: true,
    defaultCurrency: 'USD'
  },
  shipping: {
    freeShippingThreshold: 50,
    defaultShippingCost: 5.99,
    enableInternational: true
  },
  store: {
    name: 'TechStore',
    email: 'support@techstore.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, Country',
    timezone: 'UTC',
    language: 'English'
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    requireStrongPassword: true
  }
}

export async function GET() {
  return NextResponse.json(settings)
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the settings structure
    const requiredSections = ['notifications', 'payment', 'shipping', 'store', 'security']
    const isValid = requiredSections.every(section => section in body)
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid settings structure' },
        { status: 400 }
      )
    }

    // Update settings
    settings = body

    return NextResponse.json(settings)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 