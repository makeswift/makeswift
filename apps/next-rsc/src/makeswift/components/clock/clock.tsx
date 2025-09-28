'use client'

import { useEffect, useState } from 'react'

type Format = 'time' | 'datetime'

type Props = {
  className?: string
  format?: Format
}

export function Clock({ className, format = 'datetime' }: Props) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={className} suppressHydrationWarning>
      {formatTime(time, format)}
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
