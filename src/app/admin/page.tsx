'use client'

import { useState, useEffect } from 'react'
import { products } from '@/data/products'
import { orders } from '@/data/orders'
import { customers } from '@/data/customers'
import { Order } from '@/types/order'
import { Customer } from '@/types/customer'
import { Product } from '@/types/product'
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Menu,
  X,
  Phone,
  Tv,
  Home,
  ShoppingBag,
  Heart
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  recentOrders: Order[]
  topProducts: Product[]
  revenueTrend: number
  orderTrend: number
  customerTrend: number
  productTrend: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    recentOrders: [],
    topProducts: [],
    revenueTrend: 0,
    orderTrend: 0,
    customerTrend: 0,
    productTrend: 0
  })

  useEffect(() => {
    // Calculate total orders
    const totalOrders = orders.length
    const totalRevenue = orders.reduce((sum: number, order: Order) => sum + order.total, 0)
    const totalProducts = products.length
    const totalCustomers = customers.length

    // Get recent orders
    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)

    // Get top products
    const topProducts = [...products]
      .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
      .slice(0, 5)

    // Calculate trends (mock data for now)
    const revenueTrend = 12
    const orderTrend = 8
    const customerTrend = 15
    const productTrend = 3

    setStats({
      totalOrders,
      totalRevenue,
      totalProducts,
      totalCustomers,
      recentOrders,
      topProducts,
      revenueTrend,
      orderTrend,
      customerTrend,
      productTrend
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Orders</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2 dark:text-white">{stats.totalOrders}</p>
              <div className="flex items-center mt-2">
                {stats.orderTrend > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <p className={`text-sm ${stats.orderTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.orderTrend)}% from last month
                </p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Revenue</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {stats.revenueTrend > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <p className={`text-sm ${stats.revenueTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.revenueTrend)}% from last month
                </p>
              </div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/30 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Products</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2 dark:text-white">{stats.totalProducts}</p>
              <div className="flex items-center mt-2">
                {stats.productTrend > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <p className={`text-sm ${stats.productTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.productTrend)} new this month
                </p>
              </div>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-full">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 dark:border dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Customers</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-2 dark:text-white">{stats.totalCustomers}</p>
              <div className="flex items-center mt-2">
                {stats.customerTrend > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-500" />
                )}
                <p className={`text-sm ${stats.customerTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(stats.customerTrend)}% from last month
                </p>
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 rounded-full">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border dark:border-gray-700">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Quick Actions</h2>
        </div>
        <div className="p-6 overflow-x-auto">
          <div className="flex space-x-4 min-w-max pb-2">
            <Link href="/admin/products?category=supermarket&add=true" className="bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Supermarket Product</span>
            </Link>
            <Link href="/admin/products?category=phones&add=true" className="bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Phone className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Phone Product</span>
            </Link>
            <Link href="/admin/products?category=laptops&add=true" className="bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Laptop Product</span>
            </Link>
            <Link href="/admin/products?category=tvs&add=true" className="bg-pink-50 dark:bg-pink-900/30 hover:bg-pink-100 dark:hover:bg-pink-900/50 text-pink-700 dark:text-pink-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Tv className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add TV Product</span>
            </Link>
            <Link href="/admin/products?category=appliances&add=true" className="bg-green-50 dark:bg-green-900/30 hover:bg-green-100 dark:hover:bg-green-900/50 text-green-700 dark:text-green-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Home className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Appliance Product</span>
            </Link>
            <Link href="/admin/products?category=fashion&add=true" className="bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Fashion Item</span>
            </Link>
            <Link href="/admin/products?category=furniture&add=true" className="bg-orange-50 dark:bg-orange-900/30 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Home className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Furniture Item</span>
            </Link>
            <Link href="/admin/products?category=beauty&add=true" className="bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Heart className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Beauty Product</span>
            </Link>
            <Link href="/admin/products" className="bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <Package className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Manage All Products</span>
            </Link>
            <Link href="/admin/orders" className="bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-300 p-4 rounded-lg text-center transition-colors min-w-[150px] flex flex-col items-center">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">View Recent Orders</span>
            </Link>
          </div>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center">
            <p>Scroll horizontally to see more actions ➡️</p>
          </div>
        </div>
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Orders</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${order.total}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:border dark:border-gray-700">
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Top Products</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.topProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">${product.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.rating} ★</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 