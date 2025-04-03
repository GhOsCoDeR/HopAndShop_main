'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'

interface CartAnimationProps {
  isVisible?: boolean
  productImage: string
  cartPosition?: { x: number; y: number }
  onComplete?: () => void
  productName?: string
}

export default function CartAnimation({ 
  isVisible = true, 
  productImage, 
  cartPosition,
  onComplete,
  productName
}: CartAnimationProps) {
  const [position, setPosition] = useState(cartPosition || { x: 0, y: 0 })

  useEffect(() => {
    // Update position when component mounts or cartPosition changes
    if (cartPosition) {
      setPosition(cartPosition)
    } else {
      // Default position near cart icon in top right
      setPosition({ 
        x: typeof window !== 'undefined' ? window.innerWidth - 100 : 0, 
        y: 100 
      })
    }
  }, [cartPosition])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 1, 0],
            x: [0, position.x],
            y: [0, position.y],
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.8,
            ease: 'easeInOut',
            times: [0, 0.5, 1],
          }}
          onAnimationComplete={onComplete}
          className="fixed z-50 pointer-events-none"
        >
          <div className="relative w-16 h-16">
            <motion.img
              src={productImage}
              alt={productName || "Product"}
              className="w-full h-full object-cover rounded-lg shadow-lg"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.8,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              +1
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 