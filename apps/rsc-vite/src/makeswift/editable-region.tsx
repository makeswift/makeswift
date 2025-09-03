'use client'

import React, { type ComponentProps } from 'react'

import {
  MakeswiftComponent,
  ReactRuntimeProvider,
  type SiteVersion,
} from '@makeswift/express-react'

import { MakeswiftComponentType } from '@makeswift/runtime'

import { runtime } from './runtime'
import { MAKESWIFT_API_ORIGIN, MAKESWIFT_APP_ORIGIN } from './env'

type Props = Pick<
  ComponentProps<typeof MakeswiftComponent>,
  'snapshot' | 'label'
> & {
  siteVersion: SiteVersion | null
}

export function EditableRegion({ snapshot, label, siteVersion }: Props) {
  return (
    <ReactRuntimeProvider
      siteVersion={siteVersion}
      runtime={runtime}
      apiOrigin={MAKESWIFT_API_ORIGIN}
      appOrigin={MAKESWIFT_APP_ORIGIN}
    >
      <MakeswiftComponent
        snapshot={snapshot}
        label={label}
        type={MakeswiftComponentType.Box}
      />
    </ReactRuntimeProvider>
  )
}
