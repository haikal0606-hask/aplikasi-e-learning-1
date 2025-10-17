'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface SkipLink {
  id: string
  label: string
}

interface SkipLinksProps {
  links?: SkipLink[]
}

export function SkipLinks({ links = [] }: SkipLinksProps) {
  const defaultLinks: SkipLink[] = [
    { id: 'main-content', label: 'Langsung ke konten utama' },
    { id: 'main-navigation', label: 'Langsung ke navigasi utama' },
    { id: 'search', label: 'Langsung ke pencarian' },
    { id: 'accessibility-controls', label: 'Langsung ke kontrol aksesibilitas' }
  ]

  const skipLinks = [...defaultLinks, ...links]

  return (
    <div className="sr-only focus-within:not-sr-only">
      <div className="fixed top-0 left-0 z-50 flex flex-col p-4 bg-background border-2 border-primary shadow-lg">
        {skipLinks.map((link) => (
          <Button
            key={link.id}
            asChild
            variant="outline"
            size="sm"
            className="mb-2 justify-start text-left"
          >
            <a href={`#${link.id}`} className="block w-full">
              {link.label}
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}