import { NextRequest, NextResponse } from 'next/server'
import dbUtils from '@/lib/db'
import { v4 as uuidv4 } from 'uuid'

// GET all products
export async function GET(req: NextRequest) {
  try {
    const products = await dbUtils.query(`SELECT * FROM products`)
    
    return NextResponse.json(products)
  } catch (error: any) {
    console.error('Error loading products:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST new product
export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const {
      name,
      description,
      price,
      category,
      subcategory,
      imageUrl,
      brand,
      inStock = true,
      rating = 0,
      numReviews = 0,
      featured = false
    } = data

    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required fields' },
        { status: 400 }
      )
    }

    const id = `prod_${Date.now()}`
    
    await dbUtils.query(
      `INSERT INTO products 
      (id, name, description, price, category, subcategory, imageUrl, brand, inStock, rating, numReviews, featured) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, description, price, category, subcategory, imageUrl, brand, inStock, rating, numReviews, featured]
    )

    return NextResponse.json({ success: true, id })
  } catch (error: any) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 