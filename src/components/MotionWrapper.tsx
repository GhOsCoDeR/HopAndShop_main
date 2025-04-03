'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  initial?: any
  animate?: any
  exit?: any
  transition?: any
  whileHover?: any
  whileTap?: any
}

export function MotionDiv({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
}: MotionWrapperProps) {
  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {children}
    </motion.div>
  )
}

export function MotionButton({
  children,
  className,
  initial,
  animate,
  exit,
  transition,
  whileHover,
  whileTap,
}: MotionWrapperProps) {
  return (
    <motion.button
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
    >
      {children}
    </motion.button>
  )
} 