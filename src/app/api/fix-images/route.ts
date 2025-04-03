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

// Validate and normalize image URL
const normalizeImageUrl = (url: string): string => {
  if (!url) return '';
  
  // If it's a base64 image, validate and return it
  if (url.startsWith('data:image')) {
    // Validate base64 format
    const [header, content] = url.split(',');
    if (!header || !content) {
      console.error('Invalid base64 image format');
      return '';
    }
    // Verify it's a valid image MIME type
    if (!header.includes('image/')) {
      console.error('Invalid image MIME type in base64');
      return '';
    }
    return url;
  }
  
  // If URL does not start with http/https, check if it's a relative URL
  if (!url.startsWith('http')) {
    // If it's a relative URL without leading slash, add it
    if (!url.startsWith('/')) {
      return `/${url}`;
    }
  }
  
  return url;
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

// Process and update products with localStorage data
async function updateProductsFromLocalStorage(localProducts: any[]) {
  console.log(`Processing ${localProducts.length} products from localStorage`);
  
  // Get all database products to match by name
  const dbProducts = await dbUtils.query(`SELECT id, name, category, imageUrl FROM products`);
  
  // Create a map of product names to IDs and categories for easier lookup
  const productMap = new Map();
  dbProducts.forEach((dbProduct: any) => {
    productMap.set(dbProduct.name.toLowerCase(), {
      id: dbProduct.id,
      category: dbProduct.category,
      currentImageUrl: dbProduct.imageUrl
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
            imageToUse = localProduct.imageUrl;
          } else if (localProduct.image) {
            // Some localStorage formats might use 'image' instead of 'imageUrl'
            imageToUse = localProduct.image;
          }
          
          // Only update if we have a new image and it's different from the current one
          if (imageToUse && imageToUse !== dbProductInfo.currentImageUrl) {
            // Handle base64 images directly
            if (imageToUse.startsWith('data:image')) {
              await dbUtils.query(
                `UPDATE products SET imageUrl = ? WHERE id = ?`,
                [imageToUse, dbProductInfo.id]
              );
              updatedCount++;
              continue;
            }
            
            // Fix image URL format for non-base64 images
            if (imageToUse.startsWith('//')) {
              imageToUse = 'https:' + imageToUse;
            } else if (!imageToUse.startsWith('http') && !imageToUse.startsWith('/')) {
              imageToUse = '/' + imageToUse;
            }
            
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
  
  console.log(`Updated ${updatedCount} products from localStorage data`);
  
  return {
    updatedCount,
    errors: errors.length > 0 ? errors : null
  };
}

// Handle GET requests
export async function GET(req: NextRequest) {
  try {
    console.log('API route hit: /api/fix-images (GET)');
    
    // Parse options from the URL
    const { searchParams } = new URL(req.url)
    console.log('URL:', req.url);
    
    // Check if localStorage data was provided
    const localStorageData = searchParams.get('localStorage')
    console.log('localStorage data received via URL param:', localStorageData ? 'yes (length: ' + localStorageData.length + ')' : 'no');
    
    // Case 1: If localStorage data is provided, use it to update products
    if (localStorageData) {
      try {
        // Parse the localStorage data
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
          console.error('Invalid product data format. Expected an array.');
          return NextResponse.json({
            success: false,
            error: "Invalid product data format. Expected an array.",
            suggestion: "Check that localStorage contains valid product data"
          }, { status: 400 });
        }
        
        const { updatedCount, errors } = await updateProductsFromLocalStorage(localProducts);
        
        return NextResponse.json({
          success: true,
          message: updatedCount > 0 
            ? `Updated ${updatedCount} products with images from your homepage` 
            : "No products were updated. Make sure your products have images on the homepage.",
          updated: updatedCount,
          errors
        });
      } catch (error: any) {
        console.error('Error processing localStorage data:', error);
        return NextResponse.json({
          success: false,
          error: `Error processing data: ${error.message}`
        }, { status: 500 });
      }
    }
    
    // Case 2: Fix existing image URLs in the database
    return await fixExistingImages();
  } catch (error: any) {
    console.error('Error fixing image URLs:', error);
    return NextResponse.json({ error: error.message, success: false }, { status: 500 });
  }
}

// Handle POST requests
export async function POST(req: NextRequest) {
  try {
    console.log('POST API route hit: /api/fix-images');
    
    // Get the JSON data from the request body
    const localProducts = await req.json();
    console.log('Received products data:', Array.isArray(localProducts) ? `${localProducts.length} products` : 'invalid format');
    
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
        category: dbProduct.category,
        currentImageUrl: dbProduct.imageUrl
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
              // Log the image URL for debugging
              const imageUrl = localProduct.imageUrl;
              console.log(`Processing image for ${localProduct.name}, length: ${imageUrl.length}`);
              
              // Validate base64 image
              if (imageUrl.startsWith('data:image')) {
                const [header, content] = imageUrl.split(',');
                if (!header || !content) {
                  console.error(`Invalid base64 format for ${localProduct.name}`);
                  continue;
                }
                
                // Check if the image data is complete
                if (content.length < 100) {
                  console.error(`Base64 data too short for ${localProduct.name}`);
                  continue;
                }
                
                // Ensure the MIME type is correct
                if (!header.includes('image/')) {
                  console.error(`Invalid MIME type for ${localProduct.name}`);
                  continue;
                }
                
                // Check if the base64 data is valid
                try {
                  atob(content);
                } catch (e) {
                  console.error(`Invalid base64 data for ${localProduct.name}`);
                  continue;
                }
              }
              
              imageToUse = imageUrl;
            } else if (localProduct.image) {
              // Some localStorage formats might use 'image' instead of 'imageUrl'
              imageToUse = localProduct.image;
            }
            
            // Only update if we have a valid image URL and it's different from the current one
            if (imageToUse && imageToUse !== dbProductInfo.currentImageUrl) {
              console.log(`Updating image for ${localProduct.name}`);
              
              // Use parameterized query to handle large text
              await dbUtils.query(
                `UPDATE products SET imageUrl = ? WHERE id = ?`,
                [imageToUse, dbProductInfo.id]
              );
              updatedCount++;
            } else {
              console.log(`Skipping update for ${localProduct.name}: ${!imageToUse ? 'No valid image' : 'Image unchanged'}`);
            }
          } catch (updateError: any) {
            console.error(`Error updating ${localProduct.name}:`, updateError);
            errors.push({ 
              id: dbProductInfo.id, 
              name: localProduct.name,
              error: updateError.message 
            });
          }
        } else {
          console.log(`No matching product found for: ${localProduct.name}`);
        }
      }
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
    console.error('Error processing product data:', error);
    return NextResponse.json({
      success: false,
      error: `Error processing data: ${error.message}`
    }, { status: 500 });
  }
}

