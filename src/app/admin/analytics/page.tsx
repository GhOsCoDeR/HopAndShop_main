'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingBag, Calendar, Globe, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'

// Sample data for charts
const monthlyRevenueData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 19000 },
  { name: 'Mar', value: 17000 },
  { name: 'Apr', value: 21000 },
  { name: 'May', value: 25000 },
  { name: 'Jun', value: 32000 },
  { name: 'Jul', value: 38000 },
  { name: 'Aug', value: 43000 },
  { name: 'Sep', value: 48000 },
  { name: 'Oct', value: 52000 },
  { name: 'Nov', value: 61000 },
  { name: 'Dec', value: 68000 }
]

const categorySalesData = [
  { name: 'Electronics', value: 35 },
  { name: 'Fashion', value: 25 },
  { name: 'Home', value: 15 },
  { name: 'Beauty', value: 10 },
  { name: 'Sports', value: 8 },
  { name: 'Other', value: 7 }
]

const customerAcquisitionData = [
  { name: 'Week 1', direct: 120, social: 80, search: 60, referral: 40 },
  { name: 'Week 2', direct: 132, social: 96, search: 85, referral: 48 },
  { name: 'Week 3', direct: 145, social: 105, search: 95, referral: 52 },
  { name: 'Week 4', direct: 160, social: 120, search: 105, referral: 65 }
]

const productPerformanceData = [
  { name: 'iPhone 15', sales: 140, returns: 4 },
  { name: 'Samsung S24', sales: 118, returns: 5 },
  { name: 'MacBook Pro', sales: 95, returns: 2 },
  { name: 'AirPods', sales: 170, returns: 8 },
  { name: 'Dell XPS', sales: 85, returns: 3 }
]

