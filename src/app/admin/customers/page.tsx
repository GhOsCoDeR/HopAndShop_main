'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  Calendar,
  User,
  CreditCard,
  Package,
  Clock,
  X,
  ArrowRight,
  Truck,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react'
import { Customer, Order } from '@/types/customer'
import { userCustomerService } from '@/services/user-customer.service'

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<Order[]>([])
  const [showCustomerDetails, setShowCustomerDetails] = useState(false)
  const itemsPerPage = 10

  // Load customers on component mount
  useEffect(() => {
    const loadCustomers = async () => {
      setIsLoading(true)
      try {
        const data = await userCustomerService.getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to load customers:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomers()
  }, [])

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)

    if (query.trim()) {
      setIsLoading(true)
      try {
        const results = await userCustomerService.searchCustomers(query)
        setCustomers(results)
      } catch (error) {
        console.error('Search failed:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // If search is cleared, reload all customers
      setIsLoading(true)
      try {
        const data = await userCustomerService.getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error('Failed to reload customers:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // View customer details
  const viewCustomerDetails = async (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowCustomerDetails(true)
    
    try {
      // If orders aren't already loaded with the customer, fetch them
      if (!customer.orders || customer.orders.length === 0) {
        const orders = await userCustomerService.getCustomerOrders(customer.id)
        setSelectedCustomerOrders(orders)
      } else {
        setSelectedCustomerOrders(customer.orders)
      }
    } catch (error) {
      console.error('Failed to load customer orders:', error)
      setSelectedCustomerOrders([])
    }
  }

  // Navigate to detailed customer page
  const navigateToCustomerDetail = (customerId: string) => {
    router.push(`/admin/customers/${customerId}`)
  }

  // Close customer details modal
  const closeCustomerDetails = () => {
    setShowCustomerDetails(false)
    setSelectedCustomer(null)
    setSelectedCustomerOrders([])
  }

  // Pagination
  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCustomers = customers.slice(startIndex, startIndex + itemsPerPage)

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Customers</h2>
      </div>

      {/* Search */}
      <div className="flex-1">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
            placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 
            focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCustomers.length > 0 ? (
                  paginatedCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => navigateToCustomerDetail(customer.id)}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {customer.id}
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {customer.profilePicture ? (
                            <img 
                              src={customer.profilePicture} 
                              alt={customer.name}
                              className="h-10 w-10 rounded-full mr-3"
                              onError={(e) => {
                                // If image fails to load, show fallback
                                (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(customer.name);
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <User className="h-6 w-6 text-gray-500" />
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Mail className="h-4 w-4 mr-1" />
                      {customer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      {customer.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-1" />
                      {customer.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <ShoppingBag className="h-4 w-4 mr-1" />
                      {customer.totalOrders}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {customer.joinDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {customer.lastOrder || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium 
                          ${customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                            customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            navigateToCustomerDetail(customer.id);
                          }}
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <span className="mr-1">View</span>
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-6 py-4 text-center text-gray-500 italic">
                      No customers found
                  </td>
                </tr>
                )}
            </tbody>
          </table>
        </div>
        )}

        {/* Pagination */}
        {!isLoading && paginatedCustomers.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, customers.length)}
                </span>{' '}
                  of <span className="font-medium">{customers.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showCustomerDetails && selectedCustomer && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-medium text-gray-900">Customer Details</h3>
                <button 
                  onClick={closeCustomerDetails}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="bg-white p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Customer Info */}
                  <div className="md:w-1/3">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-4">
                        {selectedCustomer.profilePicture ? (
                          <img 
                            src={selectedCustomer.profilePicture} 
                            alt={selectedCustomer.name}
                            className="h-16 w-16 rounded-full mr-4"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(selectedCustomer.name);
                            }}
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                            <User className="h-8 w-8 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold">{selectedCustomer.name}</h4>
                          <p className="text-sm text-gray-500">{selectedCustomer.id}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <span className="text-xs text-gray-500 block">Email</span>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">{selectedCustomer.email}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-500 block">Phone</span>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">{selectedCustomer.phone}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-500 block">Address</span>
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500 mt-0.5" />
                            <span className="text-sm">
                              {selectedCustomer.address}
                              {selectedCustomer.city && `, ${selectedCustomer.city}`}
                              {selectedCustomer.state && `, ${selectedCustomer.state}`}
                              {selectedCustomer.zipCode && ` ${selectedCustomer.zipCode}`}
                              {selectedCustomer.country && `, ${selectedCustomer.country}`}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-500 block">Joined</span>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">{selectedCustomer.joinDate}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-xs text-gray-500 block">Status</span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium 
                            ${selectedCustomer.status === 'active' ? 'bg-green-100 text-green-800' : 
                              selectedCustomer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {selectedCustomer.status.charAt(0).toUpperCase() + selectedCustomer.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">Purchase Summary</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Orders</span>
                          <span className="text-sm font-medium">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Total Spent</span>
                          <span className="text-sm font-medium">${selectedCustomer.totalSpent.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Last Order</span>
                          <span className="text-sm font-medium">{selectedCustomer.lastOrder || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order History */}
                  <div className="md:w-2/3">
                    <h4 className="font-medium text-gray-700 mb-3">Order History</h4>
                    {selectedCustomerOrders.length > 0 ? (
                      <div className="space-y-4">
                        {selectedCustomerOrders.map((order) => (
                          <div key={order.id} className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 flex justify-between items-center">
                              <div>
                                <div className="text-sm font-medium">Order #{order.id}</div>
                                <div className="text-xs text-gray-500 flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {order.date}
                                </div>
                              </div>
                              <div className="flex items-center">
                                {getStatusDisplay(order.status)}
                              </div>
                            </div>
                            
                            <div className="p-4">
                              <div className="space-y-3">
                                {order.items.map((item) => (
                                  <div key={item.id} className="flex justify-between items-center">
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
                              
                              <div className="border-t mt-4 pt-4 flex justify-between items-center">
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Payment</div>
                                  <div className="flex items-center text-sm">
                                    <CreditCard className="h-4 w-4 mr-1 text-gray-500" />
                                    {order.paymentMethod}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs text-gray-500 mb-1">Total</div>
                                  <div className="text-sm font-medium">${order.total.toFixed(2)}</div>
                                </div>
                              </div>
                              
                              {order.status !== 'cancelled' && order.trackingNumber && (
                                <div className="border-t mt-4 pt-4">
                                  <div className="text-xs text-gray-500 mb-1">Tracking</div>
                                  <div className="flex items-center text-sm">
                                    <Truck className="h-4 w-4 mr-1 text-gray-500" />
                                    {order.trackingNumber}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center">
                        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <h5 className="text-gray-500 mb-1">No Orders Found</h5>
                        <p className="text-gray-400 text-sm">This customer hasn't made any purchases yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 