'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import React from 'react'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  CreditCard,
  ArrowLeft,
  Package,
  Truck,
  Clock,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { userCustomerService } from '@/services/user-customer.service'
import { Customer, Order } from '@/types/customer'

export default function CustomerDetailPage() {
  // Use the useParams hook instead of accessing params directly
  const params = useParams()
  const id = params.id as string
  
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [currentOrderPage, setCurrentOrderPage] = useState(1)
  const ordersPerPage = 5
  const [creatingOrder, setCreatingOrder] = useState(false)

  useEffect(() => {
    const loadCustomerData = async () => {
      setIsLoading(true)
      try {
        const customerData = await userCustomerService.getCustomerById(id)
        if (customerData) {
          setCustomer(customerData)
          
          // Get orders if not included with customer data
          if (!customerData.orders || customerData.orders.length === 0) {
            const orderData = await userCustomerService.getCustomerOrders(id)
            setOrders(orderData)
          } else {
            setOrders(customerData.orders)
          }
        } else {
          // Customer not found, go back to list
          router.push('/admin/customers')
        }
      } catch (error) {
        console.error('Failed to load customer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      loadCustomerData()
    }
  }, [id, router])

  const goBack = () => {
    router.push('/admin/customers')
  }

  // Pagination for orders
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage)
  const startOrderIndex = (currentOrderPage - 1) * ordersPerPage
  const paginatedOrders = orders.slice(startOrderIndex, startOrderIndex + ordersPerPage)

  // Helper function to display order status with appropriate color
  const getStatusDisplay = (status: string) => {
    const statusColors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800',
      'returned': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Helper function to render status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  // Add sample order for demonstration
  const addSampleOrder = async () => {
    if (!customer) return;
    
    setCreatingOrder(true);
    try {
      const newOrder = await userCustomerService.addSampleOrder(customer.id);
      if (newOrder) {
        // Reload customer data to update order count and total
        const updatedCustomer = await userCustomerService.getCustomerById(customer.id);
        if (updatedCustomer) {
          setCustomer(updatedCustomer);
          // Add the new order to the orders list
          setOrders([newOrder, ...orders]);
        }
      }
    } catch (error) {
      console.error('Failed to add sample order:', error);
    } finally {
      setCreatingOrder(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Customer Not Found</h3>
        <p className="text-gray-600 mb-4">The customer you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={goBack}
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={goBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Customer Details</h2>
        </div>
        
        {/* Add sample order button */}
        {customer && activeTab === 'orders' && (
          <button
            onClick={addSampleOrder}
            disabled={creatingOrder}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300"
          >
            {creatingOrder ? 'Creating...' : 'Add Sample Order'}
          </button>
        )}
      </div>

      {/* Customer Summary Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {customer.profilePicture ? (
            <img 
              src={customer.profilePicture} 
              alt={customer.name}
              className="h-24 w-24 rounded-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(customer.name);
              }}
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-500" />
            </div>
          )}
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h3 className="text-xl font-semibold text-gray-800">{customer.name}</h3>
              <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium 
                ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                  customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                  'bg-red-100 text-red-800'}`}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </span>
            </div>
            
            <p className="text-gray-500 mb-2">{customer.id}</p>
            
            <div className="flex flex-col md:flex-row gap-4 mt-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{customer.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">{customer.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                <span className="text-sm text-gray-600">Joined {customer.joinDate}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-gray-500 text-xs">Total Orders</p>
              <p className="text-lg font-semibold text-blue-600">{customer.totalOrders}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-gray-500 text-xs">Total Spent</p>
              <p className="text-lg font-semibold text-green-600">${customer.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md">
        {activeTab === 'profile' && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Contact Details</h4>
                
                <div>
                  <span className="text-xs text-gray-500 block">Full Name</span>
                  <span className="text-sm">{customer.name}</span>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block">Email Address</span>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block">Phone Number</span>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </div>
              </div>
              
              {/* Shipping Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Shipping Address</h4>
                
                <div>
                  <span className="text-xs text-gray-500 block">Street Address</span>
                  <span className="text-sm">{customer.address}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">City</span>
                    <span className="text-sm">{customer.city || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">State/Province</span>
                    <span className="text-sm">{customer.state || '-'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">Postal Code</span>
                    <span className="text-sm">{customer.zipCode || '-'}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Country</span>
                    <span className="text-sm">{customer.country || '-'}</span>
                  </div>
                </div>
              </div>
              
              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Account Information</h4>
                
                <div>
                  <span className="text-xs text-gray-500 block">Customer ID</span>
                  <span className="text-sm">{customer.id}</span>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block">Join Date</span>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    <span className="text-sm">{customer.joinDate}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block">Account Status</span>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium 
                    ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                      customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                  </span>
                </div>
              </div>
              
              {/* Order Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700">Order Summary</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-gray-500 block">Total Orders</span>
                    <div className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="text-sm">{customer.totalOrders}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Total Spent</span>
                    <span className="text-sm font-medium">${customer.totalSpent.toFixed(2)}</span>
                  </div>
                </div>
                
                <div>
                  <span className="text-xs text-gray-500 block">Last Order Date</span>
                  <span className="text-sm">{customer.lastOrder || 'N/A'}</span>
                </div>
                
                <div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    View Order History
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Notes Section */}
            {customer.notes && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Order History</h3>
              <span className="text-sm text-gray-500">{orders.length} orders total</span>
            </div>
            
            {orders.length > 0 ? (
              <div className="space-y-6">
                {/* Order List */}
                {paginatedOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3">
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <div className="text-sm font-medium">Order #{order.id}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {order.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4">
                          <div className="text-xs text-gray-500">Total</div>
                          <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                        </div>
                        {getStatusDisplay(order.status)}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <span className="text-sm font-medium">{item.productName}</span>
                              <div className="text-xs text-gray-500">
                                Qty: {item.quantity} x ${item.price.toFixed(2)}
                              </div>
                            </div>
                            <span className="text-sm">${item.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Payment Method</div>
                          <div className="flex items-center text-sm">
                            <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                            {order.paymentMethod}
                          </div>
                        </div>
                        
                        {order.status !== 'cancelled' && order.trackingNumber && (
                          <div>
                            <div className="text-xs text-gray-500 mb-1">Tracking Number</div>
                            <div className="flex items-center text-sm">
                              <Truck className="h-4 w-4 mr-1 text-gray-500" />
                              {order.trackingNumber}
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Shipping Address</div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm truncate max-w-xs">{order.shippingAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Pagination for Orders */}
                {totalOrderPages > 1 && (
                  <div className="flex items-center justify-center pt-6 border-t border-gray-200">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentOrderPage(currentOrderPage - 1)}
                        disabled={currentOrderPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentOrderPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentOrderPage === page
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => setCurrentOrderPage(currentOrderPage + 1)}
                        disabled={currentOrderPage === totalOrderPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <h5 className="text-gray-500 mb-1">No Orders Found</h5>
                <p className="text-gray-400 text-sm">This customer hasn't made any purchases yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 