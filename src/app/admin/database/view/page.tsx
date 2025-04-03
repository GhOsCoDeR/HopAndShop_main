'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Define product type
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  subcategory?: string;
  brand?: string;
  inStock: boolean;
  rating?: number;
  numReviews?: number;
  imageUrl?: string;
}

export default function DatabaseViewerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageStatus, setImageStatus] = useState<Record<number, 'loading' | 'loaded' | 'error'>>({});
  const [fixingImages, setFixingImages] = useState(false);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      setProducts(data);
      
      // Reset image status when products are loaded
      setImageStatus({});
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // Handle image load error
  const handleImageError = (id: number) => {
    setImageStatus(prev => ({
      ...prev,
      [id]: 'error'
    }));
  };

  // Handle image load success
  const handleImageLoad = (id: number) => {
    setImageStatus(prev => ({
      ...prev,
      [id]: 'loaded'
    }));
  };

  // Function to sync images from localStorage (homepage products)
  const syncImagesFromHomepage = async () => {
    if (fixingImages) return;
    
    try {
      setFixingImages(true);
      console.log('Starting image sync process...');
      
      // Step 1: Check if localStorage has products
      let localStorageProducts;
      try {
        localStorageProducts = localStorage.getItem('products');
        console.log('Products in localStorage:', localStorageProducts ? `Found (${localStorageProducts.length} bytes)` : 'None');
        
        if (!localStorageProducts) {
          alert('No products found in localStorage! Please visit the homepage first to load products.');
          setFixingImages(false);
          return;
        }
        
        // Try parsing it to ensure it's valid JSON
        const parsedProducts = JSON.parse(localStorageProducts);
        // Log the first product's image URL for debugging
        if (parsedProducts.length > 0) {
          console.log('First product image URL:', parsedProducts[0].imageUrl?.substring(0, 100) + '...');
        }
        console.log(`Successfully parsed ${parsedProducts.length || 0} products from localStorage`);
      } catch (err) {
        console.error('LocalStorage parse error:', err);
        alert('Invalid product data in localStorage. Please visit the homepage to reload products.');
        setFixingImages(false);
        return;
      }
      
      // Step 2: Send localStorage data to the API to update database images
      try {
        console.log(`Sending request to API with product data (${localStorageProducts.length} bytes)`);
        
        const response = await fetch('/api/fix-images', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: localStorageProducts
        });
        
        console.log('Response received:', response.status, response.statusText);
        
        // Handle non-JSON responses
        const contentType = response.headers.get('content-type');
        console.log('Content-Type:', contentType);
        
        let data;
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
          console.log('Response data:', data);
        } else {
          const textResponse = await response.text();
          console.error('Unexpected response format:', textResponse);
          throw new Error('Received non-JSON response from server');
        }
        
        if (!response.ok) {
          console.error('API error response:', data);
          alert(`Error: ${data.error || 'Failed to sync images'}\n${data.suggestion || ''}`);
          setFixingImages(false);
          return;
        }
        
        // Step 3: Reload the products to show updated images
        console.log('Reloading products after update...');
        const productsResponse = await fetch('/api/products');
        if (productsResponse.ok) {
          const updatedProducts = await productsResponse.json();
          // Log the first updated product's image URL
          if (updatedProducts.length > 0) {
            console.log('First updated product image URL:', updatedProducts[0].imageUrl?.substring(0, 100) + '...');
          }
          console.log(`Loaded ${updatedProducts.length} products after update`);
          setProducts(updatedProducts);
          // Reset image loading states
          setImageStatus({});
        }
        
        if (data.updated === 0) {
          alert('Notice: No products were updated. This might be because product names don\'t match between your homepage and database.');
        } else {
          alert(`Success: ${data.message}`);
        }
      } catch (fetchError: any) {
        console.error('Network error:', fetchError);
        alert(`Error syncing images: ${fetchError.message}. Please try again.`);
      } finally {
        setFixingImages(false);
      }
    } catch (error: any) {
      console.error('Error in syncImagesFromHomepage:', error);
      alert(`An unexpected error occurred: ${error.message}`);
      setFixingImages(false);
    }
  };

  // Helper function to check if base64 image is valid
  const isValidBase64Image = (url: string): boolean => {
    if (!url.startsWith('data:image')) return false;
    
    const [header, content] = url.split(',');
    if (!header || !content) return false;
    
    // Check if it's a valid image MIME type
    if (!header.includes('image/')) return false;
    
    // Check if the content is valid base64
    try {
      atob(content);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;
    
    // If it's a base64 image, validate it
    if (url.startsWith('data:image')) {
      return isValidBase64Image(url) ? url : null;
    }
    
    // Handle relative URLs
    if (url.startsWith('/') && !url.startsWith('//')) {
      return `${window.location.origin}${url}`;
    }
    
    // Handle protocol-relative URLs
    if (url.startsWith('//')) {
      return `https:${url}`;
    }
    
    // If it's already an absolute URL, return it
    if (url.startsWith('http')) {
      return url;
    }
    
    // Otherwise, treat as relative path
    return `${window.location.origin}/${url.replace(/^\/+/, '')}`;
  };

  // Helper to get the best available image URL
  const getBestImageUrl = (product: Product): string | null => {
    if (!product.imageUrl) {
      // If no image URL, try to get a category-based image
      return PRODUCT_IMAGES[product.category.toLowerCase() as keyof typeof PRODUCT_IMAGES] || null;
    }
    
    const normalizedUrl = normalizeImageUrl(product.imageUrl);
    if (!normalizedUrl) {
      console.error(`Invalid image URL for ${product.name}`);
      return PRODUCT_IMAGES[product.category.toLowerCase() as keyof typeof PRODUCT_IMAGES] || null;
    }
    
    return normalizedUrl;
  };

  // Image component with error boundary
  const ProductImage = ({ product, size = 'small' }: { product: Product; size?: 'small' | 'large' }) => {
    const imageUrl = getBestImageUrl(product);
    const [error, setError] = useState(false);
    
    if (!imageUrl || error) {
      return (
        <div className={`flex items-center justify-center bg-gray-100 ${size === 'small' ? 'w-16 h-16' : 'w-full h-40'}`}>
          <span className="text-xs text-gray-500">No Image</span>
        </div>
      );
    }
    
    return (
      <img
        src={imageUrl}
        alt={product.name}
        className={`object-contain ${size === 'small' ? 'w-16 h-16' : 'w-full h-40'}`}
        loading="lazy"
        onError={() => setError(true)}
      />
    );
  };

  // Add category-based default images
  const PRODUCT_IMAGES = {
    phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    appliances: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    electronics: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    computing: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Database Viewer</h1>
        <div className="flex gap-2">
          <button
            onClick={syncImagesFromHomepage}
            disabled={fixingImages}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-green-300"
          >
            {fixingImages ? 'Syncing Images...' : 'Sync Images from Homepage'}
          </button>
          <Link 
            href="/admin/database" 
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Back to Database Management
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-2"></div>
          <span>Loading database contents...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md">
          <h2 className="font-semibold mb-2">Error loading database</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Products Table ({products.length} records)</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">ID</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Image</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Name</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Price</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Category</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Subcategory</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Brand</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">In Stock</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-4 px-4 text-center text-gray-500">
                      No products found in the database
                    </td>
                  </tr>
                ) : (
                  products.map((product: Product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-800 truncate max-w-[150px]">{product.id}</td>
                      <td className="py-2 px-4">
                        <div className="overflow-hidden rounded bg-gray-100">
                          <ProductImage product={product} size="small" />
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800 font-medium">{product.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{product.category}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{product.subcategory || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-800">{product.brand || '-'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-800">
                        {product.rating ? (
                          <div className="flex items-center">
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>{product.rating} ({product.numReviews})</span>
                          </div>
                        ) : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Images */}
      {products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Product Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <div key={product.id} className="bg-white p-3 rounded-lg shadow">
                <div className="relative w-full mb-2 bg-gray-100 overflow-hidden rounded">
                  <ProductImage product={product} size="large" />
                </div>
                <p className="text-sm font-medium truncate">{product.name}</p>
                <p className="text-xs text-gray-500 truncate">{product.category}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 