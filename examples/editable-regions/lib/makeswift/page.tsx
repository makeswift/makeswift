import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { Page as MakeswiftPage } from '@makeswift/runtime/next'

import { getPageSnapshot } from './client'

export async function Page({ path, locale }: { path: string; locale?: string }) {
  const snapshot = await getPageSnapshot({ path, locale })

  if (snapshot == null) {
    await connection() // Next.js 15 workaround to ensure non-published pages are editable in the builder
    return notFound()
  }

  return <MakeswiftPage snapshot={snapshot} />
}
