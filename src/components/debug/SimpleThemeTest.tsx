'use client'

import { useEffect } from 'react'

export function SimpleThemeTest() {
  useEffect(() => {
    // Test direct theme application
    const testDirectTheme = () => {
      const root = document.documentElement
      const body = document.body
      
      console.log('=== THEME TEST ===')
      console.log('Current data-theme:', root.getAttribute('data-theme'))
      console.log('Current body classes:', body.className)
      console.log('Current root classes:', root.className)
      
      // Test applying dark theme directly
      root.setAttribute('data-theme', 'dark')
      body.classList.add('dark')
      root.classList.add('dark')
      
      // Apply inline styles for testing
      root.style.setProperty('--background', '222.2 84% 4.9%')
      root.style.setProperty('--foreground', '210 40% 98%')
      
      // Apply direct background color for testing
      document.body.style.backgroundColor = '#09090b'
      document.body.style.color = '#fafafa'
      
      console.log('After applying dark theme:')
      console.log('data-theme:', root.getAttribute('data-theme'))
      console.log('body classes:', body.className)
      console.log('root classes:', root.className)
      console.log('CSS vars applied:', {
        background: getComputedStyle(root).getPropertyValue('--background'),
        foreground: getComputedStyle(root).getPropertyValue('--foreground')
      })
      console.log('Body styles:', {
        bgColor: getComputedStyle(document.body).backgroundColor,
        color: getComputedStyle(document.body).color
      })
    }
    
    // Run test after a short delay
    const timer = setTimeout(testDirectTheme, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <div className="fixed top-4 left-4 bg-red-500 text-white p-4 rounded z-50">
      <h3>Simple Theme Test</h3>
      <p>Check console for logs</p>
      <button 
        onClick={() => {
          document.body.style.backgroundColor = '#ff0000'
          console.log('Background changed to red')
        }}
        className="bg-white text-black px-2 py-1 rounded mt-2"
      >
        Test Red Background
      </button>
    </div>
  )
}