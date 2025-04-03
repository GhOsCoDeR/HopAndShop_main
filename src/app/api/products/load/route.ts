import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { products as initialProducts } from '@/data/products'

// Path to store products JSON file
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')

export async function GET(request: NextRequest) {
  try {
    // Check if the products file exists
    if (fs.existsSync(PRODUCTS_FILE_PATH)) {
      // Read the products from the file
      const productsJson = fs.readFileSync(PRODUCTS_FILE_PATH, 'utf-8')
      const products = JSON.parse(productsJson)
      
      return NextResponse.json({ success: true, products })
    } else {
      // If file doesn't exist, return initial products
      const products = Object.values(initialProducts).flat()
      return NextResponse.json({ success: true, products })
    }
  } catch (error) {
    console.error('Error loading products:', error)
    
    // In case of error, return initial products
    const products = Object.values(initialProducts).flat()
    return NextResponse.json({ success: true, products })
  }
} 