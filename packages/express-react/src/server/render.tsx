import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'stream'

import { type ReactNode } from 'react'

import {
  createMakeswiftStylesRegistry,
  RootStyleRegistry,
  type RootStyleProps,
} from '@makeswift/runtime/unstable-framework-support'

export function renderHtml(
  children: ReactNode,
  { classNamePrefix, enableCssReset }: RootStyleProps = {},
): Promise<{ getStyles: () => string; html: string }> {
  const stylesRegistry = createMakeswiftStylesRegistry()
  const getStyles = () => stylesRegistry.serializeToHtmlStyleTags()

  return new Promise((resolve, reject) => {
    let html = ''

    const { pipe } = renderToPipeableStream(
      <RootStyleRegistry
        classNamePrefix={classNamePrefix}
        enableCssReset={enableCssReset}
        stylesRegistry={stylesRegistry}
        shouldRenderStyleElements={false}
      >
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
