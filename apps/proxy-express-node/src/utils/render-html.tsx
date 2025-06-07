import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'stream'

export function renderHtml(element: React.ReactElement): Promise<string> {
  return new Promise((resolve, reject) => {
    let html = ''

    const { pipe } = renderToPipeableStream(element, {
      onAllReady() {
        pipe(
          new Writable({
            write(chunk, _enc, cb) {
              html += chunk
              cb()
            },
            final() {
              resolve(html)
            },
          }),
        )
      },
      onError: reject,
    })
  })
}
