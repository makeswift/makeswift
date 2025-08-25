import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'stream'

import { type ReactNode } from 'react'

import {
  createRootStyleCache,
  RootStyleRegistry,
  styleTagHtml,
  type RootStyleProps,
} from '@makeswift/runtime/framework-support'

export function renderHtml(
  children: ReactNode,
  { cacheKey, enableCssReset }: RootStyleProps = {},
): Promise<{ getStyles: () => string; html: string }> {
  const cache = createRootStyleCache({ key: cacheKey })
  const getStyles = () => styleTagHtml({ cacheKey: cache.key, ...cache.flush() })

  return new Promise((resolve, reject) => {
    let html = ''

    const { pipe } = renderToPipeableStream(
      <RootStyleRegistry cache={cache} enableCssReset={enableCssReset}>
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
                resolve({ html, getStyles })
              },
            }),
          )
        },
        onError: reject,
      },
    )
  })
}
