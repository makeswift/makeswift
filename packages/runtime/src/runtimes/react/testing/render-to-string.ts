import { type ReactNode } from 'react'
import { renderToReadableStream } from 'react-dom/server'

async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()

  let result = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value, { stream: true })
  }

  return result
}

export async function renderToString(element: ReactNode) {
  return await streamToString(await renderToReadableStream(element))
}
