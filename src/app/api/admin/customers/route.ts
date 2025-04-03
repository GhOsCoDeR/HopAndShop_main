import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    // Read orders data
    const ordersPath = path.join(process.cwd(), 'public/data/orders.json')
    const ordersData = JSON.parse(fs.readFileSync(ordersPath, 'utf8'))

    // Process orders to get customer data
    const customerMap = new Map()

    ordersData.forEach((order: any) => {
      const customerId = order.customerId
      if (!customerMap.has(customerId)) {
        customerMap.set(customerId, {
          id: customerId,
          name: order.customerName || 'Unknown Customer',
          email: order.customerEmail || 'No email',
          phone: order.customerPhone || 'No phone',
          address: order.shippingAddress || 'No address',
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: new Date(order.date).toLocaleDateString()
        })
      }

      const customer = customerMap.get(customerId)
      customer.totalOrders++
      customer.totalSpent += order.total
      customer.lastOrder = new Date(order.date).toLocaleDateString()
    })

    // Convert map to array and sort by total spent
    const customers = Array.from(customerMap.values())
      .sort((a, b) => b.totalSpent - a.totalSpent)

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    )
  }
} 