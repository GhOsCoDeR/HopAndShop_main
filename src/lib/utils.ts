'use client'

import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Create a simple base64 colored placeholder
export function getColorPlaceholder(color: string = '#CCCCCC', width: number = 400, height: number = 300) {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `
  const base64 = btoa(svg)
  return `data:image/svg+xml;base64,${base64}`
}

// Simple function for generating category placeholders
export function getCategoryPlaceholder(name: string) {
  const colors: Record<string, string> = {
    supermarket: '#ff9900',
    fashion: '#cc3366',
    phones: '#3366cc',
    electronics: '#339966',
    home: '#6633cc',
    appliances: '#cc6633',
    computing: '#33cc66',
    health: '#6699cc',
    default: '#999999'
  }
  
  const color = colors[name.toLowerCase()] || colors.default
  return getColorPlaceholder(color, 48, 48)
}

// Generate banner placeholder
export function getBannerPlaceholder(name: string) {
  const colors: Record<string, string> = {
    'main-banner-1': '#ff9900',
    'main-banner-2': '#3366cc',
    'main-banner-3': '#cc3366',
    'main-banner-4': '#339966',
    'side-banner': '#6633cc',
    'promo-1': '#cc6633',
    'promo-2': '#33cc66',
    'promo-3': '#6699cc',
    'flash-sale': '#ffcc00',
    'clearance-sale': '#cc3366',
    'brand-festival': '#3366cc',
    'lg-banner': '#cc0000',
    'tecno-banner': '#0066cc',
    'xiaomi-banner': '#ff6600',
    'free-delivery': '#339966',
    'default': '#999999'
  }
  
  // Extract name from path if needed
  const basename = name.split('/').pop()?.split('.')[0] || 'default'
  const color = colors[basename] || colors.default
  
  // Size based on banner type
  let width = 700
  let height = 200
  
  if (basename.startsWith('main-banner')) {
    width = 1200
    height = 400
  } else if (basename === 'side-banner') {
    width = 400
    height = 600
  }
  
  return getColorPlaceholder(color, width, height)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
} 