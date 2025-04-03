'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import ProductModal from '@/components/admin/ProductModal'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { loadProducts, saveProducts, deleteProduct, subscribeToProductUpdates } from '@/utils/productStorage'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [preSelectedCategory, setPreSelectedCategory] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  
  // Get URL parameters for direct actions
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const addParam = searchParams.get('add') === 'true'

  // Initialize products from storage
  useEffect(() => {
    async function initializeProducts() {
      setIsLoading(true)
      
      try {
        // Try to load from server first
        const response = await fetch('/api/products/load')
        if (response.ok) {
          const data = await response.json()
          if (data.products && Array.isArray(data.products)) {
            setProducts(data.products)
            localStorage.setItem('products', JSON.stringify(data.products))
            console.log('Admin: Loaded products from server:', data.products.length)
          }
    } else {
          // If server fails, load from localStorage or fallback
          const storedProducts = await loadProducts()
          setProducts(storedProducts)
          console.log('Admin: Loaded products from localStorage:', storedProducts.length)
        }
      } catch (error) {
        console.error('Error initializing products:', error)
        // Use fallback if everything fails
        const storedProducts = await loadProducts()
        setProducts(storedProducts)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeProducts()
    
    // Set category filter from URL parameter if provided
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      
      // If adding a new product with a specific category pre-selected
      if (addParam) {
        setPreSelectedCategory(categoryParam)
      }
    }
    
    // Open add product modal if requested via URL
    if (addParam) {
      setSelectedProduct(undefined)
      setIsModalOpen(true)
    }
    
    // Subscribe to product updates
    const unsubscribe = subscribeToProductUpdates(async () => {
      const updatedProducts = await loadProducts()
      setProducts(updatedProducts)
      console.log('Admin: Updated products from event')
    })
    
    // Clean up subscription
    return () => {
      unsubscribe()
    }
  }, [categoryParam, addParam])

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const hasValidImage = product.image && 
                         product.image !== '/images/placeholder.jpg' && 
                         !product.image.includes('undefined') &&
                         !product.image.includes('null');

    const matchesSearch = searchQuery ? 
      ((product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchQuery.toLowerCase())) : true;
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    // If "All Categories" is selected, apply the image filter
    if (!selectedCategory) {
      return hasValidImage && matchesSearch;
    }
    
    // Otherwise just use category and search filters
    return matchesSearch && matchesCategory;
  })

  // Get unique categories from valid products only
  const categories = Array.from(new Set(
    products
      .filter(product => 
        product.image && 
        product.image !== '/images/placeholder.jpg' && 
        !product.image.includes('undefined') &&
        !product.image.includes('null')
      )
      .map(p => p.category)
  )).filter(Boolean); // Remove any null/undefined categories

  const handleSaveProduct = async (updatedProduct: Partial<Product>) => {
    try {
      console.log('Saving product:', updatedProduct);
      
      if (selectedProduct) {
        // Ensure we don't lose required fields when updating
        const completeUpdatedProduct = {
          ...selectedProduct,
          ...updatedProduct,
          id: selectedProduct.id // Ensure ID doesn't change
        };
        
        console.log('Updating existing product:', completeUpdatedProduct.id);
        
        // Update existing product
        const updatedProducts = products.map(p =>
          p.id === selectedProduct.id ? completeUpdatedProduct : p
        );
        
        // Save to state and storage
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);

        // Force update localStorage directly
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        console.log('Product updated successfully');
      } else {
        // Create new product with all required fields
        const newProduct = {
          id: `prod_${Date.now()}`,
          name: updatedProduct.name || '',
          description: updatedProduct.description || '',
          price: updatedProduct.price || 0,
          image: updatedProduct.image || '',
          additionalImages: updatedProduct.additionalImages || [],
          category: updatedProduct.category || '',
          subcategory: updatedProduct.subcategory || '',
          brand: updatedProduct.brand || '',
          rating: updatedProduct.rating || 4.5,
          reviews: updatedProduct.reviews || 10,
          stock: updatedProduct.stock || 100,
          stockStatus: updatedProduct.stock && updatedProduct.stock > 0 ? 'in_stock' : 'out_of_stock',
          specifications: updatedProduct.specifications || {},
          features: updatedProduct.features || [],
          discountPercentage: updatedProduct.discountPercentage || 0,
          express: updatedProduct.express || false,
          isTopDeal: updatedProduct.isTopDeal || false,
          isFlashSale: updatedProduct.isFlashSale || false,
          originalPrice: updatedProduct.originalPrice
        } as Product;

        // If originalPrice isn't explicitly provided but there's a discount percentage, calculate it
        if (!newProduct.originalPrice && newProduct.discountPercentage && newProduct.discountPercentage > 0) {
          const discount = newProduct.discountPercentage / 100;
          newProduct.originalPrice = Math.round(newProduct.price / (1 - discount));
        }

        console.log('Adding new product:', newProduct.id);

        const updatedProducts = [...products, newProduct];
        
        // Save to state and storage
        setProducts(updatedProducts);
        await saveProducts(updatedProducts);
        
        // Force update localStorage directly
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        
        console.log('New product added successfully');
      }

      setSelectedProduct(undefined);
      setIsModalOpen(false);
      
      // Show success message
      alert(selectedProduct ? 'Product updated successfully!' : 'Product added successfully!');
      
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        // Delete product and update local state
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
        
        // Delete from storage
        await deleteProduct(productId);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product. Please try again.');
      }
    }
  };

  // Function to clean the database by removing invalid products
  const cleanDatabase = async () => {
    if (confirm('Are you sure you want to remove all products without valid images? This action cannot be undone.')) {
      try {
        // Filter out products without valid images
        const validProducts = products.filter(product => 
          product.image && 
          product.image !== '/images/placeholder.jpg' && 
          !product.image.includes('undefined') &&
          !product.image.includes('null') &&
          product.name && // Ensure product has a name
          product.description && // Ensure product has a description
          product.category // Ensure product has a category
        );
        
        // Save only the valid products
        setProducts(validProducts);
        
        // Force-save to localStorage first
        localStorage.setItem('products', JSON.stringify(validProducts));
        
        // Then save to server
        await saveProducts(validProducts);
        
        // Force a page refresh to ensure everything is updated
        alert(`Cleaned database. Removed ${products.length - validProducts.length} invalid products. The page will now refresh.`);
        window.location.reload();
      } catch (error) {
        console.error('Error cleaning database:', error);
        alert('Failed to clean database. Please try again.');
      }
    }
  };

  // Function to completely reset the products database
  const resetProducts = async () => {
    if (confirm('⚠️ WARNING: This will COMPLETELY RESET your products database and remove ALL products. This action cannot be undone. Continue?')) {
      try {
        // Create an empty products array
        const emptyProducts: Product[] = [];
        
        // Save empty products array to localStorage
        localStorage.removeItem('products');
        localStorage.setItem('products', JSON.stringify(emptyProducts));
        
        // Save to server
        await saveProducts(emptyProducts);
        
        // Update state
        setProducts(emptyProducts);
        
        alert('Products database has been completely reset. The page will now refresh.');
        window.location.reload();
      } catch (error) {
        console.error('Error resetting products database:', error);
        alert('Failed to reset products database. Please try again.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <div className="flex gap-2">
          <button
            onClick={resetProducts}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-800 rounded-md hover:bg-red-900"
          >
            Reset Products
          </button>
          <button
            onClick={cleanDatabase}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Clean Database
          </button>
        <button
          onClick={() => {
            setSelectedProduct(undefined)
            setIsModalOpen(true)
          }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="" key="all-categories">All Categories</option>
          {categories.map((category, index) => (
            <option key={category || `category-${index}`} value={category}>
              {category || 'Uncategorized'}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
      <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredProducts.length > 0 ? (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                          src={product.image || '/images/placeholder.jpg'}
                          alt={product.name || 'Product'}
                          className="h-10 w-10 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = '/images/placeholder.jpg';
                          }}
                    />
                    <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {product.name || 'Unnamed Product'}
                            {product.express && (
                              <span className="px-1.5 py-0.5 text-xs font-medium text-blue-600 bg-blue-50 rounded">EXPRESS</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 max-w-sm truncate">{product.description || 'No description'}</div>
                          <div className="text-xs text-gray-400">{product.brand || 'No brand'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category || 'Uncategorized'}</div>
                      {product.subcategory && (
                        <div className="text-xs text-gray-500">{product.subcategory}</div>
                      )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">GHS {(product.price || 0).toFixed(2)}</div>
                  {product.originalPrice && (
                    <div className="text-sm text-gray-500 line-through">
                          GHS {(product.originalPrice || 0).toFixed(2)}
                        </div>
                      )}
                      {product.discountPercentage && product.discountPercentage > 0 && (
                        <div className="text-xs text-green-600">
                          {product.discountPercentage}% off
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.stockStatus === 'in_stock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedProduct(product)
                      setIsModalOpen(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
      </div>
      )}

      {/* Product Modal */}
      {isModalOpen && (
      <ProductModal
        isOpen={isModalOpen}
          product={selectedProduct}
          onSave={handleSaveProduct}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(undefined)
            setPreSelectedCategory('')
        }}
          preSelectedCategory={preSelectedCategory}
      />
      )}
    </div>
  )
} 