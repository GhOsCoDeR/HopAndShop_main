'use client'

import React from 'react'
import Link from 'next/link'
import { 
  Facebook, Twitter, Instagram, Youtube, 
  Mail, Phone, HelpCircle, Truck, ShieldCheck, RefreshCw
} from 'lucide-react'
import ImagePlaceholder from './ImagePlaceholder'

const Footer = () => {
  return (
    <footer className="bg-white">
      {/* Value Propositions */}
      <div className="border-t border-b py-8 border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Truck className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Fast Delivery</h4>
                <p className="text-sm text-gray-600">On all orders</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <RefreshCw className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Easy Returns</h4>
                <p className="text-sm text-gray-600">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <ShieldCheck className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">Secure Shopping</h4>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <HelpCircle className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <h4 className="font-semibold">24/7 Support</h4>
                <p className="text-sm text-gray-600">Dedicated support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Newsletter */}
      <div className="bg-orange-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-white font-bold text-xl">New to Hop & Shop?</h3>
              <p className="text-white">Subscribe to our newsletter for exclusive deals and updates</p>
            </div>
            <div className="w-full md:w-auto">
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 w-full md:w-64 rounded-l-md focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-gray-900 text-white px-4 py-2 rounded-r-md hover:bg-gray-800 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
            {/* Column 1: About */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">About Hop & Shop</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 hover:text-orange-500 text-sm">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-600 hover:text-orange-500 text-sm">Careers</Link></li>
                <li><Link href="/terms" className="text-gray-600 hover:text-orange-500 text-sm">Terms & Conditions</Link></li>
                <li><Link href="/privacy" className="text-gray-600 hover:text-orange-500 text-sm">Privacy Policy</Link></li>
                <li><Link href="/sell" className="text-gray-600 hover:text-orange-500 text-sm">Sell on Hop & Shop</Link></li>
              </ul>
            </div>
            
            {/* Column 2: Customer Service */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Customer Service</h4>
              <ul className="space-y-2">
                <li><Link href="/help" className="text-gray-600 hover:text-orange-500 text-sm">Help Center</Link></li>
                <li><Link href="/returns" className="text-gray-600 hover:text-orange-500 text-sm">Returns & Refunds</Link></li>
                <li><Link href="/delivery" className="text-gray-600 hover:text-orange-500 text-sm">Delivery Information</Link></li>
                <li><Link href="/payment" className="text-gray-600 hover:text-orange-500 text-sm">Payment Methods</Link></li>
                <li><Link href="/vouchers" className="text-gray-600 hover:text-orange-500 text-sm">Vouchers</Link></li>
              </ul>
            </div>
            
            {/* Column 3: Contact */}
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Phone className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-gray-600 text-sm">+233 20 123 4567</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-gray-600 text-sm">support@hopshop.com</span>
                </li>
              </ul>
            </div>
            
            {/* Column 4: Mobile Apps */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4">Download Our App</h4>
              <p className="text-gray-600 text-sm mb-4">Shop on the go with our mobile app</p>
              <div className="space-y-2">
                <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                  <ImagePlaceholder
                    src="/images/app/google-play.svg"
                    alt="Get it on Google Play"
                    width={140}
                    height={42}
                    type="banner"
                  />
                </Link>
                <Link href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                  <ImagePlaceholder
                    src="/images/app/app-store.svg"
                    alt="Download on the App Store"
                    width={140}
                    height={42}
                    type="banner"
                  />
                </Link>
              </div>
            </div>
            
            {/* Column 5: Payment Methods */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1">
              <h4 className="font-bold text-gray-900 mb-4">We Accept</h4>
              <div className="grid grid-cols-3 gap-2">
                {['Visa', 'Mastercard', 'Mobile Money', 'Bank Transfer', 'Cash on Delivery'].map((method, index) => (
                  <div key={index} className="bg-gray-100 rounded-md p-2 text-xs text-center">{method}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Hop & Shop. All rights reserved.</p>
            </div>
            
            <div className="flex space-x-4">
              <Link href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <Facebook className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer 