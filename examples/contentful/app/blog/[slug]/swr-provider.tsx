'use client'

import { SWRConfig } from 'swr'

interface Props {
  fallback: { [key: string]: unknown }
  children: React.ReactNode
}

export const SWRProvider = ({ fallback, children }: Props) => {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>
}
