import { ReactNode } from 'react'
import { MakeswiftClient } from '../../../api/react'
import { Element as ReactPageElement } from '../../../state/react-page'
import { ReactRuntime } from '../react-runtime'
import dynamic from 'next/dynamic'

type RuntimeProviderProps = {
  client: MakeswiftClient
  preview: boolean
  rootElements?: Map<string, ReactPageElement>
  children?: ReactNode
  runtime?: ReactRuntime
}

const PreviewProvider = dynamic(() => import('./PreviewProvider'))
const LiveProvider = dynamic(() => import('./LiveProvider'))

export function RuntimeProvider({ preview, ...props }: RuntimeProviderProps): JSX.Element {
  return preview ? <PreviewProvider {...props} /> : <LiveProvider {...props} />
}
