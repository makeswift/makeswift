'use client'

import {
  Page as MakeswiftPage,
  PageProps as MakeswiftPageProps,
} from '@makeswift/runtime/next'

export default function ClientMakeswiftPage({ snapshot }: MakeswiftPageProps) {
  return <MakeswiftPage snapshot={snapshot} />
}
