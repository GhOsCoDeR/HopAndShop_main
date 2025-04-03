import { NextRequest, NextResponse } from 'next/server'
import dbUtils from '@/lib/db'

// Image URLs from your actual product catalog
const PRODUCT_IMAGES = {
  phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  appliances: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
}

// Get an appropriate image URL based on product category
const getImageForCategory = (category: string): string => {
  const lowerCategory = (category || '').toLowerCase();
  
  if (lowerCategory in PRODUCT_IMAGES) {
    return PRODUCT_IMAGES[lowerCategory as keyof typeof PRODUCT_IMAGES];
  }
  
  // Default image if category doesn't match
  return 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
}

// Validate and normalize image URL
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If URL does not start with http/https, check if it's a relative URL
  if (!url.startsWith('http')) {
    // If it's a relative URL without leading slash, add it
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
  }
  
  return url;
}

export async function GET(req: NextRequest) {
  try {
    console.log('API route hit: /api/utils/fix-images');
    
    // Parse options from the URL
    const { searchParams } = new URL(req.url)
    console.log('URL:', req.url);
    
    // Sync step - use the provided localStorage data
    const localStorageData = searchParams.get('localStorage')
    console.log('localStorage data received:', localStorageData ? 'yes (length: ' + localStorageData.length + ')' : 'no');
    
    if (localStorageData) {
      try {
        // Parse the localStorage data with error handling
        let localProducts = [];
        try {
          localProducts = JSON.parse(decodeURIComponent(localStorageData));
        } catch (parseError: any) {
          console.error('Error parsing localStorage data:', parseError);
          return NextResponse.json({
            success: false,
            error: `Could not parse localStorage data: ${parseError.message}`,
            suggestion: "Try visiting the homepage first to load products properly"
          }, { status: 400 });
        }
        
        // Ensure localProducts is an array
        if (!Array.isArray(localProducts)) {
          return NextResponse.json({
            success: false,
            error: "Invalid product data format. Expected an array.",
            suggestion: "Check that localStorage contains valid product data"
          }, { status: 400 });
        }
        
        // Get all database products to match by name
        const dbProducts = await dbUtils.query(`SELECT id, name, category, imageUrl FROM products`);
        
        // Create a map of product names to IDs and categories for easier lookup
        const productMap = new Map();
        dbProducts.forEach((dbProduct: any) => {
          productMap.set(dbProduct.name.toLowerCase(), {
            id: dbProduct.id,
            category: dbProduct.category
          });
        });
        
        // Update each product
        let updatedCount = 0;
        const errors: any[] = [];
        
        for (const localProduct of localProducts) {
          if (localProduct && localProduct.name) {
            // Find matching products by name in the database
            const dbProductInfo = productMap.get(localProduct.name?.toLowerCase());
            
            if (dbProductInfo) {
              try {
                // Use the image URL from localStorage if available
                let imageToUse = '';
                
                if (localProduct.imageUrl) {
                  imageToUse = normalizeImageUrl(localProduct.imageUrl);
                } else if (localProduct.image) {
                  // Some localStorage formats might use 'image' instead of 'imageUrl'
                  imageToUse = normalizeImageUrl(localProduct.image);
                }
                
                // If no image found in localStorage, use category-based images
                if (!imageToUse && dbProductInfo.category) {
                  imageToUse = getImageForCategory(dbProductInfo.category);
                }
                
                if (imageToUse) {
                  // Update the product's image URL
                  await dbUtils.query(
                    `UPDATE products SET imageUrl = ? WHERE id = ?`,
                    [imageToUse, dbProductInfo.id]
                  );
                  updatedCount++;
                }
              } catch (updateError: any) {
                errors.push({ 
                  id: dbProductInfo.id, 
                  name: localProduct.name,
                  error: updateError.message 
                });
              }
            }
          }
        }
        
        // If no products were updated, try to identify products by category and set images
        if (updatedCount === 0 && errors.length === 0) {
          const productsWithoutImages = await dbUtils.query(
            `SELECT id, name, category FROM products WHERE imageUrl IS NULL OR imageUrl = ''`
          );
          
          for (const product of productsWithoutImages) {
            if (product.category) {
              try {
                const categoryImage = getImageForCategory(product.category);
                
                await dbUtils.query(
                  `UPDATE products SET imageUrl = ? WHERE id = ?`,
                  [categoryImage, product.id]
                );
                updatedCount++;
              } catch (updateError: any) {
                errors.push({
                  id: product.id,
                  name: product.name,
                  error: updateError.message
                });
              }
            }
          }
          
          if (updatedCount > 0) {
            return NextResponse.json({
              success: true,
              message: `Updated ${updatedCount} products with category-based images`,
              updated: updatedCount,
              errors: errors.length > 0 ? errors : null
            });
          }
          
          return NextResponse.json({
            success: true,
            message: "No matching products found to update. Make sure product names match between localStorage and database.",
            updated: 0
          });
        }
        
        return NextResponse.json({
          success: true,
          message: updatedCount > 0 
            ? `Updated ${updatedCount} products with images from your homepage` 
            : "No products were updated. Make sure your products have images on the homepage.",
          updated: updatedCount,
          errors: errors.length > 0 ? errors : null
        });
      } catch (error: any) {
        console.error('Error processing localStorage data:', error);
        return NextResponse.json({
          success: false,
          error: `Error processing data: ${error.message}`
        }, { status: 500 });
      }
    }
    
    // For direct API calls without localStorage data, set images by category
    const productsWithoutImages = await dbUtils.query(
      `SELECT id, name, category FROM products WHERE imageUrl IS NULL OR imageUrl = ''`
    );
    
    if (productsWithoutImages.length > 0) {
      let updatedCount = 0;
      const errors: any[] = [];
      
      for (const product of productsWithoutImages) {
        if (product.category) {
          try {
            // Get image for this product's category
            const categoryImage = getImageForCategory(product.category);
            
            await dbUtils.query(
              `UPDATE products SET imageUrl = ? WHERE id = ?`,
              [categoryImage, product.id]
            );
            updatedCount++;
          } catch (updateError: any) {
            errors.push({
              id: product.id,
              name: product.name,
              error: updateError.message
            });
          }
        }
      }
      
      return NextResponse.json({
        success: true,
        message: `Updated ${updatedCount} products with category-based images`,
        updated: updatedCount,
        errors: errors.length > 0 ? errors : null
      });
    }
    
    return NextResponse.json({
      success: true,
      message: 'To sync images from your products, please visit the homepage first to load products into localStorage, then click the "Sync Images from Homepage" button'
    });
  } catch (error: any) {
    console.error('Error fixing image URLs:', error);
    return NextResponse.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
} 