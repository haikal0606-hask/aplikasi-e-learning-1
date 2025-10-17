'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle, XCircle, Headphones, Volume2, VolumeX, RotateCcw } from 'lucide-react'
import Link from 'next/link'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  category: string
}

const quizQuestions: Question[] = [
  {
    id: 1,
    question: "Apa fungsi utama dari aplikasi pembaca layar (screen reader)?",
    options: [
      "Membesarkan teks di layar",
      "Mengubah teks digital menjadi suara atau braille",
      "Mengubah warna tampilan",
      "Mempercepat koneksi internet"
    ],
    correctAnswer: 1,
    explanation: "Aplikasi pembaca layar berfungsi mengubah teks digital menjadi suara atau braille sehingga penyandang tunanetra dapat mengakses informasi digital.",
    category: "Teknologi"
  },
  {
    id: 2,
    question: "Shortcut keyboard apa yang paling umum digunakan untuk berpindah antar elemen di website?",
    options: [
      "Ctrl + Tab",
      "Alt + Tab",
      "Tab",
      "Shift + Tab"
    ],
    correctAnswer: 2,
    explanation: "Tombol Tab adalah shortcut yang paling umum digunakan untuk berpindah antar elemen interaktif di website, sedangkan Shift + Tab untuk berpindah ke belakang.",
    category: "Navigasi"
  },
  {
    id: 3,
    question: "Apa keuntungan utama menggunakan display braille digital?",
    options: [
      "Lebih murah dari pembaca suara",
      "Memberikan privasi membaca dan kecepatan lebih tinggi",
      "Bekerja tanpa baterai",
      "Dapat digunakan di tempat yang sangat bising"
    ],
    correctAnswer: 1,
    explanation: "Display braille digital memberikan privasi membaca karena hanya pengguna yang dapat merasakan teks, serta kecepatan membaca lebih tinggi bagi yang mahir braille.",
    category: "Teknologi"
  },
  {
    id: 4,
    question: "Apa itu WCAG dalam konteks aksesibilitas web?",
    options: [
      "Web Content Accessibility Guidelines",
      "World Computer Accessibility Group",
      "Web Coding Accessibility Generator",
      "Wireless Computer Access Gateway"
    ],
    correctAnswer: 0,
    explanation: "WCAG (Web Content Accessibility Guidelines) adalah standar internasional untuk membuat konten web yang dapat diakses oleh semua orang, termasuk penyandang disabilitas.",
    category: "Standar"
  },
  {
    id: 5,
    question: "Atribut HTML apa yang paling penting untuk aksesibilitas gambar?",
    options: [
      "src",
      "class",
      "alt",
      "title"
    ],
    correctAnswer: 2,
    explanation: "Atribut 'alt' (alternative text) sangat penting untuk aksesibilitas gambar karena memberikan deskripsi teks yang dapat dibaca oleh screen reader.",
    category: "HTML"
  }
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isMuted, setIsMuted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch(e.key) {
          case '1':
          case '2':
          case '3':
          case '4':
            const answerIndex = parseInt(e.key) - 1
            if (answerIndex < quizQuestions[currentQuestion].options.length) {
              selectAnswer(answerIndex)
            }
            break
          case 'Enter':
            if (showResult) {
              nextQuestion()
            } else if (selectedAnswer !== null) {
              submitAnswer()
            }
            break
          case 'm':
            toggleMute()
            break
          case 'r':
            resetQuiz()
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentQuestion, selectedAnswer, showResult])

  const announceText = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'id-ID'
      utterance.rate = 0.9
      window.speechSynthesis.speak(utterance)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (!isMuted) {
      announceText('Suara dimatikan')
    } else {
      announceText('Suara diaktifkan kembali')
    }
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    const answerText = quizQuestions[currentQuestion].options[answerIndex]
    announceText(`Jawaban ${answerIndex + 1}: ${answerText}`)
  }

  const submitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === quizQuestions[currentQuestion].correctAnswer
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (isCorrect) {
      setScore(score + 1)
      announceText(`Jawaban benar! ${quizQuestions[currentQuestion].explanation}`)
    } else {
      const correctAnswer = quizQuestions[currentQuestion].options[quizQuestions[currentQuestion].correctAnswer]
      announceText(`Jawaban salah. Jawaban yang benar adalah: ${correctAnswer}. ${quizQuestions[currentQuestion].explanation}`)
    }

    setShowResult(true)
  }

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      announceQuestion()
    } else {
      setQuizCompleted(true)
      announceResults()
    }
  }

  const announceQuestion = () => {
    const question = quizQuestions[currentQuestion]
    const questionText = `Pertanyaan ${currentQuestion + 1} dari ${quizQuestions.length}: ${question.question}. Pilihan: ${question.options.map((opt, i) => `${i + 1}. ${opt}`).join('. ')}`
    announceText(questionText)
  }

  const announceResults = () => {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    const resultText = `Kuis selesai! Skor Anda: ${score} dari ${quizQuestions.length} atau ${percentage}%. ${percentage >= 80 ? 'Luar biasa!' : percentage >= 60 ? 'Bagus!' : 'Terus berlatih!'}`
    announceText(resultText)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
    setQuizCompleted(false)
    announceText('Kuis diatur ulang. Pertanyaan 1:')
    setTimeout(() => announceQuestion(), 1000)
  }

  useEffect(() => {
    announceQuestion()
  }, [])

  if (quizCompleted) {
    const percentage = Math.round((score / quizQuestions.length) * 100)
    
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
                <h1 className="text-2xl font-bold">Hasil Kuis</h1>
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
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-4">
                {percentage >= 80 ? '🎉 Luar Biasa!' : percentage >= 60 ? '👏 Bagus!' : '💪 Terus Berlatih!'}
              </CardTitle>
              <div className="text-6xl font-bold text-primary mb-4">
                {score}/{quizQuestions.length}
              </div>
              <CardDescription className="text-xl">
                Skor Anda: {percentage}%
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-lg mb-6">
                    {percentage >= 80 
                      ? 'Anda telah menguasai materi dengan sangat baik!'
                      : percentage >= 60
                      ? 'Anda sudah memahami materi dengan baik.'
                      : 'Jangan menyerah, terus belajar dan mencoba lagi!'}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Rincian Jawaban:</h3>
                  <div className="space-y-2">
                    {quizQuestions.map((question, index) => {
                      const userAnswer = answers[index]
                      const isCorrect = userAnswer === question.correctAnswer
                      return (
                        <div key={question.id} className="flex items-center gap-2 p-2 rounded">
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-600" />
                          )}
                          <span className="flex-1">
                            Pertanyaan {index + 1}: {isCorrect ? 'Benar' : 'Salah'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    onClick={resetQuiz}
                    className="flex-1"
                    aria-label="Ulangi kuis"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Ulangi Kuis
                  </Button>
                  <Link href="/materials" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Pelajari Lagi
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const question = quizQuestions[currentQuestion]

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
              <h1 className="text-2xl font-bold">Kuis Interaktif</h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" aria-label={`Pertanyaan ${currentQuestion + 1} dari ${quizQuestions.length}`}>
                {currentQuestion + 1} / {quizQuestions.length}
              </Badge>
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
        <div className="max-w-3xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">{question.category}</Badge>
                <Badge variant="outline">Skor: {score}</Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed" tabIndex={0}>
                {currentQuestion + 1}. {question.question}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3" role="radiogroup" aria-label="Pilihan jawaban">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:bg-muted'
                    } ${
                      showResult
                        ? index === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : selectedAnswer === index
                          ? 'border-red-500 bg-red-50'
                          : ''
                        : ''
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
                    onClick={() => !showResult && selectAnswer(index)}
                    disabled={showResult}
                    role="radio"
                    aria-checked={selectedAnswer === index}
                    aria-label={`Pilihan ${index + 1}: ${option}`}
                    tabIndex={showResult ? -1 : 0}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {selectedAnswer === index && (
                          <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showResult && index === question.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === index && index !== question.correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`mt-6 p-4 rounded-lg ${
                  selectedAnswer === question.correctAnswer
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start gap-2">
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold mb-1">
                        {selectedAnswer === question.correctAnswer ? 'Benar!' : 'Salah!'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {question.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                {!showResult ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={selectedAnswer === null}
                    className="flex-1"
                    aria-label="Kirim jawaban"
                  >
                    Kirim Jawaban
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    className="flex-1"
                    aria-label={currentQuestion < quizQuestions.length - 1 ? "Pertanyaan berikutnya" : "Lihat hasil"}
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Pertanyaan Berikutnya' : 'Lihat Hasil'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => announceQuestion()}
                  aria-label="Ulangi pertanyaan"
                >
                  <Headphones className="h-4 w-4 mr-2" />
                  Ulangi
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Panduan Keyboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 text-sm text-muted-foreground">
                <div><kbd>Alt</kbd> + <kbd>1-4</kbd> : Pilih jawaban</div>
                <div><kbd>Alt</kbd> + <kbd>Enter</kbd> : Kirim/Lanjut</div>
                <div><kbd>Alt</kbd> + <kbd>M</kbd> : Matikan/Aktifkan suara</div>
                <div><kbd>Alt</kbd> + <kbd>R</kbd> : Ulangi kuis</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}