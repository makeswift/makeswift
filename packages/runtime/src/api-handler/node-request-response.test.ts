import type { IncomingMessage, ServerResponse } from 'node:http'

import { requestHeaders, pipeResponseTo } from './node-request-response'
import { ApiResponse } from './request-response'

describe('requestHeaders', () => {
  test('converts IncomingMessage headers to Fetch API Request headers', () => {
    // Arrange
    const incomingHeaders: IncomingMessage['headers'] = {
      'accept-language': 'en-US',
      'set-cookie': [
        'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly',
        'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly',
      ],
      'cache-control': undefined,
    }

    // Act
    const headers = requestHeaders(incomingHeaders)

    // Assert
    expect(headers.get('accept-language')).toBe('en-US')
    expect(headers.get('set-cookie')).toEqual(
      [
        'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly',
        'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly',
      ].join(', '),
    )
    expect(headers.has('cache-control')).toBe(false)
  })
})

describe('pipeResponseTo', () => {
  const createStream = (chunks: Uint8Array[]) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const c of chunks) controller.enqueue(c)
        controller.close()
      },
    })

  const createFailingStream = () =>
    new ReadableStream({
      start(controller) {
        controller.error(new Error('boom'))
      },
    })

  const textChunk = (s: string) => new TextEncoder().encode(s)

  const serverResponseMock = ({
    headersSent = false,
  }): Pick<
    ServerResponse,
    'statusCode' | 'headersSent' | 'setHeader' | 'write' | 'end' | 'destroy'
  > => ({
    statusCode: 500,
    headersSent,
    setHeader: jest.fn(),
    write: jest.fn().mockImplementation(() => {
      headersSent = true
    }),
    end: jest.fn(),
    destroy: jest.fn(),
  })

  test('sets headers, statusCode, writes body and ends the response', async () => {
    // Arrange
    const headers = new Headers([
      ['accept-language', 'en-US'],
      ['set-cookie', 'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly'],
      ['set-cookie', 'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly'],
    ])

    const apiResponse = new Response(createStream([textChunk('hello '), textChunk('world')]), {
      headers,
      status: 201,
    })

    const res = serverResponseMock({})

    // Act
    await pipeResponseTo(apiResponse, res as ServerResponse)

    // Assert
    expect(res.statusCode).toBe(201)
    expect(res.setHeader).toHaveBeenCalledWith('accept-language', 'en-US')
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', [
      'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly',
      'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly',
    ])

    expect(res.write).toHaveBeenCalledTimes(2)
    expect(res.write).toHaveBeenNthCalledWith(1, textChunk('hello '))
    expect(res.write).toHaveBeenNthCalledWith(2, textChunk('world'))
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  test('correctly streams API redirect response', async () => {
    // Arrange
    const headers = new Headers([
      ['set-cookie', 'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly'],
      ['set-cookie', 'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly'],
    ])

    const res = serverResponseMock({})

    // Act
    await pipeResponseTo(
      ApiResponse.redirect('/api/makeswift/exit-preview', { headers }),
      res as ServerResponse,
    )

    expect(res.statusCode).toBe(307)
    expect(res.setHeader).toHaveBeenCalledWith('location', '/api/makeswift/exit-preview')
    expect(res.setHeader).toHaveBeenCalledWith('set-cookie', [
      'cookie1=oreo; Domain=makeswift.com; Secure; HttpOnly',
      'cookie2=chocolate-chip; Domain=makeswift.com; Partitioned; Secure; HttpOnly',
    ])
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  test("responds with 500 on stream error if headers haven't been sent", async () => {
    // Arrange
    const apiResponse = new Response(createFailingStream(), {
      headers: new Headers(),
      status: 200,
    })

    const res = serverResponseMock({})

    // Act
    await pipeResponseTo(apiResponse, res as ServerResponse)

    // Assert
    expect(res.statusCode).toBe(500)
    expect(res.end).toHaveBeenCalled()
  })

  test('aborts the response on stream error after headers have been sent', async () => {
    // Arrange
    const apiResponse = new Response(createFailingStream(), {
      headers: new Headers(),
      status: 200,
    })

    const res = serverResponseMock({ headersSent: true })

    // Act
    await pipeResponseTo(apiResponse, res as ServerResponse)

    // Assert
    expect(res.destroy).toHaveBeenCalledWith(expect.objectContaining({ message: 'boom' }))
    expect(res.end).not.toHaveBeenCalled()
  })
})
