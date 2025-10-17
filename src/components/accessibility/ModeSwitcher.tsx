'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Accessibility, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Keyboard,
  MousePointer
} from 'lucide-react'
import { useAccessibilityContext } from './AccessibilityProvider'

export function ModeSwitcher() {
  const { preferences, setMode } = useAccessibilityContext()

  const modes = [
    {
      value: 'normal' as const,
      title: 'Mode Normal',
      description: 'Tampilan standar untuk pengguna umum dengan navigasi mouse dan keyboard biasa.',
      icon: User,
      features: [
        { icon: MousePointer, label: 'Navigasi Mouse' },
        { icon: Eye, label: 'Visual Standar' },
        { icon: VolumeX, label: 'Tanpa Audio' },
        { icon: Keyboard, label: 'Keyboard Biasa' }
      ],
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      value: 'disability' as const,
      title: 'Mode Disabilitas',
      description: 'Tampilan khusus untuk penyandang tunanetra dengan navigasi keyboard dan audio lengkap.',
      icon: Accessibility,
      features: [
        { icon: Keyboard, label: 'Navigasi Keyboard Penuh' },
        { icon: EyeOff, label: 'Screen Reader Support' },
        { icon: Volume2, label: 'Audio Feedback' },
        { icon: Accessibility, label: 'ARIA Labels' }
      ],
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    }
  ]

  const currentMode = modes.find(mode => mode.value === preferences.mode)

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          Pilih Mode Penggunaan
        </CardTitle>
        <CardDescription>
          Pilih mode yang sesuai dengan kebutuhan Anda. Mode disabilitas menawarkan fitur aksesibilitas lengkap.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Mode Badge */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">Mode Aktif:</span>
          <Badge variant={preferences.mode === 'disability' ? 'default' : 'secondary'}>
            {currentMode?.title}
          </Badge>
        </div>

        {/* Mode Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          {modes.map(({ value, title, description, icon: Icon, features, color }) => (
            <div
              key={value}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                preferences.mode === value 
                  ? 'border-primary bg-primary/5' 
                  : `${color} border-border`
              }`}
              onClick={() => setMode(value)}
              role="button"
              tabIndex={0}
              aria-label={`Pilih ${title}. ${description}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setMode(value)
                }
              }}
            >
              {/* Selection Indicator */}
              {preferences.mode === value && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
              )}

              {/* Mode Header */}
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-6 w-6 text-primary" />
                <div>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {description}
                  </p>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Fitur:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {features.map(({ icon: FeatureIcon, label }) => (
                    <div key={label} className="flex items-center gap-1 text-xs">
                      <FeatureIcon className="h-3 w-3" />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selection Button */}
              <Button
                variant={preferences.mode === value ? 'default' : 'outline'}
                size="sm"
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation()
                  setMode(value)
                }}
                aria-pressed={preferences.mode === value}
              >
                {preferences.mode === value ? 'Mode Aktif' : 'Pilih Mode'}
              </Button>
            </div>
          ))}
        </div>

        {/* Mode Information */}
        <div className="border-t pt-4">
          <h4 className="font-semibold mb-2">Informasi Mode:</h4>
          <div className="grid gap-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
              <div>
                <strong>Mode Normal:</strong> Cocok untuk pengguna umum dengan navigasi mouse dan keyboard standar.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5" />
              <div>
                <strong>Mode Disabilitas:</strong> Dirancang khusus untuk penyandang tunanetra dengan screen reader, navigasi keyboard penuh, dan audio feedback.
              </div>
            </div>
          </div>
        </div>

        {/* Quick Switch */}
        <div className="flex justify-center pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode(preferences.mode === 'normal' ? 'disability' : 'normal')}
            className="flex items-center gap-2"
          >
            {preferences.mode === 'normal' ? (
              <>
                <Accessibility className="h-4 w-4" />
                Aktifkan Mode Disabilitas
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Aktifkan Mode Normal
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}