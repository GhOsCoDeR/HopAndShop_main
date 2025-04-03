import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading JSON file:', error)
    return null
  }
}

// Helper function to calculate period-over-period change
const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0
  return ((current - previous) / previous) * 100
}

// Helper function to get date range for comparison
const getDateRange = (timeRange: string, isPrevious: boolean = false) => {
  const now = new Date()
  let start: Date
  let end: Date

  switch (timeRange) {
    case 'week':
      start = new Date(now)
      start.setDate(start.getDate() - (isPrevious ? 14 : 7))
      end = new Date(now)
      end.setDate(end.getDate() - (isPrevious ? 7 : 0))
      break
    case 'month':
      start = new Date(now)
      start.setDate(start.getDate() - (isPrevious ? 60 : 30))
      end = new Date(now)
      end.setDate(end.getDate() - (isPrevious ? 30 : 0))
      break
    case 'year':
      start = new Date(now)
      start.setMonth(start.getMonth() - (isPrevious ? 24 : 12))
      end = new Date(now)
      end.setMonth(end.getMonth() - (isPrevious ? 12 : 0))
      break
    default:
      start = new Date(now)
      start.setDate(start.getDate() - 30)
      end = new Date(now)
  }

  return { start, end }
}

export async function GET(request: Request) {
  try {
    // Get time range from query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || 'month'

    // Read orders data
    const ordersPath = path.join(process.cwd(), 'public/data/orders.json')
    const orders = readJsonFile(ordersPath) || []

    // Read products data
    const productsPath = path.join(process.cwd(), 'public/data/products.json')
    const products = readJsonFile(productsPath) || []

    // Get current and previous period date ranges
    const currentPeriod = getDateRange(timeRange)
    const previousPeriod = getDateRange(timeRange, true)

    // Filter orders for current and previous periods
    const currentOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.date)
      return orderDate >= currentPeriod.start && orderDate <= currentPeriod.end
    })

    const previousOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.date)
      return orderDate >= previousPeriod.start && orderDate <= previousPeriod.end
    })

    // Calculate statistics for current period
    const currentTotalRevenue = currentOrders.reduce((sum: number, order: any) => sum + order.total, 0)
    const currentTotalOrders = currentOrders.length
    const currentAverageOrderValue = currentTotalOrders > 0 ? currentTotalRevenue / currentTotalOrders : 0
    const currentTotalCustomers = new Set(currentOrders.map((order: any) => order.customerId)).size

    // Calculate statistics for previous period
    const previousTotalRevenue = previousOrders.reduce((sum: number, order: any) => sum + order.total, 0)
    const previousTotalOrders = previousOrders.length
    const previousAverageOrderValue = previousTotalOrders > 0 ? previousTotalRevenue / previousTotalOrders : 0
    const previousTotalCustomers = new Set(previousOrders.map((order: any) => order.customerId)).size

    // Calculate period-over-period changes
    const revenueChange = calculateChange(currentTotalRevenue, previousTotalRevenue)
    const ordersChange = calculateChange(currentTotalOrders, previousTotalOrders)
    const aovChange = calculateChange(currentAverageOrderValue, previousAverageOrderValue)
    const customersChange = calculateChange(currentTotalCustomers, previousTotalCustomers)

    // Generate chart data based on time range
    const now = new Date()
    let labels: string[] = []
    let revenueData: number[] = []
    let ordersData: number[] = []

    switch (timeRange) {
      case 'week':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }))
          
          const dayOrders = currentOrders.filter((order: any) => {
            const orderDate = new Date(order.date)
            return orderDate.toDateString() === date.toDateString()
          })
          
          revenueData.push(dayOrders.reduce((sum: number, order: any) => sum + order.total, 0))
          ordersData.push(dayOrders.length)
        }
        break
      case 'month':
        // Last 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now)
          date.setDate(date.getDate() - i)
          labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
          
          const dayOrders = currentOrders.filter((order: any) => {
            const orderDate = new Date(order.date)
            return orderDate.toDateString() === date.toDateString()
          })
          
          revenueData.push(dayOrders.reduce((sum: number, order: any) => sum + order.total, 0))
          ordersData.push(dayOrders.length)
        }
        break
      case 'year':
        // Last 12 months
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now)
          date.setMonth(date.getMonth() - i)
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }))
          
          const monthOrders = currentOrders.filter((order: any) => {
            const orderDate = new Date(order.date)
            return orderDate.getMonth() === date.getMonth() && 
                   orderDate.getFullYear() === date.getFullYear()
          })
          
          revenueData.push(monthOrders.reduce((sum: number, order: any) => sum + order.total, 0))
          ordersData.push(monthOrders.length)
        }
        break
    }

    // Calculate order status distribution
    const statusCounts = currentOrders.reduce((acc: { [key: string]: number }, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})

    const statusColors: { [key: string]: string } = {
      delivered: '#10B981',
      processing: '#3B82F6',
      pending: '#F59E0B',
      shipped: '#8B5CF6'
    }

    const orderStatusData = {
      labels: Object.keys(statusCounts),
      data: Object.values(statusCounts),
      colors: Object.keys(statusCounts).map(status => statusColors[status] || '#6B7280')
    }

    // Get top products
    const productSales = products.map((product: any) => {
      const productOrders = currentOrders.filter((order: any) => 
        order.items.some((item: any) => item.productId === product.id)
      )
      const totalSold = productOrders.reduce((sum: number, order: any) => {
        const item = order.items.find((item: any) => item.productId === product.id)
        return sum + (item ? item.quantity : 0)
      }, 0)
      
      return {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        totalSold,
        rating: product.rating || 0,
        reviews: product.reviews || 0
      }
    })

    const topProducts = productSales
      .sort((a: any, b: any) => b.totalSold - a.totalSold)
      .slice(0, 5)

    return NextResponse.json({
      stats: {
        totalRevenue: currentTotalRevenue,
        totalOrders: currentTotalOrders,
        averageOrderValue: currentAverageOrderValue,
        totalCustomers: currentTotalCustomers,
        revenueChange,
        ordersChange,
        aovChange,
        customersChange
      },
      charts: {
        revenue: {
          labels,
          data: revenueData
        },
        orders: {
          labels,
          data: ordersData
        },
        orderStatus: orderStatusData
      },
      topProducts
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
} 