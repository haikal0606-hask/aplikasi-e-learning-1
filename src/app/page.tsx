'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Headphones, Users, Settings, Volume2, VolumeX, Sun, Moon, Contrast, Type, Eye } from 'lucide-react'
import Link from 'next/link'
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider'
import { Breadcrumb } from '@/components/accessibility/Breadcrumb'
import { StatusMessage } from '@/components/accessibility/LiveRegion'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt'
import { ThemeTest } from '@/components/debug/ThemeTest'
import { SimpleThemeTest } from '@/components/debug/SimpleThemeTest'

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const { preferences, toggleAudio, setTheme, setFontSize, toggleHighContrast } = useAccessibilityContext()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch(e.key) {
          case '1':
            navigateToSection('home')
            break
          case '2':
            navigateToSection('materials')
            break
          case '3':
            navigateToSection('quiz')
            break
          case '4':
            navigateToSection('accessibility')
            break
          case 't':
            cycleTheme()
            break
          case 'f':
            cycleFontSize()
            break
          case 'c':
            toggleHighContrast()
            break
          case 'm':
            toggleAudio()
            break
          case 's':
            toggleSpeech()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [preferences])

  const navigateToSection = (section: string) => {
    const sectionNames: { [key: string]: string } = {
      home: 'beranda',
      materials: 'materi pembelajaran',
      quiz: 'kuis',
      accessibility: 'pengaturan aksesibilitas'
    }
    
    const message = `Berpindah ke halaman ${sectionNames[section]}`
    announceText(message)
    
    // Navigate to actual pages
    switch(section) {
      case 'materials':
        window.location.href = '/materials'
        break
      case 'quiz':
        window.location.href = '/quiz'
        break
      case 'accessibility':
        document.getElementById('accessibility-controls')?.scrollIntoView({ behavior: 'smooth' })
        break
      default:
        break
    }
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'high-contrast'> = ['light', 'dark', 'high-contrast']
    const currentIndex = themes.indexOf(preferences.theme)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    setTheme(nextTheme)
    
    const themeNames = {
      light: 'terang',
      dark: 'gelap',
      'high-contrast': 'kontras tinggi'
    }
    announceText(`Tema diubah ke mode ${themeNames[nextTheme]}`)
  }

  const cycleFontSize = () => {
    const fontSizes: Array<'small' | 'medium' | 'large' | 'extra-large'> = ['small', 'medium', 'large', 'extra-large']
    const currentIndex = fontSizes.indexOf(preferences.fontSize)
    const nextFontSize = fontSizes[(currentIndex + 1) % fontSizes.length]
    setFontSize(nextFontSize)
    
    const sizeNames = {
      small: 'kecil',
      medium: 'sedang',
      large: 'besar',
      'extra-large': 'sangat besar'
    }
    announceText(`Ukuran teks diubah ke ${sizeNames[nextFontSize]}`)
  }

  const announceText = (text: string) => {
    if ('speechSynthesis' in window && preferences.audioEnabled) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = preferences.speechRate
      window.speechSynthesis.speak(utterance)
    }
    
    // Also update live region
    setAnnouncement(text)
    setTimeout(() => setAnnouncement(''), 100)
  }

  const toggleSpeech = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      announceText('Pembaca suara dimatikan')
    } else {
      const welcomeText = 'Selamat datang di aplikasi pembelajaran untuk penyandang tunanetra. Gunakan tombol tab untuk navigasi atau Alt 1 sampai 4 untuk menu cepat. Alt T untuk mengubah tema, Alt F untuk mengubah ukuran teks.'
      announceText(welcomeText)
      setIsSpeaking(true)
    }
  }

  const handleCardClick = (title: string, description: string) => {
    announceText(`${title}. ${description}`)
  }

  return (
    <div className="min-h-screen bg-background text-foreground" role="application" aria-label="Aplikasi Pembelajaran Tunanetra">
      {/* Status Message for Screen Readers */}
      <StatusMessage message={announcement} politeness="polite" />

      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
      >
        Langsung ke konten utama
      </a>

      <header className="border-b bg-card" role="banner">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between" role="navigation" aria-label="Navigasi Utama" id="main-navigation">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold" tabIndex={0} aria-label="Judul Utama: Aplikasi Pembelajaran Tunanetra">
                Aplikasi Pembelajaran Tunanetra
              </h1>
            </div>
            <div className="flex items-center gap-2" role="group" aria-label="Kontrol Aksesibilitas Cepat">
              {/* Theme Control */}
              <Button
                variant="outline"
                size="sm"
                onClick={cycleTheme}
                aria-label={`Tema saat ini: ${preferences.theme}. Klik untuk mengubah tema`}
                className="flex items-center gap-2"
                suppressHydrationWarning
              >
                {preferences.theme === 'light' && <Sun className="h-4 w-4" />}
                {preferences.theme === 'dark' && <Moon className="h-4 w-4" />}
                {preferences.theme === 'high-contrast' && <Contrast className="h-4 w-4" />}
                <span className="sr-only">Tema</span>
              </Button>
              
              {/* Font Size Control */}
              <Button
                variant="outline"
                size="sm"
                onClick={cycleFontSize}
                aria-label={`Ukuran teks saat ini: ${preferences.fontSize}. Klik untuk mengubah ukuran`}
                className="flex items-center gap-2"
              >
                <Type className="h-4 w-4" />
                <span className="sr-only">Ukuran Teks</span>
              </Button>
              
              {/* Speech Control */}
              <Button
                variant={isSpeaking ? "default" : "outline"}
                size="sm"
                onClick={toggleSpeech}
                aria-label={isSpeaking ? "Matikan pembaca suara" : "Aktifkan pembaca suara"}
                aria-pressed={isSpeaking}
                suppressHydrationWarning
              >
                {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="sr-only">Pembaca Suara</span>
              </Button>
              
              {/* Audio Control */}
              <Button
                variant={preferences.audioEnabled ? "default" : "outline"}
                size="sm"
                onClick={toggleAudio}
                aria-label={preferences.audioEnabled ? "Matikan audio" : "Aktifkan audio"}
                aria-pressed={preferences.audioEnabled}
                suppressHydrationWarning
              >
                {preferences.audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <span className="sr-only">Audio</span>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8" role="main" id="main-content">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[]} />
        </div>

        {/* Welcome Section */}
        <section aria-label="Selamat Datang" className="mb-8">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" tabIndex={0}>
                <Eye className="h-5 w-5" />
                Selamat Datang di Platform Pembelajaran Inklusif
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base leading-relaxed mb-4" tabIndex={0}>
                Aplikasi ini dirancang khusus untuk penyandang tunanetra dengan fitur aksesibilitas lengkap. Nikmati pengalaman belajar yang optimal dengan pembaca suara, navigasi keyboard, dan berbagai pengaturan yang dapat disesuaikan.
              </p>
              
              {/* Quick Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-muted rounded-lg" suppressHydrationWarning>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Tema Saat Ini
                  </h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {preferences.theme === 'light' ? 'Terang' : preferences.theme === 'dark' ? 'Gelap' : 'Kontras Tinggi'}
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Ukuran Teks
                  </h4>
                  <p className="text-sm text-muted-foreground capitalize">
                    {preferences.fontSize === 'small' ? 'Kecil' : 
                     preferences.fontSize === 'medium' ? 'Sedang' : 
                     preferences.fontSize === 'large' ? 'Besar' : 'Sangat Besar'}
                  </p>
                </div>
                
                <div className="p-4 bg-muted rounded-lg" suppressHydrationWarning>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    Status Audio
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {preferences.audioEnabled ? 'Aktif' : 'Nonaktif'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Keyboard Shortcuts Guide */}
        <section aria-label="Panduan Penggunaan Cepat" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Panduan Keyboard Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Navigasi:</h4>
                  <ul className="space-y-1 text-sm" role="list">
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>1</kbd> : Beranda</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>2</kbd> : Materi Pembelajaran</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>3</kbd> : Kuis</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>4</kbd> : Pengaturan Aksesibilitas</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Pengaturan Aksesibilitas:</h4>
                  <ul className="space-y-1 text-sm" role="list">
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>T</kbd> : Ubah tema</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>F</kbd> : Ubah ukuran teks</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>C</kbd> : Kontras tinggi</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>M</kbd> : Audio on/off</li>
                    <li role="listitem"><kbd>Alt</kbd> + <kbd>S</kbd> : Pembaca suara</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Main Menu */}
        <section aria-label="Menu Utama" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card 
            className="cursor-pointer transition-all hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-primary"
            tabIndex={0}
            role="button"
            aria-label={`Materi Pembelajaran. Akses berbagai materi pembelajaran yang telah disesuaikan untuk penyandang tunanetra dengan dukungan audio. Tekan Enter untuk membuka.`}
            onClick={() => handleCardClick('Materi Pembelajaran', 'Akses berbagai materi pembelajaran yang telah disesuaikan untuk penyandang tunanetra dengan dukungan audio.')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick('Materi Pembelajaran', 'Akses berbagai materi pembelajaran yang telah disesuaikan untuk penyandang tunanetra dengan dukungan audio.')
              }
            }}
          >
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2" aria-hidden="true" />
              <CardTitle>Materi Pembelajaran</CardTitle>
              <CardDescription>
                Akses berbagai materi pembelajaran yang telah disesuaikan untuk penyandang tunanetra dengan dukungan audio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/materials">
                <Button 
                  className="w-full" 
                  aria-label="Buka Materi Pembelajaran"
                  onClick={() => announceText('Membuka halaman materi pembelajaran')}
                >
                  Mulai Belajar
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-primary"
            tabIndex={0}
            role="button"
            aria-label={`Kuis Interaktif. Uji pemahaman Anda dengan kuis interaktif yang dilengkapi dengan umpan balik audio. Tekan Enter untuk membuka.`}
            onClick={() => handleCardClick('Kuis Interaktif', 'Uji pemahaman Anda dengan kuis interaktif yang dilengkapi dengan umpan balik audio.')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick('Kuis Interaktif', 'Uji pemahaman Anda dengan kuis interaktif yang dilengkapi dengan umpan balik audio.')
              }
            }}
          >
            <CardHeader>
              <Users className="h-8 w-8 mb-2" aria-hidden="true" />
              <CardTitle>Kuis Interaktif</CardTitle>
              <CardDescription>
                Uji pemahaman Anda dengan kuis interaktif yang dilengkapi dengan umpan balik audio.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/quiz">
                <Button 
                  className="w-full"
                  aria-label="Buka Kuis Interaktif"
                  onClick={() => announceText('Membuka halaman kuis interaktif')}
                >
                  Mulai Kuis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Accessibility Controls Card */}
          <Card 
            className="cursor-pointer transition-all hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-primary"
            tabIndex={0}
            role="button"
            aria-label="Pengaturan Aksesibilitas. Sesuaikan pengaturan aksesibilitas sesuai kebutuhan Anda. Tekan Enter untuk membuka."
            onClick={() => handleCardClick('Pengaturan Aksesibilitas', 'Sesuaikan pengaturan aksesibilitas sesuai kebutuhan Anda.')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleCardClick('Pengaturan Aksesibilitas', 'Sesuaikan pengaturan aksesibilitas sesuai kebutuhan Anda.')
              }
            }}
          >
            <CardHeader>
              <Settings className="h-8 w-8 mb-2" aria-hidden="true" />
              <CardTitle>Pengaturan Aksesibilitas</CardTitle>
              <CardDescription>
                Sesuaikan pengaturan aksesibilitas sesuai kebutuhan Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                aria-label="Buka Pengaturan Aksesibilitas"
                onClick={() => {
                  announceText('Membuka pengaturan aksesibilitas')
                  document.getElementById('accessibility-controls')?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                Buka Pengaturan
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Accessibility Controls Section */}
        <section aria-label="Pengaturan Aksesibilitas Lengkap" className="mt-8">
          <AccessibilityControls />
        </section>

        {/* Additional Information */}
        <section aria-label="Informasi Tambahan" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Headphones className="h-5 w-5" aria-hidden="true" />
                Tentang Aplikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed" tabIndex={0}>
                Aplikasi pembelajaran ini dirancang khusus untuk penyandang tunanetra dengan fitur-fitur aksesibilitas lengkap. 
                Semua konten dapat diakses melalui pembaca layar dan dilengkapi dengan dukungan audio untuk pengalaman belajar yang optimal.
                Aplikasi memenuhi standar WCAG 2.1 Level AA dengan rasio kontras minimal 4.5:1 dan navigasi keyboard yang lengkap.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t bg-card mt-12" role="contentinfo">
        <div className="container mx-auto px-4 py-4 text-center text-muted-foreground">
          <p tabIndex={0}>
            © 2024 Aplikasi Pembelajaran Tunanetra. Dirancang dengan aksesibilitas sebagai prioritas utama. 
            Memenuhi standar WCAG 2.1 Level AA.
          </p>
        </div>
      </footer>

      {/* Debug Theme Test */}
      <ThemeTest />
      <SimpleThemeTest />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  )
}