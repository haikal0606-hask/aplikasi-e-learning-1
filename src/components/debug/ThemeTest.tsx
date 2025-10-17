'use client'

import React from 'react'
import { AccessibilityManager } from '@/lib/accessibility'

export function ThemeTest() {
  const testTheme = (theme: 'light' | 'dark' | 'high-contrast') => {
    console.log(`Testing theme: ${theme}`)
    const manager = AccessibilityManager.getInstance()
    manager.setTheme(theme)
    
    // Check current state
    const root = document.documentElement
    const body = document.body
    console.log('Current state:', {
      dataTheme: root.getAttribute('data-theme'),
      rootClasses: root.className,
      bodyClasses: body.className,
      computedBg: getComputedStyle(document.body).backgroundColor
    })
  }

  return (
    <div className="fixed bottom-4 right-4 bg-card border rounded-lg p-4 shadow-lg z-50">
      <h4 className="font-semibold mb-2">Theme Test</h4>
      <div className="flex gap-2">
        <button 
          onClick={() => testTheme('light')}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
        >
          Light
        </button>
        <button 
          onClick={() => testTheme('dark')}
          className="px-3 py-1 bg-gray-800 text-white rounded text-sm"
        >
          Dark
        </button>
        <button 
          onClick={() => testTheme('high-contrast')}
          className="px-3 py-1 bg-black text-white rounded text-sm"
        >
          High Contrast
        </button>
      </div>
    </div>
  )
}