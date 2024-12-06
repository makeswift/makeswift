'use client'

import { Ref, forwardRef, useEffect, useState } from 'react'

import clsx from 'clsx'
import { highlight, languages } from 'prismjs'
import 'prismjs/components/prism-javascript'

import { Copied, Copy } from '@/generated/icons'

type Props = {
  className?: string
  code?: string
  language?: 'js' | string
}

export default function CodeBlock({ className, code = '', language = 'js' }: Props) {
  const selectedLanguage = languages[language] ?? languages.js
  const [html, setHtml] = useState(highlight(code, selectedLanguage, language))
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(
      function () {
        setCopySuccess(true)
      },
      function (err) {
        console.error('Copy failed:', err)
        setCopySuccess(false)
      }
    )
  }

  useEffect(() => {
    setHtml(highlight(code, selectedLanguage, language))
  }, [language, code, selectedLanguage])

  return (
    <div className={clsx('relative', className)}>
      <pre
        className={`language-${language} min-h-[40px] overflow-auto p-4 tracking-normal`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button className="absolute right-4 top-4 text-white" onClick={handleCopy}>
        <div className="flex items-center space-x-2 duration-300">
          {copySuccess ? <Copied fill="white" /> : <Copy fill="white" />}
          <div>{copySuccess ? 'Copied!' : 'Copy'}</div>
        </div>
      </button>
    </div>
  )
}
