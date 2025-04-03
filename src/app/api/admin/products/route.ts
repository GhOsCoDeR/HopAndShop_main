import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading JSON file:', error)
    return null
  }
}

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing JSON file:', error)
    return false
  }
}

// GET /api/admin/products
export async function GET() {
  try {
    const productsPath = path.join(process.cwd(), 'public/data/products.json')
    const products = readJsonFile(productsPath) || []

    return NextResponse.json({
      products,
      total: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/admin/products
export async function POST(request: Request) {
  try {
    const productsPath = path.join(process.cwd(), 'public/data/products.json')
    const products = readJsonFile(productsPath) || []
    const newProduct = await request.json()

    // Generate a new ID
    const newId = Math.max(...products.map((p: any) => parseInt(p.id)), 0) + 1
    const productWithId = {
      ...newProduct,
      id: newId.toString(),
      rating: 0,
      reviews: 0
    }

    products.push(productWithId)
    writeJsonFile(productsPath, products)

    return NextResponse.json(productWithId)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
} 