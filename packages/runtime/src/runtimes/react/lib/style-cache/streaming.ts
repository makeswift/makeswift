import { createStyleCache, styleTagHtml, type BaseStyleCache } from './base'

export type StreamingStyleCache = BaseStyleCache & {
  stylesStream: ReadableStream<Uint8Array>
  closeStream: () => void
}

export const createStreamingStyleCache = ({ key }: { key?: string } = {}): StreamingStyleCache => {
  const cache = createStyleCache({ key })

  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  return {
    ...cache,

    insert(...args) {
      const serialized = args[1]
      const shouldStream = cache.inserted[serialized.name] === undefined

      cache.insert(...args)

      if (shouldStream) {
        const css = cache.inserted[serialized.name] as string
        if (css) {
          writer.ready.then(() => {
            const styleTag = styleTagHtml({
              cacheKey: cache.key,
              classNames: [serialized.name],
              css,
            })

            writer.write(encoder.encode(styleTag))
          })
        }
      }
    },

    stylesStream: readable,
    closeStream() {
      writer.close()
    },
  }
}
