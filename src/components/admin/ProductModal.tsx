'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/types/product'
import { Dialog } from '@headlessui/react'
import { X, Search } from 'lucide-react'

// Define a hierarchical category structure with main categories and subcategories
const CATEGORY_HIERARCHY = [
  {
    main: 'phones',
    display: 'Phones & Tablets',
    subcategories: [
      'Smartphones',
      'Feature Phones',
  'Tablets',
  'Smartwatches',
      'Phone Accessories',
      'Tablet Accessories',
      'Screen Protectors',
      'Phone Cases'
    ]
  },
  {
    main: 'computing',
    display: 'Computing',
    subcategories: [
      'Laptops',
      'Desktops',
      'Monitors',
      'Printers',
      'Computer Accessories',
      'Keyboards',
      'Mice',
      'Storage Devices',
      'Software'
    ]
  },
  {
    main: 'electronics',
    display: 'Electronics',
    subcategories: [
      'TVs',
      'Audio Equipment',
  'Speakers',
  'Headphones',
  'Cameras',
      'Video Games',
      'Gaming Consoles',
  'Smart Home Devices',
      'Projectors',
      'Streaming Devices'
    ]
  },
  {
    main: 'appliances',
    display: 'Appliances',
    subcategories: [
      'Refrigerators',
      'Washing Machines',
      'Microwaves',
      'Air Conditioners',
      'Fans',
      'Kitchen Appliances',
      'Blenders',
      'Coffee Makers',
      'Vacuum Cleaners',
      'Irons'
    ]
  },
  {
    main: 'fashion',
    display: 'Fashion',
    subcategories: [
  'Men\'s Clothing',
  'Women\'s Clothing',
      'Children\'s Clothing',
  'Shoes',
      'Bags',
      'Watches',
  'Jewelry',
  'Accessories',
      'Sportswear',
      'Traditional Wear'
    ]
  },
  {
    main: 'home',
    display: 'Home & Office',
    subcategories: [
  'Furniture',
  'Kitchen & Dining',
  'Bedding',
      'Bathroom',
      'Home Decor',
      'Office Furniture',
      'Office Supplies',
      'Stationery',
  'Lighting',
      'Rugs & Carpets'
    ]
  },
  {
    main: 'supermarket',
    display: 'Supermarket',
    subcategories: [
      'Food',
      'Beverages',
      'Baking & Cooking',
      'Canned & Packaged Foods',
      'Snacks',
      'Health Foods',
      'Household Supplies',
      'Personal Care',
      'Baby Products',
      'Pet Supplies'
    ]
  },
  {
    main: 'health',
    display: 'Health & Beauty',
    subcategories: [
      'Skincare',
      'Hair Care',
      'Makeup',
      'Fragrances',
      'Personal Care',
      'Health Care',
      'Vitamins & Supplements',
      'First Aid',
      'Medical Supplies',
      'Sexual Wellness'
    ]
  },
  {
    main: 'gaming',
    display: 'Gaming',
    subcategories: [
      'Video Games',
      'Gaming Consoles',
      'Gaming Accessories',
      'PC Gaming',
      'Gaming Laptops',
      'Gaming Chairs',
      'Gaming Headsets',
      'Gaming Keyboards',
      'Gaming Mice',
      'Gaming Controllers'
    ]
  },
  {
    main: 'sporting',
    display: 'Sports & Fitness',
    subcategories: [
  'Exercise Equipment',
      'Sportswear',
      'Team Sports',
      'Water Sports',
      'Camping & Hiking',
      'Cycling',
      'Fitness Accessories',
  'Outdoor Recreation',
      'Sports Accessories',
      'Gym Equipment'
    ]
  }
];

// Generate a flat list of all categories for search purposes
const ALL_CATEGORIES = CATEGORY_HIERARCHY.flatMap(category => [
  category.main, 
  category.display, 
  ...category.subcategories.map(sub => `${category.display}: ${sub}`)
]);

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (product: Partial<Product>) => void
  product?: Product
  preSelectedCategory?: string
}

