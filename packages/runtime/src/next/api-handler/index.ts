import Cors from 'cors'
import { NextApiHandler } from 'next'
import { Match, match as matchPattern } from 'path-to-regexp'
import { APIResource } from '../../api'
import { Makeswift } from '../client'

import elementTree, { ElementTreeResponse } from './handlers/element-tree'
import fonts, { Font, FontsResponse, GetFonts } from './handlers/fonts'
import manifest, { Manifest, ManifestResponse } from './handlers/manifest'
import proxyPreviewMode, { ProxyPreviewModeResponse } from './handlers/proxy-preview-mode'
import { revalidate, RevalidationResponse } from './handlers/revalidate'

export type { Manifest, Font }

type MakeswiftApiHandlerConfig = {
  appOrigin?: string
  apiOrigin?: string
  getFonts?: GetFonts
}

type NotFoundError = { message: string }

export type MakeswiftApiHandlerResponse =
  | ManifestResponse
  | RevalidationResponse
  | ProxyPreviewModeResponse
  | FontsResponse
  | ElementTreeResponse
  | APIResource
  | NotFoundError

export function MakeswiftApiHandler(
  apiKey: string,
  {
    appOrigin = 'https://app.makeswift.com',
    apiOrigin = 'https://api.makeswift.com',
    getFonts,
  }: MakeswiftApiHandlerConfig = {},
): NextApiHandler<MakeswiftApiHandlerResponse> {
  const cors = Cors({ origin: appOrigin })

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

    const client = new Makeswift(apiKey, { apiOrigin })
    const action = '/' + makeswift.join('/')
    const matches = <T extends object>(pattern: string): Match<T> =>
      matchPattern<T>(pattern, { decode: decodeURIComponent })(action)

    let m

    if (matches('/manifest')) return manifest(req, res, { apiKey })

    if (matches('/revalidate')) return revalidate(req, res, { apiKey })

    if (matches('/proxy-preview-mode')) return proxyPreviewMode(req, res, { apiKey })

    if (matches('/fonts')) return fonts(req, res, { getFonts })

    if (matches('/element-tree')) return elementTree(req, res)

    const handleResource = <T extends APIResource>(resource: T | null): void =>
      resource === null ? res.status(404).json({ message: 'Not Found' }) : res.json(resource)

    if ((m = matches<{ id: string }>('/swatches/:id'))) {
      return client.getSwatch(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/files/:id'))) {
      return client.getFile(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/typographies/:id'))) {
      return client.getTypography(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/global-elements/:id'))) {
      return client.getGlobalElement(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/page-pathname-slices/:id'))) {
      return client.getPagePathnameSlice(m.params.id).then(handleResource)
    }

    if ((m = matches<{ id: string }>('/tables/:id'))) {
      return client.getTable(m.params.id).then(handleResource)
    }

    return res.status(404).json({ message: 'Not Found' })
  }
}
