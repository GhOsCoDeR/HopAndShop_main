'use client'

import { useState } from 'react'
import { ChevronDown, ShoppingBag, CreditCard, Truck, RotateCcw, Mail, Phone, MessageSquare } from 'lucide-react'
import Link from 'next/link'

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200">
      <button
        className="flex justify-between items-center w-full py-4 px-2 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="py-3 px-2 text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState('faq')

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "Orders" section. There you will find all your orders and their current status. You can also use the tracking number sent to your email to check the status on our carrier\'s website.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 30 days of delivery for most items. Products must be in their original condition with all packaging. Some exceptions apply for electronics and personal care items. Visit our Returns page for more details and to initiate a return.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the country. Express shipping is available for 1-2 business days delivery. International shipping times vary by location, usually between 7-14 business days.'
    },
    {
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. International shipping costs and delivery times vary depending on the destination. You can see the shipping options available during checkout.'
    },
    {
      question: 'How can I change or cancel my order?',
      answer: 'You can change or cancel your order within 1 hour of placing it by contacting our customer service team. After this window, we begin processing orders and may not be able to make changes or cancel.'
    },
    {
      question: 'Are there any discount codes available?',
      answer: 'We regularly offer promotional discounts through our newsletter and social media channels. You can also check our Deals page for current promotions. New customers can get 10% off their first purchase by subscribing to our newsletter.'
    },
    {
      question: 'How do I contact customer service?',
      answer: 'You can reach our customer service team via email at support@hopandshop.com, by phone at 1-800-HOP-SHOP (467-7467) from 8am-8pm EST Monday through Saturday, or through the contact form on this page.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, Google Pay, and bank transfers. Some regional payment methods are also available at checkout.'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How Can We Help You?</h1>
        <p className="text-lg text-gray-600">Find answers to common questions or get in touch with our support team</p>
      </div>

      {/* Help Options */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-orange-600 mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shopping Guide</h3>
          <p className="text-gray-600 mb-4">Learn how to navigate our store and make purchases</p>
          <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
            Read Guide
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-orange-600 mb-4">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Shipping Info</h3>
          <p className="text-gray-600 mb-4">Get details about shipping times and costs</p>
          <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
            View Shipping
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-orange-600 mb-4">
            <RotateCcw className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Returns & Refunds</h3>
          <p className="text-gray-600 mb-4">Understand our return policy and process</p>
          <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
            Return Policy
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full text-orange-600 mb-4">
            <CreditCard className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Options</h3>
          <p className="text-gray-600 mb-4">Learn about secure payment methods</p>
          <Link href="#" className="text-orange-600 hover:text-orange-700 font-medium">
            Payment Info
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        <div className="flex border-b">
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'faq'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('faq')}
          >
            Frequently Asked Questions
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'contact'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Us
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'faq' ? (
            <div className="divide-y divide-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-1">
                {faqs.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Our Support Team</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center">
                  <div className="mr-4 text-orange-500">
                    <Mail className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Email Us</h3>
                    <p className="text-gray-600">support@hopandshop.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 text-orange-500">
                    <Phone className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Call Us</h3>
                    <p className="text-gray-600">1-800-HOP-SHOP (467-7467)</p>
                    <p className="text-xs text-gray-500">Mon-Sat, 8am-8pm EST</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="mr-4 text-orange-500">
                    <MessageSquare className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Live Chat</h3>
                    <p className="text-gray-600">Available 24/7</p>
                    <button className="text-orange-600 text-sm font-medium mt-1">Start Chat</button>
                  </div>
                </div>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                  ></textarea>
                </div>
                
                <div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Customer Support Banner */}
      <div className="bg-orange-100 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-orange-800 mb-4">Need More Help?</h2>
        <p className="text-orange-700 max-w-3xl mx-auto mb-6">
          Our customer support team is here to assist you with any questions or concerns.
          We're committed to providing you with the best shopping experience possible.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            href="#"
            className="px-6 py-3 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
          >
            Live Chat
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 bg-white text-orange-600 font-medium rounded-md border border-orange-600 hover:bg-orange-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  )
} 