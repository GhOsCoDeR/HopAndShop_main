'use client'

/**
 * Force a hard refresh of the page to ensure all styles and components are reloaded
 */
export function forceHardRefresh() {
  if (typeof window !== 'undefined') {
    // Force reload from server rather than cache
    window.location.reload()
  }
}

/**
 * Force clear client-side cache and reload the page
 */
export function clearCacheAndRefresh() {
  if (typeof window !== 'undefined') {
    // Clear localStorage cache if needed
    localStorage.removeItem('productCache')
    
    // Add cache-busting parameter to the URL
    const currentUrl = new URL(window.location.href)
    currentUrl.searchParams.set('t', Date.now().toString())
    window.location.href = currentUrl.toString()
  }
} 