'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  ariaLabel?: string
}

export function Breadcrumb({ 
  items, 
  className, 
  ariaLabel = 'Navigasi breadcrumb' 
}: BreadcrumbProps) {
  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label={ariaLabel}
    >
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
        aria-label="Beranda"
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Beranda</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ) : (
            <span 
              className="text-foreground font-medium"
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Hook to generate breadcrumb from current path
export function useBreadcrumb(pathname: string): BreadcrumbItem[] {
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbMap: { [key: string]: string } = {
    'materials': 'Materi Pembelajaran',
    'quiz': 'Kuis Interaktif',
    'about': 'Tentang',
    'settings': 'Pengaturan',
    'accessibility': 'Aksesibilitas'
  }

  return pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    
    return {
      label: breadcrumbMap[segment] || segment,
      href: isLast ? undefined : href,
      current: isLast
    }
  })
}