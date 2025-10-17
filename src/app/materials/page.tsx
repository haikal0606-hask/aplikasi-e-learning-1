'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, BookOpen, Headphones, PauseCircle, PlayCircle, Volume2, VolumeX } from 'lucide-react'
import { useAccessibilityContext } from '@/components/accessibility/AccessibilityProvider'
import { Breadcrumb, useBreadcrumb } from '@/components/accessibility/Breadcrumb'
import { StatusMessage } from '@/components/accessibility/LiveRegion'
import { AccessibilityControls } from '@/components/accessibility/AccessibilityControls'
import Link from 'next/link'

interface LearningMaterial {
  id: string
  title: string
  description: string
  content: string
  category: string
  difficulty: string
  duration: string
}

const learningMaterials: LearningMaterial[] = [
  {
    id: '1',
    title: 'Pengenalan Komputer Dasar',
    description: 'Mempelajari dasar-dasar penggunaan komputer untuk pemula',
    content: `Komputer adalah perangkat elektronik yang dapat menerima input, memproses data, dan menghasilkan output. 
    Untuk penyandang tunanetra, terdapat perangkat lunak pembaca layar seperti JAWS atau NVDA yang dapat membaca teks di layar secara suara.
    Keyboard adalah input utama yang digunakan, dengan shortcut seperti Alt+Tab untuk berpindah jendela dan Ctrl+C untuk menyalin.
    Mouse tidak terlalu penting karena semua fungsi dapat diakses melalui keyboard.`,
    category: 'Teknologi',
    difficulty: 'Pemula',
    duration: '15 menit'
  },
  {
    id: '2',
    title: 'Aplikasi Pembaca Layar',
    description: 'Panduan lengkap penggunaan aplikasi pembaca layar',
    content: `Aplikasi pembaca layar adalah perangkat lunak yang mengubah teks digital menjadi suara atau braille.
    Beberapa aplikasi populer adalah NVDA (gratis), JAWS (berbayar), dan VoiceOver (bawaan Mac).
    Cara kerja pembaca layar: membaca teks di layar, mengumumkan elemen interaktif, dan memberikan konteks navigasi.
    Shortcut penting: Tab untuk berpindah elemen, Enter untuk mengaktifkan, dan panah untuk membaca konten.`,
    category: 'Teknologi',
    difficulty: 'Menengah',
    duration: '20 menit'
  },
  {
    id: '3',
    title: 'Braille Digital',
    description: 'Mengenal sistem Braille digital dan penggunaannya',
    content: `Braille digital adalah representasi teks Braille pada perangkat elektronik.
    Display Braille adalah perangkat keras yang menampilkan teks Braille dengan pin yang naik turun.
    Keuntungan Braille digital: privasi membaca, kecepatan membaca lebih tinggi, dan akses ke materi digital.
    Perangkat bisa terhubung ke komputer atau smartphone melalui USB atau Bluetooth.`,
    category: 'Teknologi',
    difficulty: 'Menengah',
    duration: '18 menit'
  },
  {
    id: '4',
    title: 'Aksesibilitas Web',
    description: 'Memahami standar aksesibilitas untuk website',
    content: `Aksesibilitas web memastikan semua orang dapat mengakses konten online, termasuk penyandang disabilitas.
    Standar WCAG (Web Content Accessibility Guidelines) memberikan panduan untuk membuat website yang dapat diakses.
    Prinsip utama: Perceivable (dapat dipahami), Operable (dapat dioperasikan), Understandable (dapat dimengerti), Robust (kokoh).
    Fitur penting: ARIA labels, heading structure, keyboard navigation, dan alt text untuk gambar.`,
    category: 'Teknologi',
    difficulty: 'Lanjutan',
    duration: '25 menit'
  }
]

