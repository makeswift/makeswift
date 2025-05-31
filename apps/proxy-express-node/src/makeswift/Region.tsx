'use client'

import React from 'react'
import { runtime } from './runtime'
import {
  MakeswiftComponent,
  ReactRuntimeProvider,
} from '@makeswift/runtime/next'
import { ComponentPropsWithoutRef } from 'react'
import { MakeswiftComponentType } from '@makeswift/runtime'
import './components'

type Props = {
  snapshot: ComponentPropsWithoutRef<typeof MakeswiftComponent>['snapshot']
  label: ComponentPropsWithoutRef<typeof MakeswiftComponent>['label']
  previewMode: boolean
}

export function Region({ snapshot, label, previewMode }: Props) {
  return (
    <ReactRuntimeProvider previewMode={previewMode} runtime={runtime}>
      {/* Using MakeswiftComponent instead of Slot for easier debugging */}
      <MakeswiftComponent
        snapshot={snapshot}
        label={label}
        type={MakeswiftComponentType.Box}
      />
    </ReactRuntimeProvider>
  )
}
