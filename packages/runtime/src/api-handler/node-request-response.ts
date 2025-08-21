import { type IncomingMessage, type ServerResponse } from 'node:http'
import { type ApiRequest, type ApiResponse } from '../api-handler/request-response'

export function requestHeaders(headers: IncomingMessage['headers']): Headers {
  const result = new Headers()
  for (const [key, value] of Object.entries(headers)) {
    if (value != null) {
      if (Array.isArray(value)) {
        value.forEach(v => result.append(key, v))
      } else {
        result.append(key, value)
      }
    }
  }

  return result
}

export function toApiRequest(req: IncomingMessage & { body: any }): ApiRequest {
  return {
    headers: requestHeaders(req.headers),
    method: req.method ?? 'GET',
    url: req.url ?? '',
    json() {
      return req.body
    },
  }
}

export async function pipeResponseTo(apiResponse: ApiResponse, res: ServerResponse): Promise<void> {
  const headers = responseHeaders(apiResponse.headers)
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  res.statusCode = apiResponse.status

  try {
    if (apiResponse.body) {
      await pipeTo(apiResponse.body, res)
    }

    res.end()
  } catch (error) {
    if (!res.headersSent) {
      res.statusCode = 500
      res.end()
    } else {
      res.destroy(error instanceof Error ? error : new Error(`${error}`))
    }
  }
}

function responseHeaders(headers: Headers): Record<string, string | string[]> {
  return [...headers.entries()].reduce<Record<string, string | string[]>>((acc, [key, value]) => {
    if (key in acc) {
      const existingValue = acc[key]
      if (Array.isArray(existingValue)) {
        existingValue.push(value)
      } else {
        acc[key] = [existingValue, value]
      }
    } else {
      acc[key] = value
    }
    return acc
  }, {})
}

async function pipeTo(stream: ReadableStream<Uint8Array>, res: ServerResponse): Promise<void> {
  const reader = stream.getReader()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    res.write(value)
  }
}
