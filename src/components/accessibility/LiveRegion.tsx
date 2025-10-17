'use client'

import React, { useEffect, useRef } from 'react'

interface LiveRegionProps {
  children: React.ReactNode
  politeness?: 'polite' | 'assertive' | 'off'
  atomic?: boolean
  relevant?: 'additions' | 'removals' | 'text' | 'all'
  busy?: boolean
}

export function LiveRegion({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text',
  busy = false
}: LiveRegionProps) {
  const regionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (regionRef.current) {
      // Announce to screen readers
      const textContent = regionRef.current.textContent
      if (textContent && politeness !== 'off') {
        // Use a small delay to ensure the content is rendered
        setTimeout(() => {
          if (regionRef.current) {
            regionRef.current.setAttribute('aria-live', politeness)
          }
        }, 100)
      }
    }
  }, [children, politeness])

  return (
    <div
      ref={regionRef}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      aria-busy={busy}
      className="sr-only"
    >
      {children}
    </div>
  )
}

// Hook for announcing messages
export function useAnnouncement() {
  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return

    // Create a temporary live region
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', politeness)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message

    document.body.appendChild(liveRegion)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(liveRegion)
    }, 1000)
  }

  return { announce }
}

// Component for status messages
export function StatusMessage({ message, politeness = 'polite' }: { 
  message: string 
  politeness?: 'polite' | 'assertive' 
}) {
  return (
    <LiveRegion politeness={politeness}>
      {message}
    </LiveRegion>
  )
}