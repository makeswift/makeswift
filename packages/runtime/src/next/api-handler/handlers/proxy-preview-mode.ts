import { CookieSerializeOptions, serialize } from 'cookie'
import { createProxyServer } from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'set-cookie-parser'

type ProxyPreviewModeError = string

export type ProxyPreviewModeResponse = ProxyPreviewModeError

export default async function proxyPreviewMode(
  req: NextApiRequest,
  res: NextApiResponse<ProxyPreviewModeError>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  const previewModeProxy = createProxyServer()

  previewModeProxy.once('proxyReq', proxyReq => {
    proxyReq.removeHeader('X-Makeswift-Preview-Mode')

    // The following headers are Next.js-specific and are removed to prevent Next.js from
    // short-circuiting requests, breaking routing.
    proxyReq.removeHeader('X-Invoke-Path')
    proxyReq.removeHeader('X-Invoke-Query')

    const url = new URL(proxyReq.path, 'http://n')

    url.searchParams.delete('x-makeswift-preview-mode')

    proxyReq.path = url.pathname + url.search
  })

  if (req.query.secret !== apiKey) return res.status(401).send('Unauthorized')

  const host = req.headers.host

  if (host == null) return res.status(400).send('Bad Request')

  const forwardedProtoHeader = req.headers['x-forwarded-proto']

  let forwardedProto: string[] = []
  if (Array.isArray(forwardedProtoHeader)) {
    forwardedProto = forwardedProtoHeader
  } else if (typeof forwardedProtoHeader === 'string') {
    forwardedProto = forwardedProtoHeader.split(',')
  }

  const isForwardedProtoHttps = forwardedProto.includes('https')

  const forwardedSSL = req.headers['x-forwarded-ssl']
  const isForwardedSSL = typeof forwardedSSL === 'string' && forwardedSSL === 'on'

  const proto = isForwardedProtoHttps || isForwardedSSL ? 'https' : 'http'
  let target = `${proto}://${host}`

  // If the user generates a locally-trusted CA for their SSL cert, it's likely that Node.js won't
  // trust this CA unless they used the `NODE_EXTRA_CA_CERTS` option
  // (see https://stackoverflow.com/a/68135600). To provide a better developer experience, instead
  // of requiring the user to provide the CA to Node.js, we don't enforce SSL during local
  // development.
  const secure = process.env['NODE_ENV'] === 'production'

  const setCookie = res.setPreviewData({ makeswift: true }).getHeader('Set-Cookie')
  res.removeHeader('Set-Cookie')

  if (!Array.isArray(setCookie)) return res.status(500).send('Internal Server Error')

  const cookie = parse(setCookie)
    .map(cookie => serialize(cookie.name, cookie.value, cookie as CookieSerializeOptions))
    .join(';')

  return await new Promise<void>((resolve, reject) =>
    previewModeProxy.web(req, res, { target, headers: { cookie }, secure }, err => {
      if (err) reject(err)
      else resolve()
    }),
  )
}
