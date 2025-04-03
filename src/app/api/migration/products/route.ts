import { NextRequest, NextResponse } from 'next/server';
import dbUtils from '@/lib/db';

// POST: Migrate products from localStorage to MySQL
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { products } = data;
    
    // Validate products array
    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: 'No products provided for migration' },
        { status: 400 }
      );
    }
    
    // Check for database connection
    const pool = dbUtils.getPool();
    if (!pool) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      );
    }
    
    // Keep track of success and failures
    const results = {
      total: products.length,
      success: 0,
      failed: 0,
      errors: [] as any[]
    };
    
    // Process each product
    for (const product of products) {
      try {
        // Transform localStorage product format to database format if needed
        const dbProduct = {
          ...product,
          // Handle field name changes from localStorage to database schema
          imageUrl: product.imageUrl || product.image,
          inStock: product.inStock !== undefined ? product.inStock : (product.stock > 0),
          numReviews: product.numReviews || product.reviews || 0,
          // Ensure price is stored as a number
          price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0)
        };
        
        // Check if product already exists in database
        const existingProducts = await dbUtils.query(
          'SELECT * FROM products WHERE id = ?',
          [product.id]
        );
        
        if (existingProducts && existingProducts.length > 0) {
          // Update existing product
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
              dbProduct.name,
              dbProduct.description || '',
              dbProduct.price || 0,
              dbProduct.category || '',
              dbProduct.subcategory || '',
              dbProduct.imageUrl || '',
              dbProduct.brand || '',
              dbProduct.inStock !== undefined ? dbProduct.inStock : true,
              dbProduct.rating || 0,
              dbProduct.numReviews || 0,
              dbProduct.featured || false,
              product.id
            ]
          );
        } else {
          // Insert new product
          await dbUtils.query(
            `INSERT INTO products 
             (id, name, description, price, category, subcategory, imageUrl, brand, inStock, rating, numReviews, featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              product.id,
              dbProduct.name,
              dbProduct.description || '',
              dbProduct.price || 0,
              dbProduct.category || '',
              dbProduct.subcategory || '',
              dbProduct.imageUrl || '',
              dbProduct.brand || '',
              dbProduct.inStock !== undefined ? dbProduct.inStock : true,
              dbProduct.rating || 0,
              dbProduct.numReviews || 0,
              dbProduct.featured || false
            ]
          );
        }
        
        results.success++;
      } catch (error: any) {
        console.error(`Error migrating product ${product.id}:`, error);
        results.failed++;
        results.errors.push({
          id: product.id,
          error: error.message
        });
      }
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error during product migration:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 