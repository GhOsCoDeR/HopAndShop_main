import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
)

interface StatCard {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
  color: string
}

interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    borderColor: string
    backgroundColor: string
    fill?: boolean
  }[]
}

interface PieChartData {
  labels: string[]
  datasets: {
    data: number[]
    backgroundColor: string[]
  }[]
}

interface TopProduct {
  id: string
  name: string
  category: string
  price: number
  totalSold: number
  rating?: number
  reviews?: number
}

interface OrderStatus {
  status: string
  count: number
  color: string
  icon: React.ElementType
}

// Chart options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: true,
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
}

const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right' as const
    }
  }
}

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<StatCard[]>([])
  const [revenueData, setRevenueData] = useState<ChartData>({
    labels: [],
    datasets: []
  })
  const [ordersData, setOrdersData] = useState<ChartData>({
    labels: [],
    datasets: []
  })
  const [orderStatusData, setOrderStatusData] = useState<PieChartData>({
    labels: [],
    datasets: []
  })
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data')
        }
        const data = await response.json()

        // Update stats
        const newStats: StatCard[] = [
          {
            title: 'Total Revenue',
            value: `$${data.stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: data.stats.revenueChange,
            icon: DollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'Total Orders',
            value: data.stats.totalOrders.toLocaleString(),
            change: data.stats.ordersChange,
            icon: ShoppingCart,
            color: 'bg-blue-500'
          },
          {
            title: 'Average Order Value',
            value: `$${data.stats.averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            change: data.stats.aovChange,
            icon: TrendingUp,
            color: 'bg-purple-500'
          },
          {
            title: 'Total Customers',
            value: data.stats.totalCustomers.toLocaleString(),
            change: data.stats.customersChange,
            icon: Users,
            color: 'bg-yellow-500'
          }
        ]
        setStats(newStats)

        // Update charts
        setRevenueData({
          labels: data.charts.revenue.labels,
          datasets: [{
            label: 'Revenue',
            data: data.charts.revenue.data,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            fill: true
          }]
        })

        setOrdersData({
          labels: data.charts.orders.labels,
          datasets: [{
            label: 'Orders',
            data: data.charts.orders.data,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          }]
        })

        // Update order status data
        setOrderStatusData({
          labels: data.charts.orderStatus.labels,
          datasets: [{
            data: data.charts.orderStatus.data,
            backgroundColor: data.charts.orderStatus.colors
          }]
        })

        // Update order statuses with icons
        const statuses: OrderStatus[] = data.charts.orderStatus.labels.map((label: string, index: number) => ({
          status: label,
          count: data.charts.orderStatus.data[index],
          color: data.charts.orderStatus.colors[index],
          icon: getStatusIcon(label)
        }))
        setOrderStatuses(statuses)

        // Update top products
        setTopProducts(data.topProducts)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  const getStatusIcon = (status: string): React.ElementType => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return CheckCircle
      case 'processing':
        return Package
      case 'pending':
        return Clock
      case 'shipped':
        return Package
      default:
        return AlertCircle
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-medium">Error loading analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {stat.change >= 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm font-medium ${
                stat.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {Math.abs(stat.change)}% from last period
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64">
            <Line options={lineChartOptions} data={revenueData} />
          </div>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Orders Overview</h3>
          <div className="h-64">
            <Line options={lineChartOptions} data={ordersData} />
          </div>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <Pie options={pieChartOptions} data={orderStatusData} />
          </div>
        </div>

        {/* Status List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status Summary</h3>
          <div className="space-y-4">
            {orderStatuses.map((status) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: status.color + '20' }}>
                    <status.icon className="w-4 h-4" style={{ color: status.color }} />
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-900">{status.status}</span>
                </div>
                <span className="text-sm font-medium text-gray-500">{status.count} orders</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
        <div className="space-y-4">
          {topProducts.map((product) => (
            <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
              </div>
              <div className="flex items-center space-x-8">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${(product.price || 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(product.totalSold || 0).toLocaleString()} units sold
                  </p>
                </div>
                <div className="flex items-center">
                  <div className="text-sm text-gray-900">
                    {(product.rating || 0).toFixed(1)}
                  </div>
                  <div className="ml-2 text-sm text-gray-500">
                    ({product.reviews || 0} reviews)
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 