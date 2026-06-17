import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'stream'

import { type ReactNode } from 'react'

import {
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

export function renderHtml(
  children: ReactNode,
  { classNamePrefix, enableCssReset }: RootStyleProps = {},
): Promise<{ html: string }> {
  return new Promise((resolve, reject) => {
    let html = ''

    const { pipe } = renderToPipeableStream(
      <RootStyleRegistry classNamePrefix={classNamePrefix} enableCssReset={enableCssReset}>
        {children}
      </RootStyleRegistry>,
      {
        onAllReady() {
          pipe(
            new Writable({
              write(chunk, _enc, cb) {
                html += chunk
                cb()
              },
              final() {
                resolve({ html })
              },
            }),
          )
        },
        onError: reject,
      },
    )
  })
}
