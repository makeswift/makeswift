'use client'

import { type PropsWithChildren } from 'react'

import {
  RootStyleRegistry as ReactRootStyleRegistry,
  type RootStyleProps,
} from '../runtimes/react/root-style-registry'

export function NextRootStyleRegistry({
  children,
  classNamePrefix,
  enableCssReset,
}: PropsWithChildren<RootStyleProps>) {
  return (
    <ReactRootStyleRegistry classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
      {children}
    </ReactRootStyleRegistry>
  )
}
