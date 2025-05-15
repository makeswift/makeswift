import { MakeswiftProvider } from 'lib/makeswift/provider'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ]
}

export default function Home() {
  return (
    <MakeswiftProvider previewMode={false}>
      <p>Test</p>
    </MakeswiftProvider>
  )
}
