'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Heart, Star, ArrowLeft, Share2, ChevronRight, Check, X, ChevronDown, ChevronUp, Truck, RefreshCw, Shield, Info, ThumbsUp } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import Link from 'next/link'
import { products, hotDeals, featuredProducts } from '@/data/products'
import { toast } from 'react-hot-toast'
import Footer from '@/components/Footer'
import { Product } from '@/types/product'
import { useWishlistStore } from '@/store/wishlistStore'
import ProductCard from '@/components/ProductCard'
import Header from '@/components/Header'

// Combine all products for search
const allProducts = [
  ...products,
  ...hotDeals,
  ...featuredProducts
]

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
    </div>
  )
}

// Generate placeholder reviews
const generateReviews = (count: number) => {
  const reviewers = ['John D.', 'Emma S.', 'Michael T.', 'Sarah K.', 'David L.', 'Lisa M.', 'Robert P.'];
  const comments = [
    'Great product, exactly what I was looking for!',
    'The quality exceeded my expectations.',
    'Good value for the price.',
    'I use it daily and it works perfectly.',
    'Shipping was fast and the product arrived in perfect condition.',
    'Would definitely recommend to friends and family.',
    'This is my second purchase and I\'m still satisfied.'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `review-${i + 1}`,
    name: reviewers[i % reviewers.length],
    rating: Math.floor(Math.random() * 2) + 4, // Random rating between 4-5
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000).toLocaleDateString(), // Random date within last 90 days
    comment: comments[i % comments.length],
    helpful: Math.floor(Math.random() * 20)
  }));
};

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviews] = useState(() => generateReviews(Math.floor(Math.random() * 5) + 3))
  const [showReviews, setShowReviews] = useState(false)
  const [showSpecifications, setShowSpecifications] = useState(false)
  const [showDescription, setShowDescription] = useState(true)

  useEffect(() => {
    async function loadProduct() {
    setLoading(true)
      try {
        // Load products from API
        const response = await fetch('/api/products/load')
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
        const data = await response.json()
        const allProducts = data.products || []

        // Find the current product
        const currentProduct = allProducts.find((p: Product) => p.id === params.id)
        
        if (currentProduct) {
          setProduct(currentProduct)

    // Find related products from the same category
          const related = allProducts
            .filter((p: Product) => p.category === currentProduct.category && p.id !== currentProduct.id)
        .slice(0, 4)
      setRelatedProducts(related)
    }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
    setLoading(false)
      }
    }

    loadProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (product) {
      addItem({
        ...product,
        quantity: quantity
      })
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`)
    }
  }

  const incrementQuantity = () => {
    if (product?.stock && quantity < product.stock) {
      setQuantity(prev => prev + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1)
    }
  }

  const goBack = () => {
    router.back()
  }

  const handleShare = async () => {
    if (!product) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const handleWishlist = () => {
    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
        toast.success('Removed from wishlist!')
      } else {
        addToWishlist(product)
        toast.success('Added to wishlist!')
      }
    }
  }

  if (loading) {
    return <LoadingState />
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product not found</h1>
          <p className="text-lg text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={goBack}
            className="flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Calculate average rating
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Calculate discount percentage if not provided
  const discountPercentage = product.discountPercentage || (product.originalPrice && product.price ? 
    Math.round(((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100) : 0);

  // Create an array of all product images
  const allProductImages = [
    product.image, // Main image always first
    ...(product.additionalImages || []) // Add any additional images if they exist
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
      {/* Breadcrumbs */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <nav className="flex text-sm text-gray-500">
              <Link href="/" className="hover:text-orange-500">Home</Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-orange-500 capitalize">
            {product.category}
          </Link>
              <ChevronRight className="w-4 h-4 mx-1" />
              <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>
          </div>
      </div>

        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Main Product Section */}
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="md:grid md:grid-cols-12 md:gap-6">
              {/* Product Images - 5 columns on desktop */}
              <div className="md:col-span-5">
                <div className="sticky top-4 mb-4">
                  {/* Main Image */}
                  <div className="relative aspect-square bg-white border rounded-md overflow-hidden">
              <Image
                      src={allProductImages[selectedImage]}
                alt={product.name}
                fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
                    
                    {/* Discount Badge */}
                    {discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-sm">
                        -{discountPercentage}%
                </div>
              )}
                    
                    {/* Share Button */}
                    <button 
                      onClick={handleShare}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
                    >
                      <Share2 className="h-5 w-5 text-gray-500" />
                    </button>
            </div>
            
            {/* Thumbnail Images */}
                  {allProductImages.length > 1 && (
                    <div className="flex mt-2 space-x-2 overflow-x-auto py-1">
                      {allProductImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                          className={`relative flex-shrink-0 aspect-square w-16 overflow-hidden rounded-md border ${
                            selectedImage === idx ? 'border-orange-500' : 'border-gray-200'
                          }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} - view ${idx + 1}`}
                    fill
                            className="object-contain"
                            sizes="64px"
                  />
                </button>
              ))}
            </div>
                  )}
                  
                  {/* Share, Save Buttons */}
                  <div className="flex justify-between mt-4">
                    <button 
                      onClick={handleWishlist}
                      className="flex items-center text-sm text-gray-700"
                    >
                      <Heart className={`h-5 w-5 mr-1 ${
                        isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`} />
                      {isInWishlist(product.id) ? 'SAVED' : 'SAVE'}
                    </button>
                    
              <button 
                onClick={handleShare}
                      className="flex items-center text-sm text-gray-700"
              >
                      <Share2 className="h-5 w-5 mr-1 text-gray-400" />
                      SHARE
              </button>
                  </div>
                </div>
            </div>
            
              {/* Product Info - 7 columns on desktop */}
              <div className="md:col-span-7">
                {/* Brand & Product Name */}
                <div>
              {product.brand && (
                    <h3 className="text-sm font-medium text-gray-500">{product.brand}</h3>
                  )}
                  <h1 className="text-xl font-medium text-gray-900 mt-1">{product.name}</h1>
                </div>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star} 
                        className={`h-4 w-4 ${
                          star <= Math.round(avgRating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                    />
                  ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    ({reviews.length} verified ratings)
                  </span>
                </div>
                
                {/* Price */}
                <div className="mt-4 py-4 border-t border-b border-gray-200">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">
                      GHS {product.price?.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-2 text-lg line-through text-gray-500">
                        GHS {product.originalPrice?.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="mt-1 flex items-center">
                      <span className="text-orange-500 text-sm font-medium">
                        You save: GHS {(product.originalPrice - product.price).toFixed(2)} ({discountPercentage}%)
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Shipping & Delivery */}
                <div className="py-4 border-b border-gray-200">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Delivery</span>
                        <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                          Ready for pickup between Wednesday 27 Mar and Friday 29 Mar
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Standard Delivery: GHS 25 (3-5 business days)
                      </p>
                      <p className="text-sm text-gray-500">
                        Express Delivery: GHS 45 (1-2 business days)
                </p>
              </div>
            </div>
            
                  <div className="flex items-start mt-4">
                    <RefreshCw className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="ml-3">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">Return Policy</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Free return within 15 days for eligible items. 
                        <Link href="/return-policy" className="text-orange-500 ml-1">
                          Learn more
                        </Link>
                      </p>
                    </div>
                  </div>
            </div>

                {/* Stock & Quantity */}
                <div className="py-4">
            {/* Stock Status */}
                  <div className="flex items-center">
                    {product.stock && product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">In Stock</span>
                        <span className="ml-1 text-sm text-gray-500">({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <X className="h-5 w-5 mr-1.5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
                  {product.stock && product.stock > 0 && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                      <div className="flex items-center w-32 border border-gray-300 rounded-sm">
                  <button
                    onClick={decrementQuantity}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 border-r border-gray-300"
                  >
                          -
                  </button>
                        <div className="flex-1 text-center">{quantity}</div>
                  <button
                    onClick={incrementQuantity}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 border-l border-gray-300"
                  >
                          +
                  </button>
                </div>
              </div>
            )}

                  {/* Add to Cart Button */}
                  <div className="mt-6">
              <button
                onClick={handleAddToCart}
                      disabled={!product.stock || product.stock === 0}
                      className={`w-full py-3 px-6 ${
                        product.stock && product.stock > 0
                          ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-gray-400 cursor-not-allowed'
                      } text-white font-medium rounded-md flex items-center justify-center`}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      ADD TO CART
              </button>
            </div>
                </div>
                
                {/* Product Promotions */}
                <div className="py-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900">PROMOTIONS</h3>
                  <div className="mt-2 space-y-3">
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <Shield className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Genuine Product Guaranteed</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <Truck className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Free delivery for orders above GHS 250</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <RefreshCw className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">15 days return policy</p>
                      </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Product Details Accordion */}
          <div className="mt-4 bg-white rounded shadow-sm">
            {/* Product Details */}
          <div className="border-b border-gray-200">
                <button
                onClick={() => setShowDescription(!showDescription)}
                className="flex justify-between items-center w-full px-4 py-3 text-left"
              >
                <h3 className="text-base font-medium text-gray-900">Product Details</h3>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showDescription ? 'transform rotate-180' : ''}`} />
                </button>
              {showDescription && (
                <div className="px-4 pb-4 prose max-w-none text-sm text-gray-600">
                <p>{product.description}</p>
                {product.features && product.features.length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-medium text-gray-900">Key Features</h4>
                      <ul className="mt-2 list-disc pl-5 space-y-1">
                        {product.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                    </div>
                )}
              </div>
            )}
            </div>
            
            {/* Specifications */}
            <div className="border-b border-gray-200">
                      <button
                onClick={() => setShowSpecifications(!showSpecifications)}
                className="flex justify-between items-center w-full px-4 py-3 text-left"
                      >
                <h3 className="text-base font-medium text-gray-900">Specifications</h3>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showSpecifications ? 'transform rotate-180' : ''}`} />
                      </button>
              {showSpecifications && (
                <div className="px-4 pb-4">
                  {product.specifications && Object.keys(product.specifications).length > 0 ? (
                    <div className="grid grid-cols-1 divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="py-2 grid grid-cols-2 text-sm">
                          <div className="text-gray-500">{key}</div>
                          <div className="text-gray-900">{value}</div>
                        </div>
                      ))}
                  </div>
                ) : (
                    <p className="text-sm text-gray-500">No specifications available for this product.</p>
                )}
              </div>
            )}
            </div>

            {/* Customer Reviews */}
              <div>
              <button
                onClick={() => setShowReviews(!showReviews)}
                className="flex justify-between items-center w-full px-4 py-3 text-left"
              >
                    <div className="flex items-center">
                  <h3 className="text-base font-medium text-gray-900">Customer Reviews</h3>
                  <div className="ml-4 flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star} 
                          className={`h-4 w-4 ${
                            star <= Math.round(avgRating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({reviews.length} ratings)
                    </span>
                  </div>
                </div>
                <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${showReviews ? 'transform rotate-180' : ''}`} />
              </button>
              {showReviews && (
                <div className="px-4 pb-4">
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-4">
                            <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star} 
                                  className={`h-4 w-4 ${
                                    star <= review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                              by {review.name}
                            </span>
                            <span className="ml-2 text-xs text-gray-500">
                              {review.date}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                          <div className="mt-2 text-xs text-gray-500 flex items-center">
                            <span className="mr-2">Was this helpful?</span>
                            <button className="flex items-center text-gray-600 hover:text-orange-500">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Yes ({review.helpful})
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                  ) : (
                    <p className="text-sm text-gray-500">No reviews yet for this product.</p>
                  )}
              </div>
            )}
          </div>
        </div>

          {/* Similar Products */}
        {relatedProducts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-medium text-gray-900 mb-4">Similar Products</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                  <div key={relatedProduct.id}>
                    <ProductCard product={relatedProduct} />
                  </div>
                ))}
                    </div>
                  </div>
          )}
          
          {/* Recently Viewed */}
          <div className="mt-8 mb-8">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[product].map((viewedProduct) => (
                <div key={viewedProduct.id}>
                  <ProductCard product={viewedProduct} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 