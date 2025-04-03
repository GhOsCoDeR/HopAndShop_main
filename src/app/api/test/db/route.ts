import { NextRequest, NextResponse } from 'next/server';
import dbUtils from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    // Create a test product
    const productId = `test_prod_${Date.now()}`;
    const testProduct = {
      id: productId,
      name: 'Test Product',
      description: 'This is a test product to verify database connection',
      price: 99.99,
      category: 'test',
      subcategory: 'database_test',
      imageUrl: 'https://via.placeholder.com/150',
      brand: 'Test Brand',
      inStock: true,
      rating: 5,
      numReviews: 1,
      featured: false
    };
    
    // Insert test product
    await dbUtils.query(
      `INSERT INTO products 
       (id, name, description, price, category, subcategory, imageUrl, brand, inStock, rating, numReviews, featured) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testProduct.id,
        testProduct.name,
        testProduct.description,
        testProduct.price,
        testProduct.category,
        testProduct.subcategory,
        testProduct.imageUrl,
        testProduct.brand,
        testProduct.inStock,
        testProduct.rating,
        testProduct.numReviews,
        testProduct.featured
      ]
    );
    
    // Retrieve the test product
    const retrievedProducts = await dbUtils.query(`SELECT * FROM products WHERE id = ?`, [productId]);
    
    // Clean up - delete the test product
    await dbUtils.query(`DELETE FROM products WHERE id = ?`, [productId]);
    
    // Return success message with retrieved product
    return NextResponse.json({
      message: 'Database test successful: Product was created, retrieved, and deleted',
      product: retrievedProducts[0],
      dbConfig: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        database: process.env.DB_NAME || 'hopandshop',
        port: process.env.DB_PORT || '3306',
      }
    });
  } catch (error: any) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 });
  }
} 