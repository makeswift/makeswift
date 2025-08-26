import React, { type ComponentProps } from 'react'

import {
  MakeswiftComponent,
  ReactRuntimeProvider,
  type SiteVersion,
} from '@makeswift/express-react'

import { MakeswiftComponentType } from '@makeswift/runtime'

import { runtime } from './runtime'

import './components'

type Props = Pick<ComponentProps<typeof MakeswiftComponent>, 'snapshot' | 'label'> & {
  siteVersion: SiteVersion | null
}

export function EditableRegion({ snapshot, label, siteVersion }: Props) {
  return (
    <ReactRuntimeProvider siteVersion={siteVersion} runtime={runtime}>
      <MakeswiftComponent snapshot={snapshot} label={label} type={MakeswiftComponentType.Box} />
    </ReactRuntimeProvider>
  )
}
