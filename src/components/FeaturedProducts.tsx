'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useCartStore } from '@/store/cartStore'
import { toast } from 'react-hot-toast'
import ProductCard from '@/components/ProductCard'
import { Product } from '@/types/product'

// Convert featuredProducts to match the Product type
export const featuredProducts: Product[] = [
  {
    id: "featured1",
    name: "Samsung Galaxy S24 Ultra",
    description: "Next-gen smartphone with AI capabilities",
    price: 1199,
    image: "https://images.unsplash.com/photo-1610945415295-d609bb342e8f?w=800&auto=format&fit=crop&q=60",
    category: "Phones",
    rating: 4.8,
    reviews: 156,
    stock: 45,
    features: [
      '6.8" Dynamic AMOLED Display',
      'Snapdragon 8 Gen 3',
      '200MP Main Camera',
      '5000mAh Battery',
      'S Pen Support'
    ],
    specifications: {
      'Screen Size': '6.8 inches',
      'Processor': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Storage': '256GB',
      'Battery': '5000mAh'
    },
    originalPrice: 1299,
    discountPercentage: 8,
    express: true
  },
  {
    id: "featured2",
    name: "MacBook Pro M3",
    description: "Powerful laptop for professionals",
    price: 1999,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=60",
    category: "Computing",
    rating: 4.9,
    reviews: 234,
    stock: 30,
    features: [
      'M3 Pro Chip',
      '16-inch Retina Display',
      'Up to 22 hours battery',
      'ProMotion technology',
      'Magic Keyboard'
    ],
    specifications: {
      'Processor': 'M3 Pro',
      'Display': '16-inch Liquid Retina XDR',
      'Memory': '32GB Unified',
      'Storage': '1TB SSD',
      'Battery Life': 'Up to 22 hours'
    },
    originalPrice: 2199,
    discountPercentage: 9,
    express: true
  },
  {
    id: "featured3",
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise cancellation",
    price: 399,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&auto=format&fit=crop&q=60",
    category: "Audio",
    rating: 4.7,
    reviews: 89,
    stock: 20,
    features: [
      'Auto NC Optimizer',
      '30-hour battery life',
      'Touch controls',
      'Voice assistant support',
      'Multi-device pairing'
    ],
    specifications: {
      'Battery Life': 'Up to 30 hours',
      'Noise Cancellation': 'Auto NC Optimizer',
      'Bluetooth': '5.2',
      'Weight': '250g',
      'Charging Time': '3.5 hours'
    },
    originalPrice: 449,
    discountPercentage: 11,
    express: false
  }
]

const FeaturedProducts = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (product: typeof featuredProducts[0]) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    })
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </motion.section>
  )
}

export default FeaturedProducts 