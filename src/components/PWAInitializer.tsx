'use client'

import { useEffect } from 'react'
import { initPWAFixes, fixIOSViewport } from '@/utils/pwa-fixes'

export default function PWAInitializer() {
  useEffect(() => {
    // Initialize PWA fixes for iOS input handling
    initPWAFixes()
    
    // Fix iOS viewport issues
    fixIOSViewport()
  }, [])

  return null // This component doesn't render anything
}
