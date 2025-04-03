import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Path to store products JSON file
const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'products.json')

// Function to ensure the directory exists
function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath)
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { products } = await request.json()
    
    // Make sure the directory exists
    ensureDirectoryExists(PRODUCTS_FILE_PATH)
    
    // Write products to the file
    fs.writeFileSync(PRODUCTS_FILE_PATH, JSON.stringify(products, null, 2))
    
    return NextResponse.json({ success: true, message: 'Products saved successfully' })
  } catch (error) {
    console.error('Error saving products:', error)
    return NextResponse.json({ success: false, message: 'Failed to save products' }, { status: 500 })
  }
} 