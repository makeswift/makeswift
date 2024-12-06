'use client'

import { ReactNode } from 'react'

import { useEntry } from '@/components/Dato/entries/Blog/BlogPost.hooks'

type Props = {
  children: ReactNode
}

export function Blog({ children }: Props) {
  const entry = useEntry()

  console.log({ children, entry })
  return <div>{children}</div>
}
