'use client'

import { useEffect, useState, type ReactNode } from 'react'

type Format = 'time' | 'datetime'

type Props = {
  className?: string
  format?: Format
  hint: ReactNode
}

export function Clock({ className, hint, format = 'datetime' }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={className} suppressHydrationWarning>
      <div>{formatTime(time, format)}</div>
      {hint}
    </div>
  )
}

function formatTime(time: Date, format: Format) {
  switch (format) {
    case 'time':
      return time.toLocaleTimeString()
    case 'datetime':
      return time.toLocaleString()
  }
}
