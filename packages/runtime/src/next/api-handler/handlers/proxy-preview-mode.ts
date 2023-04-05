import { CookieSerializeOptions, serialize } from 'cookie'
import { createProxyServer } from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'set-cookie-parser'

const previewModeProxy = createProxyServer()

type ProxyPreviewModeError = string

export type ProxyPreviewModeResponse = ProxyPreviewModeError

export default async function proxyPreviewMode(
  req: NextApiRequest,
  res: NextApiResponse<ProxyPreviewModeError>,
  { apiKey }: { apiKey: string },
): Promise<void> {
  previewModeProxy.on('proxyReq', proxyReq => {
    proxyReq.removeHeader('X-Makeswift-Preview-Mode')

    const url = new URL(proxyReq.path, 'http://n')

    url.searchParams.delete('x-makeswift-preview-mode')

    proxyReq.path = url.pathname + url.search
  })

  if (req.query.secret !== apiKey) return res.status(401).send('Unauthorized')

  const host = req.headers.host

  if (host == null) return res.status(400).send('Bad Request')

  const forwardedProto = req.headers['x-forwarded-proto']
  const isForwardedProtoHttps = typeof forwardedProto === 'string' && forwardedProto === 'https'

  const forwardedSSL = req.headers['x-forwarded-ssl']
  const isForwardedSSL = typeof forwardedSSL === 'string' && forwardedSSL === 'on'

  const proto = isForwardedProtoHttps || isForwardedSSL ? 'https' : 'http'
  let target = `${proto}://${host}`

  // During local development we want to use the local Next.js address for proxying. The
  // reason we want to do this is that the user might be using a local SSL proxy to deal with
  // mixed content browser limitations. If the user generates a locally-trusted CA for their
  // SSL cert, it's likely that Node.js won't trust this CA unless they used the
  // `NODE_EXTRA_CA_CERTS` option (see https://stackoverflow.com/a/68135600). To provide a
  // better developer experience, instead of requiring the user to provide the CA to Node.js,
  // we just proxy directly to the running Next.js process.
  if (process.env['NODE_ENV'] !== 'production') {
    const port = req.socket.localPort

    if (port != null) target = `http://localhost:${port}`
  }

  const setCookie = res.setPreviewData({ makeswift: true }).getHeader('Set-Cookie')
  res.removeHeader('Set-Cookie')

  if (!Array.isArray(setCookie)) return res.status(500).send('Internal Server Error')

  const cookie = parse(setCookie)
    .map(cookie => serialize(cookie.name, cookie.value, cookie as CookieSerializeOptions))
    .join(';')

  return await new Promise<void>((resolve, reject) =>
    previewModeProxy.web(req, res, { target, headers: { cookie } }, err => {
      if (err) reject(err)
      else resolve()
    }),
  )
}
