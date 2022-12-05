import { CookieSerializeOptions, serialize } from 'cookie'
import Cors from 'cors'
import { createProxyServer } from 'http-proxy'
import { NextApiHandler } from 'next'
import { parse } from 'set-cookie-parser'
import { version } from '../../package.json'
import { ReactRuntime } from '../react'
import isErrorWithMessage from '../utils/isErrorWithMessage'

type Fonts = Font[]

type Font = {
  family: string
  variants: FontVariant[]
}

type FontVariant = { weight: string; style: 'italic' | 'normal'; src?: string }

type MakeswiftApiHandlerConfig = {
  appOrigin?: string
  getFonts?: () => Fonts | Promise<Fonts>
}

export type MakeswiftApiHandlerErrorResponse = { message: string }
export type MakeswiftApiHandlerRevalidateErrorResponse = string
export type MakeswiftApiHandlerRevalidateResponse = { revalidated: boolean }
export type MakeswiftApiHandlerManifestResponse = { version: string; previewMode: boolean }
export type MakeswiftApiHandlerFontsResponse = Fonts
export type MakeswiftApiHandlerElementTreeResponse = { elementTree: any }

export type MakeswiftApiHandlerResponse =
  | MakeswiftApiHandlerErrorResponse
  | MakeswiftApiHandlerRevalidateErrorResponse
  | MakeswiftApiHandlerRevalidateResponse
  | MakeswiftApiHandlerManifestResponse
  | MakeswiftApiHandlerFontsResponse
  | MakeswiftApiHandlerElementTreeResponse

export function MakeswiftApiHandler(
  apiKey: string,
  { appOrigin = 'https://app.makeswift.com', getFonts }: MakeswiftApiHandlerConfig = {},
): NextApiHandler<MakeswiftApiHandlerResponse> {
  const cors = Cors({ origin: appOrigin })
  const previewModeProxy = createProxyServer()

  previewModeProxy.on('proxyReq', proxyReq => {
    proxyReq.removeHeader('X-Makeswift-Preview-Mode')

    const url = new URL(proxyReq.path, 'http://n')

    url.searchParams.delete('x-makeswift-preview-mode')

    proxyReq.path = url.pathname + url.search
  })

  if (typeof apiKey !== 'string') {
    throw new Error(
      'The Makeswift Next.js API handler must be passed a valid Makeswift site API key: ' +
        "`MakeswiftApiHandler('<makeswift_site_api_key>')`\n" +
        `Received "${apiKey}" instead.`,
    )
  }

  return async function makeswiftApiHandler(req, res) {
    await new Promise<void>((resolve, reject) => {
      cors(req, res, err => {
        if (err instanceof Error) reject(err)
        else resolve()
      })
    })

    const { makeswift } = req.query

    if (!Array.isArray(makeswift)) {
      throw new Error(
        'The Makeswift Next.js API handler must be used in a dynamic catch-all route named `[...makeswift]`.\n' +
          `Received "${makeswift}" for the \`makeswift\` param instead.\n` +
          'Read more about dynamic catch-all routes here: https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes',
      )
    }

    const action = makeswift.join('/')

    switch (action) {
      case 'manifest': {
        if (req.query.secret !== apiKey) return res.status(401).json({ message: 'Unauthorized' })

        return res.json({
          version,
          previewMode: true,
        })
      }

      case 'revalidate': {
        if (req.query.secret !== apiKey) {
          return res.status(401).json({ message: 'Unauthorized' })
        }

        if (typeof req.query.path !== 'string') {
          return res.status(400).json({ message: 'Bad Request' })
        }

        const revalidate = res.revalidate ?? res.unstable_revalidate

        if (typeof revalidate !== 'function') {
          const message =
            `Cannot revalidate path "${req.query.path}" because \`revalidate\` function does not exist in API handler response. ` +
            'Please update to Next.js v12.2.0 or higher for support for on-demand revalidation.\n' +
            'Read more here: https://nextjs.org/blog/next-12-2#on-demand-incremental-static-regeneration-stable'

          console.warn(message)

          return res.json({ revalidated: false })
        }

        try {
          await revalidate(req.query.path)

          return res.json({ revalidated: true })
        } catch (error) {
          if (isErrorWithMessage(error)) {
            return res.status(500).json({ message: error.message })
          }

          return res.status(500).json({ message: 'Error Revalidating' })
        }
      }

      case 'proxy-preview-mode': {
        if (req.query.secret !== apiKey) return res.status(401).send('Unauthorized')

        const host = req.headers.host

        if (host == null) return res.status(400).send('Bad Request')

        const forwardedProto = req.headers['x-forwarded-proto']
        const isForwardedProtoHttps =
          typeof forwardedProto === 'string' && forwardedProto === 'https'

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

      case 'fonts': {
        const fonts = (await getFonts?.()) ?? []
        return res.json(fonts)
      }

      case 'element-tree': {
        const elementTree = req.body.elementTree
        const replacementContext = req.body.replacementContext

        if (elementTree == null) {
          return res.status(400).json({ message: 'elementTree must be defined' })
        }

        if (replacementContext == null) {
          return res.status(400).json({ message: 'replacementContext must be defined' })
        }

        const generatedElementTree = ReactRuntime.copyElementTree(elementTree, replacementContext)

        const response = { elementTree: generatedElementTree }
        return res.json(response)
      }

      default:
        return res.status(404).json({ message: 'Not Found' })
    }
  }
}
