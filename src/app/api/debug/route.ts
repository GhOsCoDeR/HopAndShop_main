import { NextRequest, NextResponse } from 'next/server'
import dbUtils from '@/lib/db'

// GET debug product information
export async function GET(req: NextRequest) {
  try {
    // Get product data with focus on image fields - only use imageUrl
    const products = await dbUtils.query(`
      SELECT id, name, imageUrl, category
      FROM products
      LIMIT 20
    `)
    
    // Format response to make it easy to debug
    return NextResponse.json({
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        imageUrl: p.imageUrl,
        hasImageUrl: !!p.imageUrl,
        imageUrlType: p.imageUrl ? typeof p.imageUrl : null
      }))
    })
  } catch (error: any) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 