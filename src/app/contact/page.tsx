'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitted(true)
      toast.success('Your message has been sent successfully!')
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      }, 3000)
    }, 1500)
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-lg text-gray-600">
          We'd love to hear from you. Please fill out the form below or reach out directly.
                </p>
              </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
          
          {submitted ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full text-green-600 mb-4">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Thank You!</h3>
                <p className="text-gray-600">
                Your message has been sent successfully. We'll get back to you as soon as possible.
                </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="order">Order Inquiry</option>
                    <option value="return">Return/Refund</option>
                    <option value="product">Product Information</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                ></textarea>
              </div>
              
              <div>
              <button
                type="submit"
                  disabled={isSubmitting}
                  className={`px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors w-full md:w-auto ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
              >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              </div>
            </form>
          )}
        </div>

        {/* Contact Information */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="mr-4 pt-1 text-orange-500">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Our Address</h3>
                  <p className="text-gray-600 mt-1">
                    123 Shop Street, Commerce City<br />
                    Accra, Ghana 00233
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 pt-1 text-orange-500">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Email Us</h3>
                  <p className="text-gray-600 mt-1">
                    Customer Support: support@hopandshop.com<br />
                    Business Inquiries: info@hopandshop.com
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 pt-1 text-orange-500">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Call Us</h3>
                  <p className="text-gray-600 mt-1">
                    Ghana: +233 24 123 4567<br />
                    International: +1 800-HOP-SHOP (467-7467)
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 pt-1 text-orange-500">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Business Hours</h3>
                  <p className="text-gray-600 mt-1">
                    Monday - Friday: 8:00 AM - 8:00 PM<br />
                    Saturday: 9:00 AM - 6:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="aspect-w-16 aspect-h-9 rounded-md overflow-hidden bg-gray-200 flex items-center justify-center">
              <div className="text-center p-6">
                <h3 className="text-lg font-medium text-gray-900">Our Location on Map</h3>
                <p className="text-gray-500 mt-2">
                  Interactive map would be displayed here<br />
                  123 Shop Street, Commerce City, Accra
                </p>
                <button className="mt-4 px-4 py-2 bg-orange-100 text-orange-600 font-medium rounded hover:bg-orange-200 transition-colors">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Banner */}
      <div className="bg-orange-100 rounded-lg p-8 text-center mt-12">
        <h2 className="text-2xl font-bold text-orange-800 mb-4">Frequently Asked Questions</h2>
        <p className="text-orange-700 max-w-3xl mx-auto mb-6">
          Find answers to common questions about shipping, returns, and more in our comprehensive help center.
        </p>
        <a
          href="/help"
          className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
        >
          Visit Help Center
        </a>
      </div>
    </div>
  )
} 