// Helper function to fix existing image URLs
async function fixExistingImages() {
  console.log('No localStorage data, fixing existing image URLs...');
  
  // Get all products
  const products = await dbUtils.query(`SELECT id, name, category, imageUrl, image FROM products`);
  
  let updatedCount = 0;
  const errors: any[] = [];
  
  // Process each product
  for (const product of products) {
    try {
      let updatedImageUrl = null;
      
      // Check if we need to fix the image URL
      if (product.imageUrl) {
        // Fix common issues with image URLs
        let imageUrl = product.imageUrl;
        
        // Make sure URLs have proper protocol
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        }
        
        // Fix relative URLs
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
          // Convert to absolute URL if it's a relative path
          imageUrl = new URL(imageUrl, 'http://localhost:3000').toString();
        }
        
        // Update if we made changes
        if (imageUrl !== product.imageUrl) {
          updatedImageUrl = imageUrl;
        }
      }
      
      // Fall back to "image" field if necessary
      if (!product.imageUrl && product.image) {
        let imageUrl = product.image;
        
        // Make sure URLs have proper protocol
        if (imageUrl.startsWith('//')) {
          imageUrl = 'https:' + imageUrl;
        }
        
        // Fix relative URLs
        if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
          // Convert to absolute URL if it's a relative path
          imageUrl = new URL(imageUrl, 'http://localhost:3000').toString();
        }
        
        updatedImageUrl = imageUrl;
      }
      
      // Fall back to category-based image if no image is set
      if (!product.imageUrl && !product.image && product.category) {
        updatedImageUrl = getImageForCategory(product.category);
      }
      
      // Update the database if we've made changes
      if (updatedImageUrl) {
        await dbUtils.query(
          `UPDATE products SET imageUrl = ? WHERE id = ?`,
          [updatedImageUrl, product.id]
        );
        updatedCount++;
      }
    } catch (err: any) {
      errors.push({ id: product.id, error: err.message });
    }
  }
  
  console.log(`Fixed ${updatedCount} product image URLs`);
  
  return NextResponse.json({
    success: true,
    message: `Updated ${updatedCount} products with fixed image URLs`,
    updated: updatedCount,
    errors: errors.length > 0 ? errors : null
  });
} 