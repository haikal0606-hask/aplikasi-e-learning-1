'use client'

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { AccessibilityManager, AccessibilityPreferences } from '@/lib/accessibility'

interface AccessibilityContextType {
  preferences: AccessibilityPreferences
  updatePreferences: (updates: Partial<AccessibilityPreferences>) => void
  setTheme: (theme: AccessibilityPreferences['theme']) => void
  setFontSize: (fontSize: AccessibilityPreferences['fontSize']) => void
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleAudio: () => void
  setSpeechRate: (rate: number) => void
  reset: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [preferences, setPreferences] = React.useState<AccessibilityPreferences>(() => {
    // Default to light theme for server-side rendering to prevent hydration mismatch
    return {
      theme: 'light',
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReaderOptimized: true,
      keyboardNavigation: true,
      audioEnabled: true,
      speechRate: 0.9
    }
  })
  
  const [isClient, setIsClient] = React.useState(false)

  useEffect(() => {
    setIsClient(true)
    const manager = AccessibilityManager.getInstance()
    
    // Get actual preferences from localStorage after client mount
    const actualPreferences = manager.getPreferences()
    setPreferences(actualPreferences)
    
    // Apply preferences to document immediately
    manager.applyToDocument()
    
    // Subscribe to changes
    const unsubscribe = manager.subscribe((newPreferences) => {
      setPreferences(newPreferences)
      manager.applyToDocument()
    })

    return unsubscribe
  }, [])

  const updatePreferences = (updates: Partial<AccessibilityPreferences>) => {
    const manager = AccessibilityManager.getInstance()
    manager.updatePreferences(updates)
  }

  const setTheme = (theme: AccessibilityPreferences['theme']) => {
    const manager = AccessibilityManager.getInstance()
    manager.setTheme(theme)
  }

  const setFontSize = (fontSize: AccessibilityPreferences['fontSize']) => {
    const manager = AccessibilityManager.getInstance()
    manager.setFontSize(fontSize)
  }

  const toggleHighContrast = () => {
    const manager = AccessibilityManager.getInstance()
    manager.toggleHighContrast()
  }

  const toggleReducedMotion = () => {
    const manager = AccessibilityManager.getInstance()
    manager.toggleReducedMotion()
  }

  const toggleAudio = () => {
    const manager = AccessibilityManager.getInstance()
    manager.toggleAudio()
  }

  const setSpeechRate = (rate: number) => {
    const manager = AccessibilityManager.getInstance()
    manager.setSpeechRate(rate)
  }

  const reset = () => {
    const manager = AccessibilityManager.getInstance()
    manager.reset()
  }

  const value: AccessibilityContextType = {
    preferences,
    updatePreferences,
    setTheme,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleAudio,
    setSpeechRate,
    reset
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibilityContext() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibilityContext must be used within an AccessibilityProvider')
  }
  return context
}