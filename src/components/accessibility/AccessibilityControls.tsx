'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Sun, 
  Moon, 
  Contrast, 
  Type, 
  Volume2, 
  VolumeX, 
  Activity, 
  RotateCcw,
  Eye,
  EyeOff,
  Zap,
  Settings
} from 'lucide-react'
import { useAccessibilityContext } from './AccessibilityProvider'
import { AccessibilityPreferences } from '@/lib/accessibility'

export function AccessibilityControls() {
  const {
    preferences,
    setTheme,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    toggleAudio,
    setSpeechRate,
    reset
  } = useAccessibilityContext()

  const themes = [
    { value: 'light' as const, label: 'Terang', icon: Sun },
    { value: 'dark' as const, label: 'Gelap', icon: Moon },
    { value: 'high-contrast' as const, label: 'Kontras Tinggi', icon: Contrast }
  ]

  const fontSizes = [
    { value: 'small' as const, label: 'Kecil', className: 'text-sm' },
    { value: 'medium' as const, label: 'Sedang', className: 'text-base' },
    { value: 'large' as const, label: 'Besar', className: 'text-lg' },
    { value: 'extra-large' as const, label: 'Sangat Besar', className: 'text-xl' }
  ]

  const speechRates = [
    { value: 0.5, label: 'Sangat Lambat' },
    { value: 0.75, label: 'Lambat' },
    { value: 0.9, label: 'Normal' },
    { value: 1.1, label: 'Cepat' },
    { value: 1.5, label: 'Sangat Cepat' }
  ]

  return (
    <Card className="w-full max-w-2xl" id="accessibility-controls">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Pengaturan Aksesibilitas
        </CardTitle>
        <CardDescription>
          Sesuaikan tampilan dan pengaturan sesuai kebutuhan Anda. Semua perubahan akan disimpan otomatis.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Tema Tampilan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {themes.map(({ value, label, icon: Icon }) => (
              <Button
                key={value}
                variant={preferences.theme === value ? 'default' : 'outline'}
                onClick={() => setTheme(value)}
                className="flex items-center gap-2 h-12"
                aria-pressed={preferences.theme === value}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Font Size */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Type className="h-4 w-4" />
            Ukuran Teks
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {fontSizes.map(({ value, label, className }) => (
              <Button
                key={value}
                variant={preferences.fontSize === value ? 'default' : 'outline'}
                onClick={() => setFontSize(value)}
                className={`h-12 ${className}`}
                aria-pressed={preferences.fontSize === value}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Speech Rate */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Kecepatan Suara
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {speechRates.map(({ value, label }) => (
              <Button
                key={value}
                variant={Math.abs(preferences.speechRate - value) < 0.1 ? 'default' : 'outline'}
                onClick={() => setSpeechRate(value)}
                className="h-12 text-sm"
                aria-pressed={Math.abs(preferences.speechRate - value) < 0.1}
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Toggle Options */}
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Opsi Tambahan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant={preferences.highContrast ? 'default' : 'outline'}
              onClick={toggleHighContrast}
              className="flex items-center gap-2 h-12 justify-start"
              aria-pressed={preferences.highContrast}
            >
              {preferences.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Kontras Tinggi
            </Button>

            <Button
              variant={preferences.reducedMotion ? 'default' : 'outline'}
              onClick={toggleReducedMotion}
              className="flex items-center gap-2 h-12 justify-start"
              aria-pressed={preferences.reducedMotion}
            >
              <Activity className="h-4 w-4" />
              Kurangi Animasi
            </Button>

            <Button
              variant={preferences.audioEnabled ? 'default' : 'outline'}
              onClick={toggleAudio}
              className="flex items-center gap-2 h-12 justify-start"
              aria-pressed={preferences.audioEnabled}
            >
              {preferences.audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              Audio Aktif
            </Button>

            <Button
              variant="outline"
              onClick={reset}
              className="flex items-center gap-2 h-12 justify-start"
            >
              <RotateCcw className="h-4 w-4" />
              Reset ke Default
            </Button>
          </div>
        </div>

        {/* Current Settings Summary */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Pengaturan Saat Ini</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Tema: {themes.find(t => t.value === preferences.theme)?.label}
            </Badge>
            <Badge variant="secondary">
              Font: {fontSizes.find(f => f.value === preferences.fontSize)?.label}
            </Badge>
            <Badge variant="secondary">
              Suara: {preferences.audioEnabled ? 'Aktif' : 'Nonaktif'}
            </Badge>
            {preferences.highContrast && (
              <Badge variant="secondary">Kontras Tinggi</Badge>
            )}
            {preferences.reducedMotion && (
              <Badge variant="secondary">Animasi Dikurangi</Badge>
            )}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">Pintasan Keyboard</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div><kbd>Alt</kbd> + <kbd>T</kbd> : Ganti tema</div>
            <div><kbd>Alt</kbd> + <kbd>F</kbd> : Perbesar teks</div>
            <div><kbd>Alt</kbd> + <kbd>C</kbd> : Kontras tinggi</div>
            <div><kbd>Alt</kbd> + <kbd>M</kbd> : Audio on/off</div>
            <div><kbd>Alt</kbd> + <kbd>R</kbd> : Kurangi animasi</div>
            <div><kbd>Alt</kbd> + <kbd>D</kbd> : Reset pengaturan</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}