export default function ProductModal({ isOpen, onClose, onSave, product, preSelectedCategory }: ProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
    name: '',
    description: '',
    price: 0,
      category: preSelectedCategory || '',
      subcategory: '',
      brand: '',
      stock: 100,
      image: '',
      additionalImages: [],
      stockStatus: 'in_stock',
      rating: 4.5,
      reviews: 10,
      specifications: {},
      features: [],
      discountPercentage: 0,
      express: false,
      isTopDeal: false,
      isFlashSale: false
    }
  )

  // For managing specifications as key-value pairs
  const [specs, setSpecs] = useState<{key: string, value: string}[]>([{key: '', value: ''}])
  // For managing features as an array of strings
  const [featuresList, setFeaturesList] = useState<string[]>([''])

  const [categorySearch, setCategorySearch] = useState('')
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('')
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([])

  // Helper function to extract main category from combined or subcategory strings
  const extractMainCategory = (categoryString: string): string => {
    // If it's a main category, return it directly
    const mainCategoryEntry = CATEGORY_HIERARCHY.find(c => 
      c.main === categoryString.toLowerCase() || 
      c.display === categoryString
    );
    
    if (mainCategoryEntry) {
      return mainCategoryEntry.main;
    }
    
    // If it's a subcategory (format: "Main Category: Subcategory"), extract the main part
    if (categoryString.includes(':')) {
      const mainPart = categoryString.split(':')[0].trim();
      const matchingCategory = CATEGORY_HIERARCHY.find(c => c.display === mainPart);
      return matchingCategory ? matchingCategory.main : '';
    }
    
    return '';
  };

  // Helper function to extract subcategory from combined string
  const extractSubcategory = (categoryString: string): string => {
    // If it's a subcategory (format: "Main Category: Subcategory"), extract the sub part
    if (categoryString.includes(':')) {
      return categoryString.split(':')[1].trim();
    }
    return '';
  };

  // Filter categories based on search
  const filteredCategories = ALL_CATEGORIES.filter(category =>
    category.toLowerCase().includes(categorySearch.toLowerCase())
  );

  // Get available subcategories for the selected main category
  const availableSubcategories = selectedMainCategory ? 
    CATEGORY_HIERARCHY.find(c => c.main === selectedMainCategory || c.display === selectedMainCategory)?.subcategories || [] 
    : [];

  // Update main category when category changes (extract main category from full category string)
  useEffect(() => {
    if (formData.category) {
      const mainCategory = extractMainCategory(formData.category);
      if (mainCategory) {
        setSelectedMainCategory(mainCategory);
      }
      
      // If category has changed but it's not a subcategory format, clear subcategory
      if (!formData.category.includes(':') && formData.subcategory) {
        setFormData(prev => ({ ...prev, subcategory: '' }));
      }
    }
  }, [formData.category]);

  // Update form data when product changes or when preSelectedCategory changes
  useEffect(() => {
    if (product) {
      // Initialize with the product data
      const productData = {
        ...product,
        price: product.price || 0,
        stock: product.stock || 0,
        brand: product.brand || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        description: product.description || '',
        name: product.name || '',
        image: product.image || '',
        additionalImages: product.additionalImages || [],
        stockStatus: product.stockStatus || 'in_stock',
        rating: product.rating || 4.5,
        reviews: product.reviews || 10,
        specifications: product.specifications || {},
        features: product.features || [],
        discountPercentage: product.discountPercentage || 0,
        express: product.express || false,
        isTopDeal: product.isTopDeal || false,
        isFlashSale: product.isFlashSale || false
      };
      
      setFormData(productData);
      
      // Extract main category
      if (product.category) {
        const mainCategory = extractMainCategory(product.category);
        if (mainCategory) {
          setSelectedMainCategory(mainCategory);
        }
      }
      
      // Convert specifications object to array of key-value pairs
      if (product.specifications) {
        const specArray = Object.entries(product.specifications).map(([key, value]) => ({
          key,
          value: String(value)
        }))
        setSpecs(specArray.length > 0 ? specArray : [{key: '', value: ''}])
      }
      
      // Set features array
      if (product.features && product.features.length > 0) {
        setFeaturesList(product.features)
      } else {
        setFeaturesList([''])
      }
      
      setCategorySearch(product.category || '')
      setImagePreview(product.image || null)
      
      // Set additional images previews
      if (product.additionalImages && product.additionalImages.length > 0) {
        setAdditionalImagePreviews(product.additionalImages)
      } else {
        setAdditionalImagePreviews([])
      }
    } else {
      // If no product, use preSelectedCategory if available
      let initialMainCategory = '';
      if (preSelectedCategory) {
        initialMainCategory = extractMainCategory(preSelectedCategory);
        setCategorySearch(preSelectedCategory);
      }
      
      setFormData({
        name: '',
        description: '',
        price: 0,
        category: preSelectedCategory || '',
        subcategory: '',
        brand: '',
        stock: 100,
        image: '',
        additionalImages: [],
        stockStatus: 'in_stock',
        rating: 4.5,
        reviews: 10,
        specifications: {},
        features: [],
        discountPercentage: 0,
        express: false,
        isTopDeal: false,
        isFlashSale: false
      });
      
      setSelectedMainCategory(initialMainCategory);
      setSpecs([{key: '', value: ''}]);
      setFeaturesList(['']);
      setImagePreview(null);
      setAdditionalImagePreviews([]);
    }
  }, [product, preSelectedCategory]);

  // Handle subcategory selection
  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategory = e.target.value;
    // Find the main category display name
    const mainCategoryEntry = CATEGORY_HIERARCHY.find(c => c.main === selectedMainCategory);
    
    if (mainCategoryEntry && subcategory) {
      // Update category to show both main and sub category
      const fullCategory = `${mainCategoryEntry.display}: ${subcategory}`;
      setFormData({ 
        ...formData, 
        category: mainCategoryEntry.main, // Store main category key in category field
        subcategory: subcategory // Store subcategory name separately
      });
      setCategorySearch(fullCategory); // Display combined format in the search field
    } else {
      // If no subcategory is selected, just use the main category
      const mainCategoryEntry = CATEGORY_HIERARCHY.find(c => c.main === selectedMainCategory);
      if (mainCategoryEntry) {
        setFormData({
          ...formData,
          category: mainCategoryEntry.main,
          subcategory: ''
        });
        setCategorySearch(mainCategoryEntry.display);
      }
    }
  };

  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let updatedFormData = { ...formData }

    // Convert specs array to specifications object
    const specificationsObj: Record<string, string> = {}
    specs.forEach(spec => {
      if (spec.key.trim() && spec.value.trim()) {
        specificationsObj[spec.key.trim()] = spec.value.trim()
      }
    })
    updatedFormData.specifications = specificationsObj

    // Filter out empty features
    updatedFormData.features = featuresList.filter(f => f.trim() !== '')

    // Calculate original price based on discount percentage if provided
    if (updatedFormData.price && updatedFormData.discountPercentage) {
      const discount = updatedFormData.discountPercentage / 100
      updatedFormData.originalPrice = Math.round(updatedFormData.price / (1 - discount))
    }

    // Handle image - in a real app, you would upload the image to a server
    // For now, we'll use the uploaded image if there is one, otherwise use the category placeholder
    if (imageFile && imagePreview) {
      // Use the data URL from the preview as the image source
      updatedFormData.image = imagePreview
    } else if (!updatedFormData.image) {
      // If no image file and no existing image, use placeholder
      const placeholders = {
        phones: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        appliances: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        tvs: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        fashion: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        furniture: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        beauty: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        audio: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        gaming: 'https://images.unsplash.com/photo-1586182987320-4f376d39d787?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        supermarket: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }
      
      const category = updatedFormData.category as keyof typeof placeholders
      updatedFormData.image = placeholders[category] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }

    onSave(updatedFormData)
      onClose()
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      
      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Add a new empty specification field
  const addSpecification = () => {
    setSpecs([...specs, {key: '', value: ''}])
  }

  // Remove a specification field
  const removeSpecification = (index: number) => {
    if (specs.length > 1) {
      const newSpecs = [...specs]
      newSpecs.splice(index, 1)
      setSpecs(newSpecs)
    }
  }

  // Update a specification field
  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = value
    setSpecs(newSpecs)
  }

  // Add a new empty feature field
  const addFeature = () => {
    setFeaturesList([...featuresList, ''])
  }

  // Remove a feature field
  const removeFeature = (index: number) => {
    if (featuresList.length > 1) {
      const newFeatures = [...featuresList]
      newFeatures.splice(index, 1)
      setFeaturesList(newFeatures)
    }
  }

  // Update a feature field
  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...featuresList]
    newFeatures[index] = value
    setFeaturesList(newFeatures)
  }

  // Add function to handle additional image upload
  const handleAdditionalImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Create a preview
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string
          setAdditionalImagePreviews(prev => [...prev, imageUrl])
          
          // Update formData with the new additional image
          setFormData(prev => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), imageUrl]
          }))
        }
      }
      reader.readAsDataURL(file)
    }
    
    // Clear the input value to allow selecting the same file again
    e.target.value = ''
  }

  // Add function to remove an additional image
  const removeAdditionalImage = (index: number) => {
    setAdditionalImagePreviews(prev => {
      const newPreviews = [...prev]
      newPreviews.splice(index, 1)
      return newPreviews
    })
    
    setFormData(prev => {
      const newAdditionalImages = [...(prev.additionalImages || [])]
      newAdditionalImages.splice(index, 1)
      return {
        ...prev,
        additionalImages: newAdditionalImages
      }
    })
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-lg max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
            <Dialog.Title className="text-lg font-semibold">
                      {product ? 'Edit Product' : 'Add New Product'}
                    </Dialog.Title>
                              <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
                              >
              <X className="w-5 h-5" />
                              </button>
                      </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
            {/* Basic Product Information */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Basic Information</h3>
              <div className="space-y-4">
                      <div>
              <label className="block text-sm font-medium text-gray-700">
                          Product Name
                        </label>
                        <input
                          type="text"
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          required
                        />
                      </div>

                      <div>
              <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          rows={3}
                          required
                        />
                      </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700">
                      Category *
                        </label>
                <div className="relative">
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={e => {
                      setCategorySearch(e.target.value)
                      setIsCategoryDropdownOpen(true)
                    }}
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                    placeholder="Search categories..."
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                        required
                  />
                  <Search className="absolute right-3 top-[13px] w-4 h-4 text-gray-400" />
                </div>
                {isCategoryDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCategories.map(category => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => {
                              // If the category includes a colon, it's a subcategory
                              if (category.includes(':')) {
                                const mainPart = category.split(':')[0].trim();
                                const subPart = category.split(':')[1].trim();
                                const mainCategoryEntry = CATEGORY_HIERARCHY.find(c => c.display === mainPart);
                                
                                if (mainCategoryEntry) {
                                  setSelectedMainCategory(mainCategoryEntry.main);
                                  setFormData({
                                    ...formData,
                                    category: mainCategoryEntry.main,
                                    subcategory: subPart
                                  });
                                }
                              } else {
                                // It's a main category
                                const mainCategoryEntry = CATEGORY_HIERARCHY.find(
                                  c => c.main === category.toLowerCase() || c.display === category
                                );
                                
                                if (mainCategoryEntry) {
                                  setSelectedMainCategory(mainCategoryEntry.main);
                                  setFormData({
                                    ...formData,
                                    category: mainCategoryEntry.main,
                                    subcategory: ''
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    category,
                                    subcategory: ''
                                  });
                                }
                              }
                              
                              setCategorySearch(category);
                              setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                              categorySearch === category ? 'bg-gray-100' : ''
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
                      </div>

                  {selectedMainCategory && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subcategory
                      </label>
                      <select
                        value={formData.subcategory || ''}
                        onChange={handleSubcategoryChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      >
                        <option value="">Select a subcategory</option>
                        {availableSubcategories.map(sub => (
                          <option key={sub} value={sub}>
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                      <div>
                <label className="block text-sm font-medium text-gray-700">
                  Brand
                        </label>
                        <input
                  type="text"
                  value={formData.brand || ''}
                  onChange={e => setFormData({ ...formData, brand: e.target.value })}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
                </div>
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-2">Pricing & Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Price (GHS)
                  </label>
                  <input
                    type="number"
                    value={formData.price || 0}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    value={formData.discountPercentage || 0}
                    onChange={e => setFormData({ ...formData, discountPercentage: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    max="99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stock || 0}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Express Delivery Option */}
            <div>
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id="express-delivery"
                  checked={formData.express || false}
                  onChange={e => setFormData({ ...formData, express: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="express-delivery" className="ml-2 block text-sm text-gray-700">
                  Available for Express Delivery
                </label>
              </div>
              
              <div className="flex items-center mb-1">
                <input
                  type="checkbox"
                  id="top-deal"
                  checked={formData.isTopDeal || false}
                  onChange={e => setFormData({ ...formData, isTopDeal: e.target.checked })}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="top-deal" className="ml-2 block text-sm text-gray-700">
                  Show in Top Deals
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="flash-sale"
                  checked={formData.isFlashSale || false}
                  onChange={e => setFormData({ ...formData, isFlashSale: e.target.checked })}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="flash-sale" className="ml-2 block text-sm text-gray-700">
                  Include in Flash Sale
                </label>
              </div>
            </div>

            {/* Specifications */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900">Specifications</h3>
                <button
                  type="button"
                  onClick={addSpecification}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Specification
                </button>
              </div>
              
              <div className="space-y-2">
                {specs.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={e => updateSpecification(index, 'key', e.target.value)}
                      placeholder="Specification (e.g. Weight)"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                    <input
                      type="text"
                      value={spec.value}
                      onChange={e => updateSpecification(index, 'value', e.target.value)}
                      placeholder="Value (e.g. 500g)"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                    {specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-gray-900">Features</h3>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Feature
                </button>
            </div>

              <div className="space-y-2">
                {featuresList.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={e => updateFeature(index, e.target.value)}
                      placeholder="Product feature"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2"
                    />
                    {featuresList.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Product Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main Product Image
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="h-16 w-16 object-cover rounded-lg"
                  />
                )}
              </div>
                      </div>

            {/* Additional Product Images */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Additional Product Images
                </label>
                <div className="text-xs text-gray-500">
                  Show different angles or product in use
                </div>
              </div>
              
              <div className="mt-1">
                <input
                  type="file"
                  onChange={handleAdditionalImageChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                
                {additionalImagePreviews.length > 0 && (
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    {additionalImagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Additional product view ${index + 1}`}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeAdditionalImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white border-t mt-6">
                        <button
                          type="button"
                          onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                        >
                          Cancel
                        </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {product ? 'Save Changes' : 'Add Product'}
              </button>
                      </div>
                    </form>
              </Dialog.Panel>
        </div>
      </Dialog>
  )
} 