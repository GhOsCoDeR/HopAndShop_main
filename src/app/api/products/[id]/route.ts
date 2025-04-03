import { NextRequest, NextResponse } from 'next/server'
import dbUtils from '@/lib/db'

// GET single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    const products = await dbUtils.query(`SELECT * FROM products WHERE id = ?`, [id])
    
    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(products[0])
  } catch (error: any) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT (update) product by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await req.json()
    const {
      name,
      description,
      price,
      category,
      subcategory,
      imageUrl,
      brand,
      inStock,
      rating,
      numReviews,
      featured
    } = data
    
    // Validate required fields
    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Name, price, and category are required fields' },
        { status: 400 }
      )
    }
    
    // First check if the product exists
    const existingProduct = await dbUtils.query(`SELECT * FROM products WHERE id = ?`, [id])
    
    if (!existingProduct || existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Update the product
    await dbUtils.query(
      `UPDATE products SET 
       name = ?, 
       description = ?, 
       price = ?, 
       category = ?,
       subcategory = ?,
       imageUrl = ?,
       brand = ?,
       inStock = ?,
       rating = ?,
       numReviews = ?,
       featured = ?
       WHERE id = ?`,
      [
        name, 
        description, 
        price, 
        category, 
        subcategory,
        imageUrl,
        brand,
        inStock,
        rating,
        numReviews,
        featured,
        id
      ]
    )
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE product by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    
    // First check if the product exists
    const existingProduct = await dbUtils.query(`SELECT * FROM products WHERE id = ?`, [id])
    
    if (!existingProduct || existingProduct.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Delete the product
    await dbUtils.query(`DELETE FROM products WHERE id = ?`, [id])
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 