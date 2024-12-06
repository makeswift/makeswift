'use client'

import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export function Blog({ children }: Props) {
  return <div>{children}</div>
}
