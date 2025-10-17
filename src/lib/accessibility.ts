export interface AccessibilityPreferences {
  theme: 'light' | 'dark' | 'high-contrast'
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  highContrast: boolean
  reducedMotion: boolean
  screenReaderOptimized: boolean
  keyboardNavigation: boolean
  audioEnabled: boolean
  speechRate: number
}

export const defaultPreferences: AccessibilityPreferences = {
  theme: 'light',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  screenReaderOptimized: true,
  keyboardNavigation: true,
  audioEnabled: true,
  speechRate: 0.9
}

export class AccessibilityManager {
  private static instance: AccessibilityManager
  private preferences: AccessibilityPreferences
  private listeners: Set<(preferences: AccessibilityPreferences) => void> = new Set()

  private constructor() {
    this.preferences = this.loadPreferences()
  }

  static getInstance(): AccessibilityManager {
    if (!AccessibilityManager.instance) {
      AccessibilityManager.instance = new AccessibilityManager()
    }
    return AccessibilityManager.instance
  }

  private loadPreferences(): AccessibilityPreferences {
    if (typeof window === 'undefined') return defaultPreferences
    
    try {
      const stored = localStorage.getItem('accessibility-preferences')
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.warn('Failed to load accessibility preferences:', error)
    }
    return defaultPreferences
  }

  private savePreferences(): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences))
    } catch (error) {
      console.warn('Failed to save accessibility preferences:', error)
    }
  }

  getPreferences(): AccessibilityPreferences {
    return { ...this.preferences }
  }

  updatePreferences(updates: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...updates }
    this.savePreferences()
    this.notifyListeners()
  }

  setTheme(theme: AccessibilityPreferences['theme']): void {
    console.log('setTheme called with:', theme)
    this.updatePreferences({ theme })
  }

  setFontSize(fontSize: AccessibilityPreferences['fontSize']): void {
    this.updatePreferences({ fontSize })
  }

  toggleHighContrast(): void {
    this.updatePreferences({ highContrast: !this.preferences.highContrast })
  }

  toggleReducedMotion(): void {
    this.updatePreferences({ reducedMotion: !this.preferences.reducedMotion })
  }

  toggleAudio(): void {
    this.updatePreferences({ audioEnabled: !this.preferences.audioEnabled })
  }

  setSpeechRate(rate: number): void {
    this.updatePreferences({ speechRate: Math.max(0.5, Math.min(2, rate)) })
  }

  subscribe(listener: (preferences: AccessibilityPreferences) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.preferences))
  }

  // Apply preferences to document
  applyToDocument(): void {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    const body = document.body
    
    // Apply theme using both data attribute and class for maximum compatibility
    root.setAttribute('data-theme', this.preferences.theme)
    
    // Remove existing theme classes
    body.classList.remove('light', 'dark', 'high-contrast')
    root.classList.remove('light', 'dark', 'high-contrast')
    
    // Add new theme class
    body.classList.add(this.preferences.theme)
    root.classList.add(this.preferences.theme)
    
    // Apply high contrast
    root.classList.toggle('high-contrast', this.preferences.highContrast)
    body.classList.toggle('high-contrast', this.preferences.highContrast)
    
    // Apply font size
    root.setAttribute('data-font-size', this.preferences.fontSize)
    
    // Apply reduced motion
    root.setAttribute('data-reduced-motion', this.preferences.reducedMotion.toString())
    
    // Apply screen reader optimizations
    root.setAttribute('data-sr-optimized', this.preferences.screenReaderOptimized.toString())
    
    // Apply theme colors directly to root AND body for maximum compatibility
    const themeColors = {
      light: {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(222.2 84% 4.9%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(222.2 84% 4.9%)'
      },
      dark: {
        background: 'hsl(222.2 84% 4.9%)',
        foreground: 'hsl(210 40% 98%)',
        card: 'hsl(222.2 84% 4.9%)',
        'card-foreground': 'hsl(210 40% 98%)'
      },
      'high-contrast': {
        background: 'hsl(0 0% 100%)',
        foreground: 'hsl(0 0% 0%)',
        card: 'hsl(0 0% 100%)',
        'card-foreground': 'hsl(0 0% 0%)'
      }
    }
    
    const colors = themeColors[this.preferences.theme]
    
    // Apply to root element
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value)
    })
    
    // Also apply direct styles to body for immediate effect
    if (this.preferences.theme === 'dark') {
      body.style.backgroundColor = '#09090b'
      body.style.color = '#fafafa'
    } else if (this.preferences.theme === 'high-contrast') {
      body.style.backgroundColor = '#ffffff'
      body.style.color = '#000000'
    } else {
      body.style.backgroundColor = '#ffffff'
      body.style.color = '#09090b'
    }
    
    // Update meta tag for theme color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      const colors = {
        light: '#ffffff',
        dark: '#09090b',
        'high-contrast': '#000000'
      }
      metaThemeColor.setAttribute('content', colors[this.preferences.theme])
    }
    
    // Debug logging
    console.log('Theme applied:', {
      theme: this.preferences.theme,
      dataTheme: root.getAttribute('data-theme'),
      bodyClasses: body.className,
      rootClasses: root.className,
      highContrast: this.preferences.highContrast,
      bodyStyles: {
        bgColor: body.style.backgroundColor,
        color: body.style.color
      },
      cssVars: {
        background: getComputedStyle(root).getPropertyValue('--background'),
        foreground: getComputedStyle(root).getPropertyValue('--foreground')
      }
    })
  }

  // Get CSS classes for current preferences
  getCSSClasses(): string {
    const classes = []
    
    classes.push(`theme-${this.preferences.theme}`)
    classes.push(`font-size-${this.preferences.fontSize}`)
    
    if (this.preferences.highContrast) classes.push('high-contrast')
    if (this.preferences.reducedMotion) classes.push('reduced-motion')
    if (this.preferences.screenReaderOptimized) classes.push('sr-optimized')
    
    return classes.join(' ')
  }

  // Reset to defaults
  reset(): void {
    this.preferences = { ...defaultPreferences }
    this.savePreferences()
    this.notifyListeners()
  }
}

// Import React for the hook
import React from 'react'

// Hook for React components
export function useAccessibility() {
  const manager = AccessibilityManager.getInstance()
  const [preferences, setPreferences] = React.useState(manager.getPreferences())

  React.useEffect(() => {
    return manager.subscribe(setPreferences)
  }, [])

  const updatePreferences = React.useCallback((updates: Partial<AccessibilityPreferences>) => {
    manager.updatePreferences(updates)
  }, [])

  return {
    preferences,
    updatePreferences,
    setTheme: manager.setTheme.bind(manager),
    setFontSize: manager.setFontSize.bind(manager),
    toggleHighContrast: manager.toggleHighContrast.bind(manager),
    toggleReducedMotion: manager.toggleReducedMotion.bind(manager),
    toggleAudio: manager.toggleAudio.bind(manager),
    setSpeechRate: manager.setSpeechRate.bind(manager),
    reset: manager.reset.bind(manager)
  }
}