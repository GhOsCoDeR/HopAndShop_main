import { Product } from '@/types/product'
import { products as initialProducts } from '@/data/products'

// Storage key for products in localStorage
const STORAGE_KEY = 'products'

// Custom event name for product updates
const PRODUCT_UPDATE_EVENT = 'product-storage-update'

/**
 * Save products to localStorage and to a JSON file for persistence
 */
export function saveProducts(products: Product[]): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined') {
      try {
        console.log(`Saving ${products.length} products to storage`);
        
        // Make sure products is an array with valid items
        if (!Array.isArray(products)) {
          console.error('Invalid products data (not an array):', products);
          products = [];
        }
        
        // Filter out invalid products
        const validProducts = products.filter(p => 
          p && typeof p === 'object' && p.id && 
          (typeof p.name === 'string' || p.name === null || p.name === undefined)
        );
        
        if (validProducts.length !== products.length) {
          console.warn(`Filtered out ${products.length - validProducts.length} invalid products`);
        }
        
        // Save to localStorage for current session
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validProducts));
        
        // Also save a backup copy
        localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(validProducts));
        
        // Dispatch an event so other components can react to storage changes
        window.dispatchEvent(new CustomEvent(PRODUCT_UPDATE_EVENT));
        
        // Send a request to save to server
        fetch('/api/products/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ products: validProducts }),
        })
          .then(response => {
            if (!response.ok) {
              console.error('Failed to save products to server');
              reject(new Error('Failed to save products to server'));
            } else {
              console.log(`Successfully saved ${validProducts.length} products to server`);
              resolve();
            }
          })
          .catch(error => {
            console.error('Error saving products to server:', error);
            reject(error);
          });
      } catch (error) {
        console.error('Error saving products to localStorage:', error);
        reject(error);
      }
    } else {
      resolve(); // No-op for SSR
    }
  });
}

/**
 * Load products from localStorage, falling back to file or initial products if necessary
 */
export async function loadProducts(): Promise<Product[]> {
  if (typeof window !== 'undefined') {
    try {
      // Try to load from localStorage first
      const savedProducts = localStorage.getItem(STORAGE_KEY);
      if (savedProducts) {
        try {
          const parsed = JSON.parse(savedProducts);
          if (Array.isArray(parsed)) {
            console.log(`Loaded ${parsed.length} products from localStorage`);
            return parsed;
          } else {
            console.error('Invalid products format in localStorage:', parsed);
          }
        } catch (e) {
          console.error('Error parsing products from localStorage:', e);
          
          // Try to load from backup
          const backupProducts = localStorage.getItem(`${STORAGE_KEY}_backup`);
          if (backupProducts) {
            try {
              const parsed = JSON.parse(backupProducts);
              if (Array.isArray(parsed)) {
                console.log(`Recovered ${parsed.length} products from backup in localStorage`);
                // Restore the main storage from backup
                localStorage.setItem(STORAGE_KEY, backupProducts);
                return parsed;
              }
            } catch (e) {
              console.error('Error parsing backup products from localStorage:', e);
            }
          }
        }
      }
      
      // If not in localStorage, try to load from server
      try {
        console.log('Attempting to load products from server');
        const response = await fetch('/api/products/load');
        if (response.ok) {
          const data = await response.json();
          
          if (data.products && Array.isArray(data.products)) {
            // Save to localStorage for future use
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data.products));
            // Also save a backup
            localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(data.products));
            
            // Refresh the UI
            window.dispatchEvent(new CustomEvent(PRODUCT_UPDATE_EVENT));
            console.log(`Loaded ${data.products.length} products from server`);
            return data.products;
          } else {
            console.error('Invalid products data from server:', data);
          }
        } else {
          console.error('Failed to load products from server, status:', response.status);
        }
      } catch (error) {
        console.error('Error loading products from server:', error);
      }
      
      // If we reach here, check if we should load initial products or just return an empty array
      // Check if we've already initialized products before
      const hasInitialized = localStorage.getItem('products_initialized');
      
      if (!hasInitialized) {
        // First time - load initial products
        const products = Object.values(initialProducts).flat() as Product[];
        
        // Mark as initialized so we don't load initial data again
        localStorage.setItem('products_initialized', 'true');
        
        // Save to localStorage and backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
        localStorage.setItem(`${STORAGE_KEY}_backup`, JSON.stringify(products));
        
        console.log(`Loading ${products.length} initial products for first run`);
        return products;
      } else {
        // Return empty array if we've already initialized once
        console.log('Returning empty products array as fallback');
        return [];
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }
  
  // If we reach here and localStorage is not available, return empty array
  console.log('localStorage not available, returning empty array');
  return [];
}

/**
 * Add or update a product in the stored products
 */
export async function saveProduct(product: Product): Promise<void> {
  try {
    console.log('Saving product:', product.id, product.name);
    const products = await loadProducts();
    const index = products.findIndex(p => p.id === product.id);
    
    if (index !== -1) {
      // Update existing product
      console.log(`Updating existing product at index ${index}`);
      products[index] = product;
    } else {
      // Add new product
      console.log('Adding new product');
      products.push(product);
    }
    
    await saveProducts(products);
    console.log(`Product ${product.id} saved successfully`);
  } catch (error) {
    console.error('Error in saveProduct:', error);
    throw error;
  }
}

/**
 * Delete a product from the stored products
 */
export async function deleteProduct(productId: string): Promise<void> {
  try {
    console.log('Deleting product:', productId);
    const products = await loadProducts();
    const updatedProducts = products.filter(p => p.id !== productId);
    
    if (updatedProducts.length !== products.length) {
      console.log(`Product ${productId} found and will be deleted`);
    } else {
      console.warn(`Product ${productId} not found for deletion`);
    }
    
    await saveProducts(updatedProducts);
    console.log(`Product ${productId} deleted successfully`);
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    throw error;
  }
}

/**
 * Subscribe to product storage updates
 */
export function subscribeToProductUpdates(callback: () => void): () => void {
  if (typeof window !== 'undefined') {
    const handleStorageUpdate = () => {
      callback()
    }
    
    window.addEventListener(PRODUCT_UPDATE_EVENT, handleStorageUpdate)
    window.addEventListener('storage', (event) => {
      if (event.key === STORAGE_KEY) {
        callback()
      }
    })
    
    // Return cleanup function
    return () => {
      window.removeEventListener(PRODUCT_UPDATE_EVENT, handleStorageUpdate)
      window.removeEventListener('storage', handleStorageUpdate)
    }
  }
  
  // Return no-op if not in browser
  return () => {}
} 