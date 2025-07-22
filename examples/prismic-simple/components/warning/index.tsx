import { ReactNode } from 'react'

import clsx from 'clsx'

interface WarningProps {
  children: React.ReactNode
}

export function Warning({ children }: WarningProps) {
  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-yellow-800">
      <div className="flex">
        <div className="ml-3">
          <p className="text-sm">{children}</p>
        </div>
      </div>
    </div>
  )
}
