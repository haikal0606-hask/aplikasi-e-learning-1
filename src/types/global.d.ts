import { BeforeInstallPromptEvent } from '@/components/pwa/PWAInstallPrompt'

declare global {
  interface Window {
    deferredPrompt?: BeforeInstallPromptEvent
  }
}

export {}