export default function MaterialsPage() {
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterial | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentPosition, setCurrentPosition] = useState(0)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch(e.key) {
          case 'ArrowLeft':
            if (selectedMaterial) {
              stopReading()
              setSelectedMaterial(null)
            }
            break
          case 'ArrowRight':
            if (selectedMaterial) {
              toggleReading()
            }
            break
          case 'm':
            toggleMute()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedMaterial, isReading])

  const announceText = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const startReading = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      
      utterance.onend = () => {
        setIsReading(false)
      }
      
      window.speechSynthesis.speak(utterance)
      setIsReading(true)
    }
  }

  const stopReading = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      setIsReading(false)
    }
  }

  const toggleReading = () => {
    if (selectedMaterial) {
      if (isReading) {
        stopReading()
      } else {
        startReading(selectedMaterial.content)
      }
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      stopReading()
      announceText('Suara dimatikan')
    } else {
      announceText('Suara diaktifkan kembali')
    }
  }

  const selectMaterial = (material: LearningMaterial) => {
    setSelectedMaterial(material)
    announceText(`Memilih materi: ${material.title}. ${material.description}`)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'Pemula': return 'bg-green-100 text-green-800'
      case 'Menengah': return 'bg-yellow-100 text-yellow-800'
      case 'Lanjutan': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (selectedMaterial) {
    return (
      <div className="min-h-screen bg-background text-foreground" role="main">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    stopReading()
                    setSelectedMaterial(null)
                  }}
                  aria-label="Kembali ke daftar materi"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali
                </Button>
                <h1 className="text-xl font-bold">{selectedMaterial.title}</h1>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={isReading ? "default" : "outline"}
                  size="sm"
                  onClick={toggleReading}
                  aria-label={isReading ? "Jeda pembacaan" : "Mulai pembacaan"}
                  aria-pressed={isReading}
                >
                  {isReading ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
                  <span className="sr-only">Kontrol Pembacaan</span>
                </Button>
                <Button
                  variant={isMuted ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
                  aria-pressed={isMuted}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedMaterial.category}</Badge>
                  <Badge className={getDifficultyColor(selectedMaterial.difficulty)}>
                    {selectedMaterial.difficulty}
                  </Badge>
                  <Badge variant="outline">{selectedMaterial.duration}</Badge>
                </div>
              </div>
              <CardDescription className="text-lg">
                {selectedMaterial.description}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Konten Materi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none text-lg leading-relaxed"
                tabIndex={0}
                role="article"
                aria-label="Konten materi pembelajaran"
              >
                {selectedMaterial.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4" tabIndex={0}>
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Kontrol Navigasi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Keyboard Shortcut:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li><kbd>Alt</kbd> + <kbd>←</kbd> : Kembali ke daftar</li>
                    <li><kbd>Alt</kbd> + <kbd>→</kbd> : Mulai/Jeda pembacaan</li>
                    <li><kbd>Alt</kbd> + <kbd>M</kbd> : Matikan/Aktifkan suara</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Tips Pembacaan:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Gunakan Tab untuk navigasi antar paragraf</li>
                    <li>• Tekan Enter untuk membaca paragraf yang dipilih</li>
                    <li>• Gunakan tombol kontrol untuk mengatur pembacaan</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground" role="main">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" aria-label="Kembali ke beranda">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Beranda
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Materi Pembelajaran</h1>
            </div>
            <Button
              variant={isMuted ? "destructive" : "outline"}
              size="sm"
              onClick={toggleMute}
              aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
              aria-pressed={isMuted}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section aria-label="Daftar Materi Pembelajaran">
          <div className="grid gap-6 md:grid-cols-2">
            {learningMaterials.map((material) => (
              <Card 
                key={material.id}
                className="cursor-pointer transition-all hover:scale-105 focus:scale-105 focus:outline-none focus:ring-4 focus:ring-primary"
                tabIndex={0}
                role="button"
                aria-label={`${material.title}. ${material.description}. Kategori: ${material.category}. Kesulitan: ${material.difficulty}. Durasi: ${material.duration}. Tekan Enter untuk memilih.`}
                onClick={() => selectMaterial(material)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    selectMaterial(material)
                  }
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{material.title}</CardTitle>
                      <CardDescription className="text-base">
                        {material.description}
                      </CardDescription>
                    </div>
                    <BookOpen className="h-6 w-6 ml-4 mt-1 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Badge variant="secondary">{material.category}</Badge>
                    <Badge className={getDifficultyColor(material.difficulty)}>
                      {material.difficulty}
                    </Badge>
                    <Badge variant="outline">{material.duration}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    aria-label={`Pilih materi ${material.title}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectMaterial(material)
                    }}
                  >
                    <Headphones className="h-4 w-4 mr-2" />
                    Mulai Belajar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section aria-label="Panduan Penggunaan" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Panduan Penggunaan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Navigasi:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Gunakan Tab untuk berpindah antar materi</li>
                    <li>• Tekan Enter pada materi yang dipilih</li>
                    <li>• Gunakan Alt+M untuk kontrol suara</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Fitur Aksesibilitas:</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Pembaca suara otomatis untuk semua konten</li>
                    <li>• Navigasi keyboard lengkap</li>
                    <li>• ARIA labels untuk screen reader</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  )
}