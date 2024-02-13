'use client'

import { runtime } from '@/makeswift/runtime'
import {
  Page as MakeswiftPage,
  PageProps as MakeswiftPageProps,
} from '@makeswift/runtime/next'

export default function ClientMakeswiftPage({
  snapshot,
}: Omit<MakeswiftPageProps, 'runtime'>) {
  return <MakeswiftPage snapshot={snapshot} runtime={runtime} />
}