// Add geographical sales data
const geographicalSalesData = [
  { x: 100, y: 200, z: 240, name: 'New York', country: 'USA' },
  { x: 120, y: 100, z: 180, name: 'Los Angeles', country: 'USA' },
  { x: 170, y: 300, z: 200, name: 'Chicago', country: 'USA' },
  { x: 140, y: 250, z: 280, name: 'London', country: 'UK' },
  { x: 150, y: 400, z: 160, name: 'Paris', country: 'France' },
  { x: 110, y: 280, z: 220, name: 'Berlin', country: 'Germany' },
  { x: 200, y: 260, z: 290, name: 'Tokyo', country: 'Japan' },
  { x: 220, y: 170, z: 130, name: 'Sydney', country: 'Australia' },
  { x: 90, y: 220, z: 250, name: 'Beijing', country: 'China' },
  { x: 240, y: 190, z: 170, name: 'Mumbai', country: 'India' }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d']

// Add more type definitions at the top of the file
type ChartType = 'revenue' | 'category' | 'acquisition' | 'performance' | 'geographical';

type ExpandedChartsState = {
  [key in ChartType]: boolean;
};

interface ScatterPointProps {
  cx: number;
  cy: number;
  r?: number;
  z: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  name?: string;
  country?: string;
  x?: number;
  y?: number;
}

// Replace the ScatterProps interface with a more appropriate one
interface CustomScatterProps {
  cx?: number;
  cy?: number;
  r?: number;
  payload?: any;
  fill?: string;
}

export default function AnalyticsPage() {
  const [isClient, setIsClient] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedCharts, setExpandedCharts] = useState<ExpandedChartsState>({
    revenue: false,
    category: false,
    acquisition: false,
    performance: false,
    geographical: false
  })

  useEffect(() => {
    setIsClient(true)
    
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => 
        prevIndex === categorySalesData.length - 1 ? 0 : prevIndex + 1
      )
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])

  const toggleChart = (chart: ChartType) => {
    setExpandedCharts(prev => ({
      ...prev,
      [chart]: !prev[chart]
    }))
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  }

  // Stats cards data
  const statsCards = [
    {
      title: 'Total Revenue',
      value: '$386,000',
      trend: '+12.5%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'New Customers',
      value: '1,248',
      trend: '+18.2%',
      isPositive: true,
      icon: Users,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Total Orders',
      value: '5,672',
      trend: '+7.1%',
      isPositive: true,
      icon: ShoppingBag,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Average Order Value',
      value: '$68.12',
      trend: '-2.3%',
      isPositive: false,
      icon: DollarSign,
      color: 'bg-orange-50 text-orange-600'
    }
  ]

  if (!isClient) {
    return null
  }

  return (
    <motion.div 
      className="space-y-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Detailed insights on your business performance</p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-white dark:bg-gray-800 p-2 border dark:border-gray-700 shadow-sm">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium dark:text-gray-300">Last 30 days</span>
        </div>
      </div>

      {/* Stats Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((card, index) => (
          <motion.div 
            key={card.title}
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                <p className="text-2xl font-bold dark:text-white">{card.value}</p>
                <div className="flex items-center">
                  {card.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${card.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {card.trend} from last month
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${card.color.split(' ')[0]}`}>
                <card.icon className={`w-6 h-6 ${card.color.split(' ')[1]}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Revenue Overview</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue for the current year</p>
        </div>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={monthlyRevenueData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#6366F1"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                strokeWidth={3}
                activeDot={{ r: 8 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category Sales and Customer Acquisition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Sales */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sales by Category</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Distribution of sales across product categories</p>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categorySalesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={1}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      stroke="none"
                      opacity={index === activeIndex ? 1 : 0.8}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Customer Acquisition */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Customer Acquisition</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">New customers by acquisition channel</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerAcquisitionData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: 20 }} />
                <Bar dataKey="direct" name="Direct" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="social" name="Social" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="search" name="Search" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="referral" name="Referral" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Product Performance */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Product Performance</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Top products by sales and returns</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={productPerformanceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend wrapperStyle={{ paddingTop: 20 }} />
              <Line
                type="monotone"
                dataKey="sales"
                name="Sales"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="returns"
                name="Returns"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Geographical Sales Heat Map */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-4 flex justify-between items-center cursor-pointer" onClick={() => toggleChart('geographical')}>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Geographical Sales Distribution</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Sales performance across major global markets</p>
          </div>
          <div className="flex items-center text-indigo-600 dark:text-indigo-400">
            {expandedCharts.geographical ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
        
        <AnimatePresence>
          {(!expandedCharts.geographical || isClient) && (
            <motion.div 
              className="h-[400px]"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: expandedCharts.geographical ? 400 : 400, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium">Global Heat Map</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-xs text-gray-500">High Sales</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-green-500 ml-2"></span>
                  <span className="text-xs text-gray-500">Medium Sales</span>
                  <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 ml-2"></span>
                  <span className="text-xs text-gray-500">Low Sales</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height="90%">
                <ScatterChart
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="longitude" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[50, 250]}
                    label={{ value: 'Longitude', position: 'insideBottomRight', offset: -5 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="latitude" 
                    stroke="#9CA3AF" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[50, 450]}
                    label={{ value: 'Latitude', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="z" 
                    range={[50, 400]} 
                    name="sales" 
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value, name, props) => {
                      if (name === 'sales') return [`$${value}k`, 'Sales Volume'];
                      return [value, name];
                    }}
                    wrapperStyle={{ zIndex: 100 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                            <p className="font-bold">{payload[0].payload.name}</p>
                            <p className="text-gray-500 text-sm">{payload[0].payload.country}</p>
                            <p className="text-indigo-600 font-medium mt-1">${payload[0].payload.z}k in sales</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Sales by Location" 
                    data={geographicalSalesData} 
                    fill="#6366F1"
                    shape={(props: any) => {
                      const cx = props.cx;
                      const cy = props.cy;
                      const z = props.payload.z;
                      
                      const size = z / 10;
                      
                      let color;
                      if (z > 250) color = "#3B82F6"; // High sales - blue
                      else if (z > 180) color = "#10B981"; // Medium sales - green
                      else color = "#F59E0B"; // Low sales - yellow
                      
                      return (
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={size} 
                          fill={color} 
                          fillOpacity={0.7}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      );
                    }}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Weekly Sales Trend Insights */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between text-white mb-4">
          <h2 className="text-xl font-bold">Weekly Insights</h2>
          <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-0.5 rounded-full">Last 7 days</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 mr-2 text-green-300" />
              <span className="font-medium">Top Growth Category</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">Electronics</h3>
            <p className="text-green-300 font-medium">+24.8% growth</p>
            <div className="mt-3 flex items-center text-sm">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <ShoppingBag className="w-5 h-5 mr-2 text-yellow-300" />
              <span className="font-medium">Best Selling Product</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">iPhone 15</h3>
            <p className="text-yellow-300 font-medium">142 units sold</p>
            <div className="mt-3 flex items-center text-sm">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-white">
            <div className="flex items-center mb-2">
              <Users className="w-5 h-5 mr-2 text-blue-300" />
              <span className="font-medium">New Customers</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">287</h3>
            <p className="text-blue-300 font-medium">+18.5% from last week</p>
            <div className="mt-3 flex items-center text-sm">
              <span>View details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
} 