'use client'

import { useEffect, useState } from 'react'
import { Code } from 'lucide-react'

interface CodeHighlightProps {
  code: string
  language?: string
  theme?: 'light' | 'dark' | 'github-dark' | 'github-light'
  className?: string
  showLineNumbers?: boolean
}

export function CodeHighlight({ 
  code, 
  language = 'typescript', 
  theme = 'github-dark',
  className = '',
  showLineNumbers = true 
}: CodeHighlightProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const highlightCode = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const { createHighlighter } = await import('shiki')
        
        const highlighter = await createHighlighter({
          themes: [theme],
          langs: [language, 'typescript', 'javascript', 'tsx', 'jsx', 'css', 'html', 'json', 'bash'],
        })

        const html = highlighter.codeToHtml(code, {
          lang: language,
          theme: theme,
          lineOptions: showLineNumbers ? {
            includeLineNumbers: true,
          } : undefined,
        })

        setHighlightedCode(html)
      } catch (error) {
        console.error('Error highlighting code:', error)
        // Fallback to simple pre tag
        setHighlightedCode(`<pre class="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto"><code>${code}</code></pre>`)
      } finally {
        setIsLoading(false)
      }
    }

    highlightCode()
  }, [code, language, theme, showLineNumbers])

  if (isLoading) {
    return (
      <div className={`p-4 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center gap-2 ${className}`}>
        <Code className="h-4 w-4 animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading code...</span>
      </div>
    )
  }

  return (
    <div 
      className={`rounded-md overflow-x-auto ${className}`}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  )
}

// Preset configurations for common use cases
export const CodeBlock = {
  typescript: (code: string, className?: string) => (
    <CodeHighlight code={code} language="typescript" className={className} />
  ),
  javascript: (code: string, className?: string) => (
    <CodeHighlight code={code} language="javascript" className={className} />
  ),
  css: (code: string, className?: string) => (
    <CodeHighlight code={code} language="css" className={className} />
  ),
  html: (code: string, className?: string) => (
    <CodeHighlight code={code} language="html" className={className} />
  ),
  json: (code: string, className?: string) => (
    <CodeHighlight code={code} language="json" className={className} />
  ),
  bash: (code: string, className?: string) => (
    <CodeHighlight code={code} language="bash" className={className} />
  ),
}