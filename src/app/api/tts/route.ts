import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { text, language = 'id-ID', rate = 0.9 } = await request.json()

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      )
    }

    // Create ZAI instance
    const zai = await ZAI.create()

    // Use ZAI for text-to-speech conversion
    // Since ZAI doesn't have direct TTS, we'll use it to generate a response
    // that includes instructions for TTS processing
    const response = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that processes text for text-to-speech conversion. Format the text to be more suitable for speech synthesis by adding proper punctuation and pauses.'
        },
        {
          role: 'user',
          content: `Please format this text for better speech synthesis in Indonesian language: ${text}`
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    })

    const formattedText = response.choices[0]?.message?.content || text

    // In a real implementation, you would use a proper TTS service here
    // For now, we'll return the formatted text and let the client handle TTS
    return NextResponse.json({
      success: true,
      formattedText: formattedText,
      originalText: text,
      language: language,
      rate: rate,
      message: 'Text formatted for speech synthesis. Use client-side Speech Synthesis API for audio generation.'
    })

  } catch (error: any) {
    console.error('TTS API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process text for speech synthesis',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'TTS API endpoint. Use POST to convert text to speech format.',
    usage: {
      method: 'POST',
      body: {
        text: 'string (required)',
        language: 'string (optional, default: id-ID)',
        rate: 'number (optional, default: 0.9)'
      }
    }
  })
}